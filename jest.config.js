// next/jest wires up SWC transforms, @/ path aliases, CSS/image mocks, and
// environment variables from .env — no extra config needed for those.
const nextJest = require("next/jest");

const createJestConfig = nextJest({ dir: "./" });

/** @type {import('jest').Config} */
const config = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  // Explicit alias so jest.mock("@/...") resolves correctly.
  // next/jest also sets this from tsconfig.paths but being explicit is safer.
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  coverageProvider: "v8",
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/app/**/page.tsx",     // page wrappers are thin — skip them
    "!src/app/**/layout.tsx",
  ],
};

module.exports = createJestConfig(config);
