import {captureUninstalledMessage, ConfigToucan} from "./ConfigToucan";
import {OkResponse} from "./OkResponse";

export const onRequest: PagesFunction = async ({ request, waitUntil }) => {
  console.log('onRequest: /uninstalled')
  const sentry = ConfigToucan(request, waitUntil);

  try {
    const body = await request.json() as any;
    captureUninstalledMessage(sentry, body);

    return OkResponse();
  } catch (err) {
    sentry.captureException(err);
    return new Response('Something went wrong', {
      status: 500,
      statusText: 'Internal Server Error',
    });
  }
};
