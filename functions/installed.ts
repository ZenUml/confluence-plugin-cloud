export const onRequest: PagesFunction = async () => {
  return new Response(JSON.stringify('data'),

    {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
};
