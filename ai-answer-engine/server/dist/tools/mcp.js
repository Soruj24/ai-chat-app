"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMCPTools = void 0;
const mcp_use_1 = require("mcp-use");
const getMCPTools = async () => {
    try {
        const mcpServersConfig = process.env.MCP_SERVERS_CONFIG;
        if (!mcpServersConfig) {
            return [];
        }
        const servers = JSON.parse(mcpServersConfig);
        const allTools = [];
        for (const server of servers) {
            try {
                console.log(`Connecting to MCP server: ${server.name}...`);
                const connector = new mcp_use_1.StdioConnector({
                    command: server.command,
                    args: server.args,
                    env: process.env,
                });
                const client = new mcp_use_1.MCPClient(connector);
                const tools = await client.getTools();
                allTools.push(...tools);
                await connector.connect();
            }
            catch (err) {
                console.error(`Failed to connect to MCP server ${server.name}:`, err);
            }
        }
        return allTools;
    }
    catch (error) {
        console.warn("Error processing MCP configuration:", error);
        return [];
    }
};
exports.getMCPTools = getMCPTools;
//# sourceMappingURL=mcp.js.map