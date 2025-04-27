#!/usr/bin/env node

import { startStdioServer } from "../dist/index.mjs";

const { cleanup } = await startStdioServer();

process.on("SIGINT", async () => {
  await cleanup();
  process.exit(0);
});
