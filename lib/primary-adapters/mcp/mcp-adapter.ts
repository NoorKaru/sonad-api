import { randomUUID } from 'crypto';
import { Router, Request, Response } from 'express';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { Services } from '@lib/config/service-locator';
import { registerTools } from './register-tools.js';
import { registerResources } from './register-resources.js';
import { registerPrompts } from './register-prompts.js';
import config from '@lib/global-config.js';

// SDK requires one McpServer per connection (single _transport slot in Protocol base class).
const SESSION_TTL_MS = config.mcp.sessionTtlMs;
const ALLOWED_ORIGINS = config.mcp.allowedOrigins;

type Session = {
	transport: StreamableHTTPServerTransport;
	server: McpServer;
	timer: ReturnType<typeof setTimeout>;
};

function buildMcpServer(services: Services): McpServer {
	const server = new McpServer({ name: 'estonian-language', version: '1.0.0' });
	registerTools(server, services);
	registerResources(server, services);
	registerPrompts(server);
	return server;
}

// Spec requirement: validate Origin to prevent DNS rebinding attacks.
// Non-browser MCP clients (e.g. Claude Code CLI) send no Origin — those are allowed.
// Browser-originated requests are only allowed if the origin is in the allowlist.
function isOriginAllowed(origin: string | undefined): boolean {
	if (!origin) return true;
	if (ALLOWED_ORIGINS.length === 0) return false;
	return ALLOWED_ORIGINS.includes(origin);
}

export function createMcpRouter(services: Services): Router {
	const router = Router();
	const { logger } = services;

	const sessions = new Map<string, Session>();

	function deleteSession(sessionId: string, reason: 'client' | 'expired'): void {
		const session = sessions.get(sessionId);
		if (!session) return;
		clearTimeout(session.timer);
		sessions.delete(sessionId); // must precede server.close() — closing triggers transport.onclose → deleteSession re-entry
		session.server.close();
		logger.info({
			message: `MCP session ${reason === 'expired' ? 'expired' : 'closed'}`,
			context: 'MCP',
			sessionId,
			reason,
			activeSessions: sessions.size,
		});
	}

	function touchSession(sessionId: string): void {
		const session = sessions.get(sessionId);
		if (!session) return;
		clearTimeout(session.timer);
		session.timer = setTimeout(() => deleteSession(sessionId, 'expired'), SESSION_TTL_MS);
	}

	router.post('/', async (req: Request, res: Response) => {
		const origin = req.headers['origin'] as string | undefined;
		if (!isOriginAllowed(origin)) {
			res.status(403).json({ error: 'Forbidden' });
			return;
		}

		const sessionId = req.headers['mcp-session-id'] as string | undefined;

		if (sessionId) {
			const session = sessions.get(sessionId);
			if (!session) {
				// Spec §session-management: terminated sessions must respond with 404
				// so clients know to start a new session with a fresh InitializeRequest.
				res.status(404).json({ error: 'Session not found' });
				return;
			}
			touchSession(sessionId);
			await session.transport.handleRequest(req, res, req.body);
			return;
		}

		const server = buildMcpServer(services);
		const transport = new StreamableHTTPServerTransport({
			sessionIdGenerator: () => randomUUID(),
		});

		transport.onclose = () => {
			if (transport.sessionId) deleteSession(transport.sessionId, 'client');
		};

		await server.connect(transport);
		await transport.handleRequest(req, res, req.body);

		if (transport.sessionId) {
			const timer = setTimeout(() => deleteSession(transport.sessionId!, 'expired'), SESSION_TTL_MS);
			sessions.set(transport.sessionId, { transport, server, timer });
			logger.info({
				message: 'MCP session created',
				context: 'MCP',
				sessionId: transport.sessionId,
				activeSessions: sessions.size,
			});
		}
	});

	router.get('/', async (req: Request, res: Response) => {
		const origin = req.headers['origin'] as string | undefined;
		if (!isOriginAllowed(origin)) {
			res.status(403).json({ error: 'Forbidden' });
			return;
		}

		const sessionId = req.headers['mcp-session-id'] as string | undefined;
		const session = sessionId ? sessions.get(sessionId) : undefined;
		if (!session) {
			res.status(404).json({ error: 'Session not found' });
			return;
		}
		touchSession(sessionId!);
		await session.transport.handleRequest(req, res, req.body);
	});

	router.delete('/', async (req: Request, res: Response) => {
		const origin = req.headers['origin'] as string | undefined;
		if (!isOriginAllowed(origin)) {
			res.status(403).json({ error: 'Forbidden' });
			return;
		}

		const sessionId = req.headers['mcp-session-id'] as string | undefined;
		const session = sessionId ? sessions.get(sessionId) : undefined;
		if (!session) {
			res.status(404).json({ error: 'Session not found' });
			return;
		}
		await session.transport.handleRequest(req, res, req.body);
	});

	return router;
}
