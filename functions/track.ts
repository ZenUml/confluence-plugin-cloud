import { OkResponse } from "./OkResponse";
import uuidv4 from "./utils/uuid";

const ALLOWED_REFERER_DOMAINS = ['zenuml.com', 'confluence-plugin.pages.dev']

const validateReferer = (referer) => {
  const refererDomain = new URL(referer).hostname;
  return ALLOWED_REFERER_DOMAINS.find(d => refererDomain.endsWith(d));
}

const getKey = (body) => {
  const domain = new URL(body.baseUrl).hostname;
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0'); // Adding 1 to make it 1-based
  const day = String(now.getUTCDate()).padStart(2, '0'); // Two-digit day
  const hours = String(now.getUTCHours()).padStart(2, '0'); // Two-digit hour
  const minutes = String(now.getUTCMinutes()).padStart(2, '0'); // Two-digit minute
  const seconds = String(now.getUTCSeconds()).padStart(2, '0'); // Two-digit second
  const milliseconds = String(now.getUTCMilliseconds()).padStart(3, '0'); // Three-digit millisecond
  return `/events/${body.addonKey}/${year}/${month}/${day}/${domain}/${body.user_account_id}/${hours}${minutes}${seconds}${milliseconds}_${uuidv4()}.json`;
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
    const body = await request.json() as any;
    if (!body.baseUrl || !body.addonKey || !body.user_account_id) {
      const error = `Missing ${!body.baseUrl ? 'baseUrl' : (!body.addonKey ? 'addonKey' : 'user_account_id')}`;
      console.log(error);
      return new Response(error, { status: 400 });
    }

    await saveToBucket(env.EVENT_BUCKET, body); //make async

  } catch (e: any) {
    console.error(`Error: `, e);
  }
  return OkResponse();
}
