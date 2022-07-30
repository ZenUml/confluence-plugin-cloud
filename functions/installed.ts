import {captureError, captureInstalledMessage} from "./ConfigToucan";
import {OkResponse} from "./OkResponse";
import {ServerErrorResponse} from "./ServerErrorResponse";

export const onRequest: PagesFunction = async ({ request }) => {
  console.log('onRequest: /installed');
  try {
    const body = await request.json() as any;
    captureInstalledMessage(body.key, body.clientKey, body.baseUrl);

    return OkResponse();
  } catch (err) {
    captureError(err);
    return ServerErrorResponse();
  }
}
