import {captureError, ConfigToucan} from "./ConfigToucan";
import {ServerErrorResponse} from "./ServerErrorResponse";

const proxyToACE: PagesFunction = async ({next, request, waitUntil, env}) => {
  console.log('-- in reverseProxy');
  const aceBaseUrl = env.ACE_BASEURL;

  if(request.url.includes('/installed') && aceBaseUrl) {
    console.log('ACE_BASEURL: ', aceBaseUrl);
    try {
      const body = await request.json();
      const headers = request.headers;

      console.log(body);
      // console.log(Array.from(request.headers.entries()));

      const newUrl = `${aceBaseUrl}/installed${new URL(request.url).search}`;

      await fetch(newUrl, {method: 'POST', body: JSON.stringify(body), headers});
    } catch(e) {
      console.error(e);
    }
  }
  return await next();
}

const configToucan: PagesFunction = async ({next, request, waitUntil}) => {
  try {
    ConfigToucan(request, waitUntil);
    return await next();
  } catch (e) {
    captureError(e);
    return ServerErrorResponse();
  }
}

export const onRequest: PagesFunction[] = [proxyToACE, configToucan]