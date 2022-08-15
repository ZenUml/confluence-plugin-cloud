import {captureError, captureInstalledMessage} from "./ConfigToucan";
import {OkResponse} from "./OkResponse";

export const onRequest: PagesFunction = async ({ request }) => {
  try {
    const body = await request.json() as any;
    captureInstalledMessage(body.key, body.clientKey, body.baseUrl);
  } catch (e: any) {
    captureError(e)
  }
  return OkResponse();
}
