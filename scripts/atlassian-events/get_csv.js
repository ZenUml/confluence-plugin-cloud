const AWS = require('aws-sdk');

// How to create Cloudflare R2 auth token: https://developers.cloudflare.com/r2/api/s3/tokens/
AWS.config.update({
  accessKeyId: '<access_key_id>',
  secretAccessKey: '<secret_access_key>',
});

// Create an instance of the S3 service with overridden endpoint
const s3 = new AWS.S3({
  endpoint: 'https://8d5fc7ce04adc5096f52485cce7d7b3d.r2.cloudflarestorage.com' // "atlassian-events" bucket in R2
});

// Specify the bucket and object key
const bucketName = 'atlassian-events';

// Set up the parameters for the get object request
const params = {
  Bucket: bucketName,
};

s3.listObjects(params, (err, data) => {
  if (err) {
    console.error(err);
  } else {
    console.log('========================== Copy the following output and write to a CSV file:')
    console.log();
    console.log();

    console.log('key,clientKey,publicKey,sharedSecret,serverVersion,pluginsVersion,baseUrl,productTyp,description,serviceEntitlementNumber,eventType,filename')
    data.Contents.forEach((object) => {
      if(object.Key.includes('.json')) {
        getObject(object.Key);
      }
    });
  }
});

function getObject(key) {
  s3.getObject(Object.assign({}, params, {Key: key}), (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const str = data.Body.toString();
      
      if(str.trim().length) {
        const o = JSON.parse(data.Body.toString())
        console.log(`${o.key||''},${o.clientKey||''},${o.publicKey||''},${o.sharedSecret||''},${o.serverVersion||''},${o.pluginsVersion||''},${o.baseUrl||''},${o.productType||''},${o.description||''},${o.serviceEntitlementNumber||''},${o.eventType||''},${key}`)
      }
    }
  });
}
