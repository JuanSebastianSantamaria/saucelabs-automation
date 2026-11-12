import { config as runtimeConfig } from './src/config/environment.js';

const requestedBrowser = process.env.BROWSER?.toLowerCase() ?? 'firefox';
const headless = process.env.HEADLESS?.toLowerCase() === 'true';

const supportedBrowsers = ['chrome', 'firefox', 'edge'];
if (!supportedBrowsers.includes(requestedBrowser)) {
  throw new Error(
    `Unsupported BROWSER "${requestedBrowser}". Choose one of: ${supportedBrowsers.join(', ')}.`,
  );
}
const browserName = requestedBrowser === 'edge' ? 'MicrosoftEdge' : requestedBrowser;

const browserOptions: Record<string, unknown> = {
  chrome: { args: headless ? ['--headless=new', '--window-size=1440,1000'] : [] },
  firefox: { args: headless ? ['-headless'] : [] },
  edge: { args: headless ? ['--headless=new', '--window-size=1440,1000'] : [] },
};
const browserOptionsCapability =
  requestedBrowser === 'firefox'
    ? 'moz:firefoxOptions'
    : requestedBrowser === 'edge'
      ? 'ms:edgeOptions'
      : 'goog:chromeOptions';

export const config: WebdriverIO.Config = {
  runner: 'local',
  specs: ['./src/tests/ui/**/*.spec.ts'],
  suites: {
    ui: ['./src/tests/ui/**/*.spec.ts'],
  },
  maxInstances: 1,
  capabilities: [
    {
      browserName,
      [browserOptionsCapability]: browserOptions[requestedBrowser],
    },
  ],
  framework: 'mocha',
  reporters: [
    'spec',
    [
      'allure',
      {
        outputDir: 'allure-results',
        disableWebdriverStepsReporting: true,
        disableWebdriverScreenshotsReporting: true,
      },
    ],
  ],
  mochaOpts: {
    ui: 'bdd',
    timeout: 60000,
  },
  baseUrl: runtimeConfig.uiBaseUrl,
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 2,
  logLevel: 'warn',
};
