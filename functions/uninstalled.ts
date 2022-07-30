import {captureUninstalledMessage} from "./ConfigToucan";
import {OkResponse} from "./OkResponse";

export const onRequest: PagesFunction = async ({ request }) => {
  console.log('onRequest: /uninstalled')
  const body = await request.json() as any;
  captureUninstalledMessage(body.key, body.clientKey, body.baseUrl);
  return OkResponse();
};
