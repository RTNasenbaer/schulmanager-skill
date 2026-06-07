export interface RuntimeConfig {
  backendApiUrl: string;
  apiKey: string;
}

const DEFAULT_BACKEND_API_URL = 'http://localhost:3000/api';
const DEFAULT_API_KEY = 'nVDlr2QzHS7qZN4sjo8mfBGpEXxvIyKP';

function normalizeUrl(url: string): string {
  return url.replace(/\/$/, '');
}

export function getRuntimeConfig(): RuntimeConfig {
  const runtimeEnvironment = globalThis as {
    process?: {
      env?: Record<string, string | undefined>;
    };
  };

  const environment = runtimeEnvironment.process?.env || {};

  return {
    backendApiUrl: normalizeUrl(environment.BACKEND_API_URL || DEFAULT_BACKEND_API_URL),
    apiKey: environment.API_KEY || DEFAULT_API_KEY,
  };
}