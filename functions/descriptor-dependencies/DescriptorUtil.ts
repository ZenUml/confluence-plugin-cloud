import descriptorNs from "../types/descriptor";
import Modules = descriptorNs.Modules;
import GeneralPage = descriptorNs.GeneralPage;
import WebPanel = descriptorNs.WebPanel;
import DynamicContentMacro = descriptorNs.DynamicContentMacro;
import CustomContent = descriptorNs.CustomContent;
import PostInstallPage = descriptorNs.PostInstallPage;
type Module = DynamicContentMacro | GeneralPage | PostInstallPage | WebPanel;

declare module cloudflareNs {
  export interface Parameters {
    request: Request;
  }

  export interface Request {
    headers: Headers;
    url:     string;
  }

  export interface Headers {
    get: (header: string) => string;
  }
}
export default cloudflareNs;
const descriptor = require('../atlassian-connect.json');
const liteKeySuffix = '-lite';
const liteNameSuffix = ' Lite';
const VERSION = '2022.07';

export const replaceUrls = (modules: Modules, replaceFunction: (url: string, module: Module ) => string) => {
  modules.dynamicContentMacros.forEach((macro: DynamicContentMacro) => {
    macro.url = replaceFunction(macro.url, macro);
    if (macro.editor && macro.editor.url) {
      macro.editor.url = replaceFunction(macro.editor.url, macro);
    }
    if (macro.renderModes && macro.renderModes.default && macro.renderModes.default.url) {
      macro.renderModes.default.url = replaceFunction(macro.renderModes.default.url, macro);
    }
  });

  if (modules.generalPages) {
    modules.generalPages.forEach((page: GeneralPage) => {
      page.url = replaceFunction(page.url, page);
    });
  }
  if (modules.postInstallPage) {
    modules.postInstallPage.url = replaceFunction(modules.postInstallPage.url, modules.postInstallPage);
  }
  if (modules.webPanels) {
    modules.webPanels.forEach((webPanel: WebPanel) => {
      webPanel.url = replaceFunction(webPanel.url, webPanel);
    });
  }
}

export function getDescriptor(host: string, originalUrl: string): descriptorNs.Descriptor  {
  let basePath;
  const url = originalUrl.replace('http://', 'https://');
  if (!host) {
    basePath = url.substring(0, url.lastIndexOf('/'));
  } else {
    basePath = `https://${host}`;
  }
  const self = url.substring(url.lastIndexOf('/'));
  const data = JSON.parse(JSON.stringify(descriptor));
  data.baseUrl = `${basePath}/`;
  // This is not necessary but works as a defense.
  data.links.self = self;

  const getCustomContentKeyForModule= (module: Module, modules: Modules): string => {
    // Open API is saved with custom content of graph.
    const macroType = module.key.includes('sequence') ? 'sequence' : 'graph';
    const result = modules.customContent.filter((c: CustomContent) => c.key.includes(macroType));
    if (result.length === 0) {
      console.log(`Custom content not found for module ${module.key} in ${modules.customContent.map((c:CustomContent) => c.key)}`);
      return '';
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

    data.modules.dynamicContentMacros.forEach((macro: DynamicContentMacro) => {
      macro.name.value = `${macro.name.value}${liteNameSuffix}`
      macro.key = `${macro.key}${liteKeySuffix}`;
    });

    if (data.modules.customContent) {
      data.modules.customContent.forEach((content: CustomContent) => {
        if (content.name && content.name.value) {
          content.name.value = `${content.name.value} Lite`;
        }
      });
    }
  }

  replaceUrls(data.modules, (url: string, module: Module) => {
    let result = url.replace('__ADDON_KEY__', data.key);

    if (result.includes('__CONTENT_KEY__')) {
      const contentKey = getCustomContentKeyForModule(module, data.modules);
      result = result.replace('__CONTENT_KEY__', contentKey);
    }
    if (result.includes('__POST_INSTALL_KEY__') && data.modules.postInstallPage) {
      result = result.replace('__POST_INSTALL_KEY__', data.modules.postInstallPage.key);
    }

    return result.replace('__VERSION__', VERSION);
  });

  data.lifecycle.installed = data.lifecycle.installed.replace('__VERSION__', VERSION);
  data.lifecycle.uninstalled = data.lifecycle.uninstalled.replace('__VERSION__', VERSION);
  return data;
}