const functions = require('firebase-functions');
const descriptor = require('./atlassian-connect.json');

exports.renderAttachment = functions.https.onRequest((request, response) => {
  response.send(`<ac:image> <ri:attachment ri:filename="zenuml-${request.query.uuid}.png" /> </ac:image>`);
});

exports.installedEndpoint = functions.https.onRequest((request, response) => {
  console.log('request.body.baseUrl:', request.body.baseUrl);
  console.log('request.body.clientKey:', request.body.clientKey);
  console.log('request.body.pluginsVersion:', request.body.pluginsVersion);
  response.status(200).send(`OK`);
});

exports.uninstalledEndpoint = functions.https.onRequest((request, response) => {
  console.log('request.body.baseUrl:', request.body.baseUrl);
  console.log('request.body.clientKey:', request.body.clientKey);
  console.log('request.body.pluginsVersion:', request.body.pluginsVersion);
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
        macro.name.value = 'ZenUML Lite';
      }
    })
  }

  resp.json(descriptor);
})
