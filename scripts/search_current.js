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
    .replace(/ [a-zA-Z0-9]+:([^:]+)=/g, ' $1=') //e.g. <ri:user ri:userkey=...>
    .replace(/&nbsp/gi, '');

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

  const iterateVersions = async (pageId, versions, option) => {
    const current = await getVersion(pageId, versions[0].number);
    const isEmpty = (m) => m.body && m.body.trim().length === 0;
    const emptyMacros = current.macros.filter(isEmpty);

    if(emptyMacros.length > 0) {
      const getById = (uuid) => current.macros.find(m => m.uuid === uuid);
      const getByIndex = (i) => current.macros[i];
      const hasUnresolved = () => emptyMacros.find(m => !m.resolved);

      for(let i = 1; i < versions.length; i++) {
        if(option.verbose) {
          console.log(`checking page ${pageId} version ${versions[i].number}`);
        }

        const version = await getVersion(pageId, versions[i].number);

        for(let j = 0; j < version.macros.length && hasUnresolved(); j++) {
          const match = m.uuid && getById(m.uuid) || getByIndex(j);
          if(match && isEmpty(match) && !isEmpty(m)) {
            match.resolved = true;
            console.log(`found in page ${pageId} version ${versions[i].number} macro ${uuid || `#${j}`}:\n${m.body}`);
          }
        }
      }
    }
  };

  const iteratePages = async (pages, option) => {
    pages.forEach(async (page) => {
      const pageId = page.id;
      const title = page.title;
      const data = await getStorageFormat(pageId);

      if(data.content.includes(zenumlFull) || data.content.includes(zenumlLite)) {
        if(option.verbose) {
          console.log(`checking page "${title}"`);
        }
        const versions = await getVersions(pageId);
        await iterateVersions(pageId, versions.results, option);
      }
    });
  };

  const getCurrentPageId = () => {
    const match = window.location.href.match(/\/pages\/(\d+)\//);
    return match && match[1];
  };

  async function search(url, option) {
    if(!option.allPages) {
      const pageId = getCurrentPageId();
      if(!pageId) {
        return;
      }
      url = `${url}/${pageId}`;
    }

    if(option.verbose) {
      console.log(`fetching ${url}`);
    }

    const data = await fetch(url).then(r => r.json());
    option.base = data._links.base;
    await iteratePages(option.allPages ? data.results : [data], option);
  
    if(data._links.next) {
      await search(`/wiki${data._links.next}`, option);
    }
  }

  //dryrun: do not create/update content property if true
  //verbose: true to print logs
  //allPages: false to search current page only
  await search('/wiki/rest/api/content', {dryrun: true, verbose: false, allPages: false});

})();