import { OkResponse } from "./OkResponse";
import { RequestBody } from "./RequestBody";
import uuidv4 from "./utils/uuid";

const ALLOWED_REFERER_DOMAINS = ['zenuml.com', 'confluence-plugin.pages.dev']

const validateReferer = (referer) => {
  const refererDomain = new URL(referer).hostname;
  return ALLOWED_REFERER_DOMAINS.find(d => refererDomain.endsWith(d));
}

const getKey = (body) => {
  const domain = new URL(body.baseUrl).hostname;
  const isoDate = new Date().toISOString();
  return `${domain}/events/${isoDate}_${uuidv4()}.json`;
}

const saveToBucket = async (bucket, body) => {
  // @ts-ignore
  return await bucket.put(getKey(body), JSON.stringify(body));
}

export const onRequest: PagesFunction = async ({ request, env }) => {
  try {
    const referer = request.headers.get('referer');
    
    if (!validateReferer(referer)) {
      console.log(`Referer ${referer} not allowed`);
      return new Response('Forbidden', { status: 403 });
    }

    console.log('Received request from referer', referer);
    const body = await request.json() as RequestBody;
    if(!body.baseUrl) {
      console.log(`Missing baseUrl`);
      return new Response('Bad request', { status: 400 });
    }

    await saveToBucket(env.EVENT_BUCKET, body);

  } catch (e: any) {
    console.error(`Error: `, e);
  }
  return OkResponse();
}
