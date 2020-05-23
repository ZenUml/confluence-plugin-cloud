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

  const storageFormatUrl = (pageId) => `/wiki/plugins/viewstorage/viewpagestorage.action?pageId=${pageId}`;

  const getStorageFormat = (pageId) => fetch(storageFormatUrl(pageId)).then(r => r.text()).then(x => ({pageId: pageId, content: x}));

  const iteratePages = async (pages, option) => {
    pages.forEach(async (page) => {
      const pageId = page.id;
      const title = page.title;
      const data = await getStorageFormat(pageId);
      const xml = data.content;

      if((xml.includes(zenumlFull) || xml.includes(zenumlLite)) && xml.includes(macroBodySelector)) {
        if(option.verbose) {
          console.log(`checking page "${title}"`);
        }

        const macros = parseMacros(xml);
        const empty = macros.filter(m => m.body && m.body.trim().length === 0);
        if(empty && empty.length > 0) {
          console.log(`found page "${title}" has ${empty.length} empty macro body: ${option.base}${page._links.webui}\nstorage format: ${option.base.replace('/wiki', '')}${storageFormatUrl(pageId)}`);
        }
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
  await search('/wiki/rest/api/content', {dryrun: true, verbose: false, allPages: true});

})();