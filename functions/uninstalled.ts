import {captureError, captureUninstalledMessage, ConfigToucan} from "./ConfigToucan";
import {OkResponse} from "./OkResponse";

export const onRequest: PagesFunction = async ({ request, waitUntil }) => {
  console.log('onRequest: /uninstalled')
  ConfigToucan(request, waitUntil);
  try {
    const body = await request.json() as any;
    captureUninstalledMessage(body.key, body.clientKey, body.baseUrl);

    return OkResponse();
  } catch (err) {
    captureError(err);
    return new Response('Something went wrong', {
      status: 500,
      statusText: 'Internal Server Error',
    });
  }
};
