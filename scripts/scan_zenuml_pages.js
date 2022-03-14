// This script is used to scan all pages in a Confluence space to find pages containing ZenUML macro.
// It's intended to be manually executed in the browser developer console.

(function () {
  const body = page => JSON.parse(page.body.atlas_doc_format.value);

  const has = body => body.content.filter(c => c.type === 'extension' && c.attrs.extensionType === 'com.atlassian.confluence.macro.core' && c.attrs.extensionKey.indexOf('zenuml-') === 0);

  const process = response => response.results.filter(p => has(body(p)).length > 0).map(p => `${response._links.base}${p._links.webui}`);

  const scan = url => fetch(url).then(r => r.json()).then(r => {
    console.log(process(r));
    return r;
  }).then(r => r._links.next && scan(`${r._links.context}${r._links.next}`));

  scan(`/wiki/rest/api/content?expand=body.atlas_doc_format&limit=10`);
})();
