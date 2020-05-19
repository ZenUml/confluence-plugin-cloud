// This script is used to search in wiki page history to find the latest version which contains non-empty ZenUML macro
// It's intended to be manually executed in browser developer console

(async function() {

  const zenumlLite = 'zenuml-sequence-macro-lite';
  const zenumlFull = 'zenuml-sequence-macro';

  const macroSelector = `structured-macro[name=${zenumlLite}],structured-macro[name=${zenumlFull}]`;
  const macroParamSelector = `parameter[name=uuid]`;
  const macroBodySelector = `plain-text-body`;

  const stripNamespacePrefix = (xml) => xml
    .replace(/<[^</> ]+:/g, '<') //e.g. <ac:link>
    .replace(/<\/[^</]+:/g, '</') //e.g. </ac:link>
    .replace(/ [^:<]+:([^:]+)=/g, ' $1='); //e.g. <ri:user ri:userkey=...>

  const parse = (xml) => new DOMParser().parseFromString(stripNamespacePrefix(xml), 'text/xml');

  const wrapXml = (xml) => `<root>${xml}</root>`;

  const parseMacros = (xml) => {
    // console.log(xml);
    return Array.from(parse(wrapXml(xml)).querySelectorAll(macroSelector)).map(m => {
      const param = m.querySelector(macroParamSelector);
      const body = m.querySelector(macroBodySelector);
      return {uuid: param && param.textContent, body: body && body.textContent};
    })
  };

  const versionUrl = (pageId, version) => `/wiki/plugins/viewstorage/viewpagestorage.action?pageId=${pageId}&pageVersion=${version}`;

  const getVersion = (pageId, version) => 
    fetch(versionUrl(pageId, version)).then(r => r.text()).then(x => Object.assign({version}, {macros: parseMacros(x)}));

  const getVersions = (pageId) => fetch(`/wiki/rest/api/content/${pageId}/version`).then(r => r.json());

  const listPages = () => fetch('/wiki/rest/api/content').then(r => r.json()).then(d => d.results.filter(r => r.type === 'page').map(p => p.id));

  const getStorageFormat = (pageId) => fetch(`/wiki/plugins/viewstorage/viewpagestorage.action?pageId=${pageId}`).then(r => r.text()).then(x => ({pageId: pageId, content: x}));

  //Find latest version which has at least one non-empty macro
  //This isn't enough if a page has multiple macros, i.e. the second macro might have non-empty value in older version
  const findVersion = async (pageId, versions) => {
      for(let i = 0; i < versions.length; i++) {
          console.log(`checking page ${pageId} version ${versions[i].number}`);
          const version = await getVersion(pageId, versions[i].number);
          if(version.macros.find(m => m.body && m.body.trim().length > 0)) {
              return version;
          }
      }
  };

  const sendData = async (url = '', data = {}, usePut = false) => {
    const response = await fetch(url, {
      method: usePut ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }

  const getProperty = (pageId, key) => fetch(`/wiki/rest/api/content/${pageId}/property/${key}`).then(r => r.json());

  const writeProperty = async (pageId, uuid, value) => {
      const url = `/wiki/rest/api/content/${pageId}/property`;
      const key = `zenuml-sequence-macro-${uuid}-body-restored`;
      const property = await getProperty(pageId, key);
      const existing = property.key === key;
      await sendData(`${url}${existing ? `/${key}` : ''}`, {key: key, value: {code: value}, version: {number: existing ? property.version.number + 1 : 1}}, existing);
      console.log(`${existing ? 'updated' : 'created'} content property ${key} in page ${pageId}:\n${value}`);
    };

  const iteratePages = async () => {
    (await listPages()).forEach(async (pageId) => {
      const data = await getStorageFormat(pageId);
      if(data.content.includes(zenumlFull) || data.content.includes(zenumlLite)) {
        console.log(`checking page ${pageId}`);
        const versions = await getVersions(pageId);
        const version = await findVersion(pageId, versions.results);
        if(version) {
          console.log(`found ${version.macros.length} macro(s) in page ${pageId} version ${version.version}:\n-----------------\n${version.macros.map(JSON.stringify).join('\n-----------------\n')}`);

          version.macros.filter(m => m.body && m.body.trim().length > 0).forEach(async (m) => {
            await writeProperty(pageId, m.uuid, m.body);
          });
        }
      }
    });
  };

  await iteratePages();

})();