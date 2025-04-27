import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { server, setupServer } from "./server";

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
