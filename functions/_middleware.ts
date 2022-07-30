import {captureError, ConfigToucan} from "./ConfigToucan";
import {ServerErrorResponse} from "./ServerErrorResponse";

export const onRequest: PagesFunction = async ({next, request, waitUntil}) => {
  try {
    ConfigToucan(request, waitUntil);
    return await next();
  } catch (e) {
    captureError(e);
    return ServerErrorResponse();
  }
}