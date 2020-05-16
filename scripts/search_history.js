// This script is used to search in wiki page history to find the latest version which contains non-empty ZenUML macro
// It's intended to be manually executed in browser developer console

(function() {

  const zenumlIframeId = 'com.zenuml.confluence-addon';

  const namespacePrefix = 'ac:';

  const macroBodySelector = 'structured-macro[name=zenuml-sequence-macro-lite],structured-macro[name=zenuml-sequence-macro] plain-text-body';

  const stripNamespacePrefix = (xml) => xml.replace(new RegExp(namespacePrefix, 'gi'), '');

  const parse = (xml) => new DOMParser().parseFromString(stripNamespacePrefix(xml), 'text/xml');

  const wrapXml = (xml) => `<root>${xml}</root>`;

  const extract = (xml) => Array.from(parse(wrapXml(xml)).querySelectorAll(macroBodySelector)).map(e => e.textContent);

  const versionUrl = (pageId, version) => `/wiki/plugins/viewstorage/viewpagestorage.action?pageId=${pageId}&pageVersion=${version}`;

  const getVersion = (pageId, version) => fetch(versionUrl(pageId, version)).then(r => r.text()).then(extract);

  const getVersions = (pageId) => fetch(`/wiki/rest/api/content/${pageId}/version`).then(r => r.json());

  //find latest version which has non-empty macro body
  const findVersion = async (pageId, versions) => {
      for(let i = 0; i < versions.length; i++) {
          console.log(`checking version ${versions[i].number}`);
          const macros = await getVersion(pageId, versions[i].number);
          if(macros.find(m => m.trim().length > 0)) {
              return macros;
          }
      }
  };

  const hasZenumlPlugin = () => Array.from(document.querySelectorAll('iframe')).find(i => i.id.includes(zenumlIframeId));

  const getPageId = () => {
      const match = window.location.href.match(/\/pages\/(\d+)\//);
      return match && match[1];
  };

  const findLatestNonEmptyZenumlBody = () => {
      if(!hasZenumlPlugin()) {
          console.log('ZenUML plugin not detected, abort');
      }


      const pageId = getPageId();
      if(!pageId) {
          console.log('Wiki page not detected, abort');
      }

      console.log('searching ZenUML macro in history');

      getVersions(pageId).then(r => findVersion(pageId, r.results))
          .then(r => r && console.log(`non-empty macro found:\n\n${JSON.stringify(r)}`));
  };

  findLatestNonEmptyZenumlBody();

})();