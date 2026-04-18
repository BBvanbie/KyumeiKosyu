import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  timeout: 90_000,
  fullyParallel: false,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:5173',
    acceptDownloads: true,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: [
    {
      command: 'npm run dev:server',
      url: 'http://localhost:3001/api/booking-settings',
      reuseExistingServer: true,
      timeout: 120_000,
    },
    {
      command: 'npm run dev:client -- --host localhost',
      url: 'http://localhost:5173',
      reuseExistingServer: true,
      timeout: 120_000,
    },
  ],
})
