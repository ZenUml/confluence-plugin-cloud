import fetch from 'node-fetch';

const HTTP_API_ENDPOINT = 'https://zenuml.com/zaraz/api';


interface EventParams {
  eventType: string
  [key: string]: any
}

async function trackEvent({eventType, ...restProps}: EventParams) {
  const additionalProps = Object.keys(restProps)
    .map((key: string) => `"${key}": "${restProps[key]}"`)
    .join(', ');

  const body = `{
    "events": [
      {
        "client": {
            "__zarazTrack": "${eventType}",
            ${additionalProps}
        }
      }
    ]
  }`

  const request = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: body,
  };

  const response = await fetch(HTTP_API_ENDPOINT, request);

  const data = await response.text(); // assuming server responds with json
  console.log(data);
}


// TODO: use trackEvent instead of
async function postData(eventType: string, appKey: string, clientKey: string, clientSite: string) {
  const body = `{
            "events": [
                {
                    "client": {
                        "__zarazTrack": "${eventType}",
                        "appKey": "${appKey}",
                        "clientKey": "${clientKey}",
                        "clientSite": "${clientSite}",
                        "value": "200"
                    }
                }
            ]
        }`;
  const request = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: body,
  };
  const response = await fetch(HTTP_API_ENDPOINT, request);

  const data = await response.text(); // assuming server responds with json
  console.log(data);
}

export {
  postData,
  trackEvent
}
