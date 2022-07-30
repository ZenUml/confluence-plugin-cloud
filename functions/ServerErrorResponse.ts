export function ServerErrorResponse() {
  return new Response('Something went wrong', {
    status: 500,
    statusText: 'Internal Server Error',
  });
}