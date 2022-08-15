import {captureError, captureUninstalledMessage} from "./ConfigToucan";
import {OkResponse} from "./OkResponse";

export const onRequest: PagesFunction = async ({ request }) => {
  try {
    const body = await request.json() as any;
    captureUninstalledMessage(body.key, body.clientKey, body.baseUrl);
  } catch (e: any) {
    captureError(e)
  }
  return OkResponse();
};
