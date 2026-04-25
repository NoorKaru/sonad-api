import { randomUUID } from 'crypto';
import { Router, Request, Response } from 'express';
import { McpServer, StreamableHTTPServerTransport } from './sdk-shim';
import { Services } from '@lib/config/service-locator';
import { registerTools } from './register-tools';
import { registerResources } from './register-resources';
import { registerPrompts } from './register-prompts';

function buildMcpServer(services: Services): McpServer {
	const server = new McpServer({ name: 'estonian-language', version: '1.0.0' });
	registerTools(server, services);
	registerResources(server, services);
	registerPrompts(server);
	return server;
}

export function createMcpRouter(services: Services): Router {
	const router = Router();

	// One transport per connected client session.
	const sessions = new Map<string, StreamableHTTPServerTransport>();

	// New session — POST with no mcp-session-id header
	router.post('/', async (req: Request, res: Response) => {
		const sessionId = req.headers['mcp-session-id'] as string | undefined;

		if (sessionId) {
			// Existing session
			const transport = sessions.get(sessionId);
			if (!transport) {
				res.status(400).json({ error: 'Session not found' });
				return;
			}
			await transport.handleRequest(req, res, req.body);
			return;
		}

		// New session — build server + transport once
		const server = buildMcpServer(services);
		const transport = new StreamableHTTPServerTransport({
			sessionIdGenerator: () => randomUUID(),
		});

		transport.onclose = () => {
			if (transport.sessionId) sessions.delete(transport.sessionId);
			server.close();
		};

		await server.connect(transport);
		await transport.handleRequest(req, res, req.body);

		// Session ID is assigned during handleRequest — store after
		if (transport.sessionId) {
			sessions.set(transport.sessionId, transport);
		}
	});

	// GET — client opens SSE stream for server-initiated messages
	router.get('/', async (req: Request, res: Response) => {
		const sessionId = req.headers['mcp-session-id'] as string | undefined;
		const transport = sessionId ? sessions.get(sessionId) : undefined;
		if (!transport) {
			res.status(400).json({ error: 'Session not found' });
			return;
		}
		await transport.handleRequest(req, res, req.body);
	});

	// DELETE — client terminates a session
	router.delete('/', async (req: Request, res: Response) => {
		const sessionId = req.headers['mcp-session-id'] as string | undefined;
		const transport = sessionId ? sessions.get(sessionId) : undefined;
		if (!transport) {
			res.status(400).json({ error: 'Session not found' });
			return;
		}
		await transport.handleRequest(req, res, req.body);
	});

	return router;
}
