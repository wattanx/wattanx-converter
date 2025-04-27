import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { McpAgent } from "agents/mcp";
import { server, setupServer } from "./server";

// experimental
export class WattanxConverterMcp extends McpAgent {
  server = server;

  override async init() {
    setupServer(this.server);
  }
}

// experimental
export default WattanxConverterMcp.mount("mcp", {
  binding: "WATTANX_CONVERTER_MCP",
});

export async function startStdioServer() {
  setupServer(server);

  const transport = new StdioServerTransport();
  await server.connect(transport);

  return {
    cleanup: async () => {
      await server.close();
      await transport.close();
    },
  };
}
