const util = require('util');
const functions = require('firebase-functions');
const descriptor = require('./atlassian-connect.json');
const SteinStore = require('stein-js-client');
const store = new SteinStore('https://api.steinhq.com/v1/storages/5ed5fe9883c30d0425e2c433');

const VERSION = '2022.07';

exports.renderAttachment = functions.https.onRequest((request, response) => {
  response.send(`<ac:image> <ri:attachment ri:filename="zenuml-${request.query.uuid}.png" /> </ac:image>`);
});

exports.installedEndpoint = functions.https.onRequest((request, response) => {
  try {
    console.log('request.headers:', JSON.stringify(request.headers));
    console.log('request.body:', JSON.stringify(request.body));
    console.log('query:', request.query);
    console.log('version:', request.query?.version);
    console.log('request.body.key:', request.body?.key);
    console.log('request.body.baseUrl:', request.body?.baseUrl);
  } catch (e) {
    console.log('Error:', e && e.message)
  }
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
const liteNameSuffix = ' Lite';

exports.descriptor = functions.https.onRequest((req, resp) => {
  const url = req.url;
  const basePath = url.substring(0, url.lastIndexOf('/'));
  const self = url.substring(url.lastIndexOf('/'));
  const data = JSON.parse(JSON.stringify(descriptor));
  data.baseUrl = `${req.protocol}://${req.hostname}${basePath}/`;
  // This is not necessary but works as a defense.
  data.links.self = self;

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
    if(modules.postInstallPage) {
      modules.postInstallPage.url = replaceFunction(modules.postInstallPage.url)
    }
    if(modules.webPanels) {
      modules.webPanels.forEach(m => {
        m.url = replaceFunction(m.url, m);
      });
    }
  }

  const getCustomContentKeyForModule = (module, modules) => {
    // Open API is saved with custom content of graph.
    const macroType = module.key.includes('sequence') ? 'sequence' : 'graph';
    const result = modules.customContent.filter(c => c.key.includes(macroType));
    if(result.length === 0) {
      console.log(`Custom content not found for module ${module.key} in ${modules.customContent.map(c => c.key)}`);
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
      macro.name.value = `${macro.name.value}${liteNameSuffix}`
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

    if(result.includes('__CONTENT_KEY__')) {
      const contentKey = getCustomContentKeyForModule(module, data.modules);
      result = result.replace('__CONTENT_KEY__', contentKey);
    }
    if(result.includes('__POST_INSTALL_KEY__') && data.modules.postInstallPage) {
      result = result.replace('__POST_INSTALL_KEY__', data.modules.postInstallPage.key);
    }

    return result.replace('__VERSION__', VERSION);
  });

  data.lifecycle.installed = data.lifecycle.installed.replace('__VERSION__', VERSION);
  data.lifecycle.uninstalled = data.lifecycle.uninstalled.replace('__VERSION__', VERSION);

  resp.json(data);
})
