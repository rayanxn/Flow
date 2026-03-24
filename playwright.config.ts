import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, ".env.local") });

const AUTH_FILE = "tests/.auth/user.json";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    // Auth setup — runs first, saves storageState
    {
      name: "setup",
      testMatch: /auth\.setup\.ts/,
    },
    // Tests that don't need auth (login/signup page rendering, etc.)
    {
      name: "no-auth",
      testMatch: /phase1-auth-flow\.spec\.ts/,
      use: { ...devices["Desktop Chrome"] },
    },
    // All other tests — run authenticated
    {
      name: "authenticated",
      testMatch: /.*\.spec\.ts/,
      testIgnore: /phase1-auth-flow\.spec\.ts/,
      dependencies: ["setup"],
      use: {
        ...devices["Desktop Chrome"],
        storageState: AUTH_FILE,
      },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
});
