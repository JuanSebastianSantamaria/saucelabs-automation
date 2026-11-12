import 'dotenv/config';

interface EnvironmentSettings {
  apiBaseUrl: string;
  uiBaseUrl: string;
}

const environments: Record<string, EnvironmentSettings> = {
  prod: {
    apiBaseUrl: 'https://restful-booker.herokuapp.com',
    uiBaseUrl: 'https://www.saucedemo.com/',
  },
};

const environmentName = process.env.TEST_ENV?.toLowerCase() ?? 'prod';
const environment = environments[environmentName];

if (!environment) {
  throw new Error(
    `Unknown TEST_ENV "${environmentName}". Configured environments: ${Object.keys(environments).join(', ')}.`,
  );
}

export const config: EnvironmentSettings = {
  apiBaseUrl: process.env.API_BASE_URL ?? environment.apiBaseUrl,
  uiBaseUrl: process.env.UI_BASE_URL ?? environment.uiBaseUrl,
};

export const credentials = {
  username: process.env.SAUCEDEMO_USERNAME ?? 'standard_user',
  password: process.env.SAUCEDEMO_PASSWORD ?? 'secret_sauce',
};
