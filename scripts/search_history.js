// This script is used to search in wiki page history to find the latest version which contains non-empty ZenUML macro
// It's intended to be manually executed in browser developer console

(async function() {

  const zenumlLite = 'zenuml-sequence-macro-lite';
  const zenumlFull = 'zenuml-sequence-macro';

  const macroBodySelector = `structured-macro[name=${zenumlLite}],structured-macro[name=${zenumlFull}] plain-text-body`;

  const stripNamespacePrefix = (xml) => xml
    .replace(/<[^</> ]+:/g, '<') //e.g. <ac:link>
    .replace(/<\/[^</]+:/g, '</') //e.g. </ac:link>
    .replace(/ [^:<]+:([^:]+)=/g, ' $1='); //e.g. <ri:user ri:userkey=...>

  const parse = (xml) => new DOMParser().parseFromString(stripNamespacePrefix(xml), 'text/xml');

  const wrapXml = (xml) => `<root>${xml}</root>`;

  const extract = (xml) => Array.from(parse(wrapXml(xml)).querySelectorAll(macroBodySelector)).map(e => e.textContent);

  const versionUrl = (pageId, version) => `/wiki/plugins/viewstorage/viewpagestorage.action?pageId=${pageId}&pageVersion=${version}`;

  const getVersion = (pageId, version) => fetch(versionUrl(pageId, version)).then(r => r.text()).then(extract);

  const getVersions = (pageId) => fetch(`/wiki/rest/api/content/${pageId}/version`).then(r => r.json());

  const listPages = () => fetch('/wiki/rest/api/content').then(r => r.json()).then(d => d.results.filter(r => r.type === 'page').map(p => p.id));

  const getStorageFormat = (pageId) => fetch(`/wiki/plugins/viewstorage/viewpagestorage.action?pageId=${pageId}`).then(r => r.text()).then(x => ({pageId: pageId, content: x}));

  //find latest version which has non-empty macro body
  const findVersion = async (pageId, versions) => {
      for(let i = 0; i < versions.length; i++) {
          console.log(`checking page ${pageId} version ${versions[i].number}`);
          const macros = await getVersion(pageId, versions[i].number);
          if(macros.find(m => m.trim().length > 0)) {
              return macros;
          }
      }
  };

  const iteratePages = async () => {
    (await listPages()).forEach(async (pageId) => {
      const data = await getStorageFormat(pageId);
      if(data.content.includes(zenumlFull) || data.content.includes(zenumlLite)) {
        console.log(`checking page ${pageId}`);
        await getVersions(pageId).then(r => findVersion(pageId, r.results))
              .then(r => r && console.log(`found ${r.length} macro(s) in page ${pageId}:\n-----------------\n${r.join('\n-----------------\n')}`));
      }
    });
  };

  await iteratePages();

})();