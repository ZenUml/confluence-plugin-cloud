import {captureInstalledMessage} from "./ConfigToucan";
import {OkResponse} from "./OkResponse";

export const onRequest: PagesFunction = async ({ request }) => {
  console.log('onRequest: /installed');
  const body = await request.json() as any;
  captureInstalledMessage(body.key, body.clientKey, body.baseUrl);
  return OkResponse();
}
