// The MCP SDK's package.json uses a typesVersions wildcard that redirects all
// sub-path imports (e.g. /server/mcp) to dist/esm/, which TypeScript with
// moduleResolution:node cannot find. And the exports wildcard lacks .js extension,
// so require('@modelcontextprotocol/sdk/server/mcp') fails at runtime too.
//
// Relative imports bypass both issues:
//   - TypeScript finds the .d.ts directly (no typesVersions redirect)
//   - Node.js resolves relative CJS require() paths with automatic .js extension
export { McpServer, ResourceTemplate } from '../../../node_modules/@modelcontextprotocol/sdk/dist/cjs/server/mcp';
export { StreamableHTTPServerTransport } from '../../../node_modules/@modelcontextprotocol/sdk/dist/cjs/server/streamableHttp';
