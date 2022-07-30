import {ConfigToucan} from "./ConfigToucan";

export const onRequest: PagesFunction = async ({next, request, waitUntil}) => {
  ConfigToucan(request, waitUntil);
  return await next();
}