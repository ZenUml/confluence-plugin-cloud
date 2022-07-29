import Toucan from 'toucan-js';

export const onRequest: PagesFunction = async ({ request, waitUntil }) => {
  console.log('onRequest: /installed')
  const sentry = new Toucan({
    dsn: 'https://d7df1008a71541aca2063f58fe7fc0bf@o571476.ingest.sentry.io/6610196',
    context: {waitUntil, request}, // Includes 'waitUntil', which is essential for Sentry logs to be delivered. Also includes 'request' -- no need to set it separately.
    allowedHeaders: ['user-agent'],
    allowedSearchParams: /(.*)/,
  });

  try {
    // Your code
    sentry.captureMessage("{action: 'installed'}");

    return new Response(JSON.stringify('data'),

      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });
  } catch (err) {
    sentry.captureException(err);
    return new Response('Something went wrong', {
      status: 500,
      statusText: 'Internal Server Error',
    });
  }
}
