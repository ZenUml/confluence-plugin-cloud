import {captureError, captureUninstalledMessage} from "./ConfigToucan";
import {OkResponse} from "./OkResponse";
import {ServerErrorResponse} from "./ServerErrorResponse";

export const onRequest: PagesFunction = async ({ request }) => {
  console.log('onRequest: /uninstalled')
  try {
    const body = await request.json() as any;
    captureUninstalledMessage(body.key, body.clientKey, body.baseUrl);

    return OkResponse();
  } catch (err) {
    captureError(err);
    return ServerErrorResponse();
  }
};
