import {RequestBody} from "../RequestBody";

// You must remember to bind the bucket to EVENT_BUCKET in the pages UI.
// There is no command line way to do this.
async function saveToBucket(bucket: any, domain: string, body: RequestBody) {
  const isoDate = new Date().toISOString();
  const key = `${domain}/lifecycle/${isoDate}.json`;
  console.log(`Writing to ${key}`);
  console.log(`env.EVENT_BUCKET:`, bucket);

  return await bucket.put(key, JSON.stringify(body));
}

export {saveToBucket};
