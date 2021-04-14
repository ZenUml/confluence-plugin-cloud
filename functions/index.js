const functions = require('firebase-functions');
const descriptor = require('./atlassian-connect.json');
const SteinStore = require('stein-js-client');
const store = new SteinStore('https://api.steinhq.com/v1/storages/5ed5fe9883c30d0425e2c433');

exports.renderAttachment = functions.https.onRequest((request, response) => {
  response.send(`<ac:image> <ri:attachment ri:filename="zenuml-${request.query.uuid}.png" /> </ac:image>`);
});

exports.installedEndpoint = functions.https.onRequest((request, response) => {
  console.log('version:', request.query.version);
  console.log('request.body.key:', request.body.key);
  console.log('request.body.baseUrl:', request.body.baseUrl);
  let key = request.body.key;
  store.append('ZenUML', [
    {
      DateTime: new Date().toLocaleString('en-AU'),
      ClientSite: request.body.baseUrl,
      AppType: key.includes('lite')? 'Lite': 'Full',
      EventType: 'Install',
      Version: request.query.version,
      Notes: ''
    }
  ]).then(console.log)
  response.status(200).send(`OK`);
});

exports.uninstalledEndpoint = functions.https.onRequest((request, response) => {
  console.log('version:', request.query.version);
  console.log('request.body.key:', request.body.key);
  console.log('request.body.baseUrl:', request.body.baseUrl);
  let key = request.body.key;
  store.append('ZenUML', [
    {
      DateTime: new Date().toLocaleString('en-AU'),
      ClientSite: request.body.baseUrl,
      AppType: key.includes('lite')? 'Lite': 'Full',
      EventType: 'Uninstall',
      Notes: ''
    }
  ]).then(console.log)
  response.status(200).send(`OK`);
});

exports.descriptor = functions.https.onRequest((req, resp) => {
  const url = req.url;
  const basePath = url.substring(0, url.lastIndexOf('/'));
  const self = url.substring(url.lastIndexOf('/'));
  descriptor.baseUrl = `${req.protocol}://${req.hostname}${basePath}`;
  // This is not necessary but works as a defense.
  descriptor.links.self = self;

  const isLite = url.includes('lite');
  if (isLite) {
    descriptor.key = 'com.zenuml.confluence-addon-lite';
    descriptor.name = 'ZenUML Lite';
    descriptor.description = 'ZenUML Lite add-on';
    descriptor.enableLicensing = false;
    descriptor.modules.dynamicContentMacros.forEach(macro => {
      if (macro.key === 'zenuml-sequence-macro') {
        macro.key = 'zenuml-sequence-macro-lite';
        macro.name.value = 'ZenUML Sequence Lite';
      }
      if (macro.key === 'zenuml-graph-macro') {
        macro.key = 'zenuml-graph-macro-lite';
        macro.name.value = 'ZenUML Graph Lite';
      }
    })
  }

  resp.json(descriptor);
})
