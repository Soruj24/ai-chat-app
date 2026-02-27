import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

/**
 * MCP Client Utility
 *
 * This is a basic setup for connecting to an MCP server.
 * You can initialize this client to connect to local or remote MCP servers.
 */

export class MCPClient {
  private client: Client;
  private transport: SSEClientTransport;

  constructor(serverUrl: string) {
    this.transport = new SSEClientTransport(new URL(serverUrl));
    this.client = new Client(
      {
        name: "ai-answer-engine-client",
        version: "1.0.0",
      },
      {
        capabilities: {},
      },
    );
  }

  async connect() {
    await this.client.connect(this.transport);
  }

  async listTools() {
    return await this.client.listTools();
  }

  async callTool(name: string, args: Record<string, unknown>) {
    return await this.client.callTool({
      name,
      arguments: args,
    });
  }
}

// Example usage:
// const mcp = new MCPClient("http://localhost:3001/sse");
// await mcp.connect();
// const result = await mcp.callTool("weather", { city: "San Francisco" });
