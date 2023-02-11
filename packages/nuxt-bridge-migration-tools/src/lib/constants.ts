export const DEFAULT_OPTIONS = {
  "tsconfig-path": {
    type: "string",
    default: "./tsconfig.json",
    alias: "t",
    describe: "Path to tsconfig.json",
    requiresArg: true,
  },
} as const;
