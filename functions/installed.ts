import {captureInstalledMessage, ConfigToucan} from "./ConfigToucan";
import {OkResponse} from "./OkResponse";
import {ServerErrorResponse} from "./ServerErrorResponse";

export const onRequest: PagesFunction = async ({ request, waitUntil }) => {
  console.log('onRequest: /installed');
  const sentry = ConfigToucan(request, waitUntil);

  try {
    const body = await request.json() as any;
    captureInstalledMessage(sentry, body);

    return OkResponse();
  } catch (err) {
    sentry.captureException(err);
    return ServerErrorResponse();
  }
}
