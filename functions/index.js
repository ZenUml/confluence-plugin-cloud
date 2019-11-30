const functions = require('firebase-functions');
const admin = require('firebase-admin');

exports.renderAttachment = functions.https.onRequest((request, response) => {
    response.send(`<ac:image> <ri:attachment ri:filename="zenuml-${request.query.uuid}.png" /> </ac:image>`);
});

exports.installedEndpoint = functions.https.onRequest((request, response) => {
  response.status(200).send(`OK`);
});

exports.uninstalledEndpoint = functions.https.onRequest((request, response) => {
  response.status(200).send(`OK`);
});
