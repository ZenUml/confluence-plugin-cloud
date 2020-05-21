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

  const getStorageFormat = (pageId) => fetch(`/wiki/plugins/viewstorage/viewpagestorage.action?pageId=${pageId}`).then(r => r.text()).then(x => ({pageId: pageId, content: x}));

  //Find latest version which has at least one non-empty macro
  //This isn't enough if a page has multiple macros, i.e. the second macro might have non-empty value in older version
  const findVersion = async (pageId, versions, option) => {
      for(let i = 0; i < versions.length; i++) {
        if(option.verbose) {
          console.log(`checking page ${pageId} version ${versions[i].number}`);
        }
        const version = await getVersion(pageId, versions[i].number);
        if(version.macros.find(m => m.body && m.body.trim().length > 0)) {
            return version;
        }
      }
  };

  const request = async (url = '', data = {}, usePut = false) => {
    const response = await fetch(url, {
      method: usePut ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }

  const getProperty = (pageId, key) => fetch(`/wiki/rest/api/content/${pageId}/property/${key}`).then(r => r.json());

  const writeProperty = async (page, uuid, value) => {
    const pageId = page.id;
    const title = page.title;
    const url = `/wiki/rest/api/content/${pageId}/property`;
    const key = `zenuml-sequence-macro-${uuid}-body-restored`;
    const property = await getProperty(pageId, key);
    const existing = property.key === key;
    const data = {key: key, value: {code: value}, version: {number: existing ? property.version.number + 1 : 1}};

    await request(`${url}${existing ? `/${key}` : ''}`, data, existing);
    console.log(`${existing ? 'updated' : 'created'} content property ${key} in page "${title}":\n${value}`);
    };

  const iteratePages = async (pages, option) => {
    pages.forEach(async (page) => {
      const pageId = page.id;
      const title = page.title;
      const data = await getStorageFormat(pageId);

      if(data.content.includes(zenumlFull) || data.content.includes(zenumlLite)) {
        if(option.verbose) {
          console.log(`checking page ${title}`);
        }
        const versions = await getVersions(pageId);
        const version = await findVersion(pageId, versions.results, option);
        if(version) {
          console.log(`found ${version.macros.length} macro(s) in page "${title}" version ${version.version}:\n--------------------------------------------\n${version.macros.map(JSON.stringify).join('\n--------------------------------------------\n')}`);

          if(!option.dryrun) {
            version.macros.filter(m => m.uuid && m.body && m.body.trim().length > 0).forEach(async (m) => {
              await writeProperty(page, m.uuid, m.body);
            });
          }
        }
      }
    });
  };

  async function search(url, option) {
    if(option.verbose) {
      console.log(`fetching ${url}`);
    }
    const data = await fetch(url).then(r => r.json());
    await iteratePages(data.results, option);
  
    if(data._links.next) {
      await search(`/wiki${data._links.next}`, option);
    }
  }

  await search('/wiki/rest/api/content', {dryrun: true, verbose: false});

})();