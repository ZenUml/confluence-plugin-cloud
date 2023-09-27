import uuidv4 from "./utils/uuid";
interface EventBody {
  addon_key: string;
  client_domain: string;
  user_account_id: string;
}

const ALLOWED_REFERER_DOMAINS = ['zenuml.com', 'confluence-plugin.pages.dev']

const validateReferer = (referer: string) => {
  const refererDomain = new URL(referer).hostname;
  return ALLOWED_REFERER_DOMAINS.find(d => refererDomain.endsWith(d));
}

const getKey = (body: EventBody) => {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0'); // Adding 1 to make it 1-based
  const day = String(now.getUTCDate()).padStart(2, '0'); // Two-digit day
  const hours = String(now.getUTCHours()).padStart(2, '0'); // Two-digit hour
  const minutes = String(now.getUTCMinutes()).padStart(2, '0'); // Two-digit minute
  const seconds = String(now.getUTCSeconds()).padStart(2, '0'); // Two-digit second
  const milliseconds = String(now.getUTCMilliseconds()).padStart(3, '0'); // Three-digit millisecond
  return `events/${body.addon_key}/${year}/${month}/${day}/${body.client_domain}/${body.user_account_id}/${hours}${minutes}${seconds}${milliseconds}_${uuidv4()}.json`;
}

const saveToBucket = async (bucket: any, body: EventBody) => {
  return await bucket.put(getKey(body), JSON.stringify(body));
}

export const onRequest = async (event) => {
  const referer = event.request.headers.get('referer') || '';
  if (!validateReferer(referer)) {
    console.log(`Referer ${referer} not allowed`);
    return new Response('Forbidden', { status: 403 });
  }

  console.log('Received request from referer', referer);
  const body = await event.request.json() as EventBody;
  if (!body.client_domain || !body.addon_key || !body.user_account_id) {
    const error = `Missing ${!body.client_domain ? 'client_domain' : (!body.addon_key ? 'addon_key' : 'user_account_id')}`;
    console.log(error);
    return new Response(error, { status: 400 });
  }
  event.waitUntil(saveToBucket(event.env.EVENT_BUCKET, body)); //async handling

  return new Response('', { status: 204 });
}
