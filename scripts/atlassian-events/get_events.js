const AWS = require('aws-sdk');

// How to create Cloudflare R2 auth token: https://developers.cloudflare.com/r2/api/s3/tokens/
AWS.config.update({
  accessKeyId: process.env.accessKeyId || '<access_key_id>',
  secretAccessKey: process.env.secretAccessKey || '<secret_access_key>',
});

// Create an instance of the S3 service with overridden endpoint
const s3 = new AWS.S3({
  endpoint: 'https://8d5fc7ce04adc5096f52485cce7d7b3d.r2.cloudflarestorage.com' // "atlassian-events" bucket in R2
});

const bucketName = 'atlassian-events';
const objectsPerPage = 1000;


function listAllObjects(marker, objectCallback) {
  const params = {
    Bucket: bucketName,
    Prefix: 'events',
    MaxKeys: objectsPerPage,
    Marker: marker,
  };

  if(!marker) {
    delete params.Marker;
  }

  s3.listObjects(params, (err, data) => {
    if (err) {
      console.error('Error listing objects:', err);
    } else {
      data.Contents.forEach(object => {
        objectCallback && objectCallback(object.Key);
      });

      // Check if there are more objects to fetch
      if (data.IsTruncated) {
        listAllObjects(data.Contents[data.Contents.length - 1].Key, objectCallback);
      }
    }
  });
}

function parseKey(key) {
  //key example: events/com.zenuml.confluence-addon/2023/09/13/zenuml-stg/6313458eb433b060db563453/084925523_88c2dc7b-b69b-4f19-bdbe-b1488d7c8d20.json
  const a = key.match(/[^/]+/g);
  if(a.length < 8) {
    return {};
  }

  let b = a[7].replace('\.json', '').split('_');
  if(b.length < 2) {
    b = [];
  }

  return {addon_key: a[1], year: a[2], month: a[3], date: a[4], client_domain: a[5], user_id: a[6], time: b[0], uuid: b[1]};
}

function escapeForCsv(input) {
  input = String(input);
  
  // If the input string contains double quotes, replace them with two double quotes
  const escaped = input.replace(/"/g, '""');
  
  // If the input string contains a comma or newline, enclose it in double quotes
  if (input.includes(',') || input.includes('\n')) {
    return `"${escaped}"`;
  }

  // Otherwise, return the original string as is
  return input;
}

function getObject(key) {
  s3.getObject({Bucket: bucketName, Key: key}, (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const str = data.Body.toString();
      
      if(str.trim().length) {
        const o = JSON.parse(data.Body.toString())
        const k = parseKey(key);

        console.log(`${k.addon_key||''},${k.year||''},${k.month||''},${k.date||''},${k.client_domain||''},${k.user_id||''},${o.event_source||''},${o.version||''},${escapeForCsv(o.action)},${escapeForCsv(o.event_category)},${escapeForCsv(o.event_label)},${o.confluence_space||''},${k.time || ''},${k.uuid || ''}`)
      }
    }
  });
}

function processStart() {
  console.log('========================== Copy the following output and write to a CSV file:\n\n')
  console.log('addon_key,year,month,date,client_domain,user_id,event_source,version,action,event_category,event_label,confluence_space,time,uuid')
}

processStart();
listAllObjects(undefined, getObject);