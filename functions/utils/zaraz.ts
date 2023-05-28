import fetch from 'node-fetch';

async function postData(clientSite: string) {
  const response = await fetch(
    'https://zenuml.com/zaraz/api',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: `{
                "events": [
                    {
                        "client": {
                            "__zarazTrack": "installed",
                            "client-site": "${clientSite}",
                            "value": "200"
                        }
                    }
                ]
            }`,
    }
  );

  const data = await response.text(); // assuming server responds with json
  console.log(data);
}

export { postData }
