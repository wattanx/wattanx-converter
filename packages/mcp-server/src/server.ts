import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { convertSrc } from "@wattanx/vue-script-setup-converter";
import { convertSrc as convertToCapi } from "@wattanx/vue-composition-converter";
import { version } from "../package.json";

export const server = new McpServer({
  name: "wattanx-converter MCP Server",
  description: "A server for wattanx-converter",
  version,
});

export function setupServer(server: McpServer) {
  server.tool(
    "convert-to-script-setup",
    "This tool converts Vue SFC code written with the Composition API into script setup syntax.",
    {
      input: z.string(),
    },
    async ({ input }) => {
      const output = convertSrc(input);

      return {
        content: [
          {
            text: output,
            type: "text",
          },
        ],
      };
    }
  );

  server.tool(
    "convert-to-composition-api",
    "This tool converts Vue SFCs written with the Options API into the Composition API.",
    {
      input: z.string(),
    },
    async ({ input }) => {
      const output = convertToCapi({ input });

      return {
        content: [
          {
            text: output,
            type: "text",
          },
        ],
      };
    }
  );
}
