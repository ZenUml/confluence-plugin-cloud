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

const liteKeySuffix = '-lite';

exports.descriptor = functions.https.onRequest((req, resp) => {
  const url = req.url;
  const basePath = url.substring(0, url.lastIndexOf('/'));
  const self = url.substring(url.lastIndexOf('/'));
  const data = JSON.parse(JSON.stringify(descriptor));
  data.baseUrl = `${req.protocol}://${req.hostname}${basePath}/`;
  // This is not necessary but works as a defense.
  data.links.self = self;

  const VERSION = '2021.11';

  const replaceUrls = (modules, replaceFunction) => {
    modules.dynamicContentMacros.forEach(macro => {
      macro.url = replaceFunction(macro.url, macro);
      if(macro.editor && macro.editor.url) {
        macro.editor.url = replaceFunction(macro.editor.url, macro);
      }
      if(macro.renderModes && macro.renderModes.default && macro.renderModes.default.url) {
        macro.renderModes.default.url = replaceFunction(macro.renderModes.default.url, macro);
      }
    });

    if(modules.generalPages) {
      modules.generalPages.forEach(page => {
        page.url = replaceFunction(page.url, page);
      });
    }
  }

  const getCustomContentKeyForModule = (module, modules) => {
    const macroType = module.key.includes('sequence') ? 'sequence' : 'graph';
    const result = modules.customContent.filter(c => c.key.includes(macroType));
    if(result.length === 0) {
      console.log(`Custom content not found for module ${macro.key} in ${modules.customContent.map(c => c.key)}`);
    } else {
      return result[0].key;
    }
  }

  const isLite = url.includes('lite');
  if (isLite) {
    data.key = `${data.key}${liteKeySuffix}`;
    data.name = 'ZenUML Lite';
    data.description = 'ZenUML Lite add-on';
    data.enableLicensing = false;

    data.modules.dynamicContentMacros.forEach(macro => {
      if (macro.key === 'zenuml-sequence-macro') {
        macro.name.value = 'ZenUML Sequence Lite';
      }
      else if (macro.key === 'zenuml-graph-macro') {
        macro.name.value = 'ZenUML Graph Lite';
      }
      macro.key = `${macro.key}${liteKeySuffix}`;
    });

    if(data.modules.customContent) {
      data.modules.customContent.forEach(content => {
        if(content.name && content.name.value) {
          content.name.value = `${content.name.value} Lite`;
        }
      });
    }
  }

  replaceUrls(data.modules, (url, module) => {
    let result = url.replace('__ADDON_KEY__', data.key);
    const contentKey = getCustomContentKeyForModule(module, data.modules);
    return result.replace('__CONTENT_KEY__', contentKey).replace('__VERSION__', VERSION);
  });

  resp.json(data);
})
