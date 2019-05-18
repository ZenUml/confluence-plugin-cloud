const functions = require('firebase-functions');
const admin = require('firebase-admin');

exports.renderAttachment = functions.https.onRequest((request, response) => {
    response.send(`<ac:image> <ri:attachment ri:filename="zenuml-${request.query.uuid}.png" /> </ac:image>`);
});
