import Toucan from 'toucan-js';

export function ConfigToucan(request: Request, waitUntil: (promise: Promise<any>) => void) {
  return new Toucan({
    dsn: 'https://d7df1008a71541aca2063f58fe7fc0bf@o571476.ingest.sentry.io/6610196',
    context: {waitUntil, request}, // Includes 'waitUntil', which is essential for Sentry logs to be delivered. Also includes 'request' -- no need to set it separately.
    allowedHeaders: ['user-agent'],
    allowedSearchParams: /(.*)/,
  });
}

export function captureInstalledMessage(sentry: Toucan, body: any, appKey: any = body.key, clientKey: any = body.clientKey, baseUrl: any = body.baseUrl) {
  sentry.setTags({
    'app-key': appKey,
    'client-key': clientKey,
    'base-url': baseUrl
  });
  sentry.captureMessage("{action: 'installed'}", 'info');
}

export function captureUninstalledMessage(sentry: Toucan, body: any, appKey: any = body.key, clientKey: any = body.clientKey, baseUrl: any = body.baseUrl) {
  sentry.setTags({
    'app-key': appKey,
    'client-key': clientKey,
    'base-url': baseUrl
  });
  sentry.captureMessage("{action: 'uninstalled'}", 'info');
}