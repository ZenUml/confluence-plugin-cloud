var url = '/wiki/rest/api/content/347635717';
var page = await fetch(`${url}?expand=body.atlas_doc_format,version.number,container,space`).then(r => r.json());
var content = JSON.parse(page.body.atlas_doc_format.value).content;

content.forEach(c => {
  if(c.type === 'extension' && c.attrs.extensionType === 'com.atlassian.confluence.macro.core' 
    && c.attrs.extensionKey === 'zenuml-sequence-macro-lite') {
    c.attrs.extensionKey = 'zenuml-sequence-macro';
  }
})

var data = {type: 'page', title: page.title, status: page.status, space: {key: page.space.key}, version: {number: ++page.version.number}, body: {atlas_doc_format: {value: JSON.stringify({type: 'doc', content}), representation: 'atlas_doc_format'}}};

await fetch(url, {method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)}).then(r => r.json())

//create new custom content
var data = await fetch(`/wiki/rest/api/content/356810828?expand=body.raw,version.number,container,space`).then(r => r.json());
var data2 = {type: 'ac:com.zenuml.confluence-addon:zenuml-content-sequence', title: data.title, space: {key: data.space.key}, body: data.body, container: {type: 'page', id: 347635717}}
await fetch('/wiki/rest/api/content', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data2)}).then(r => r.json())