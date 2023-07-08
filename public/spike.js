var pageId = 458162177

async function cloneAsFull(customContentId) {
  var data = await fetch(`/wiki/rest/api/content/${customContentId}?expand=body.raw,version.number,container,space`).then(r => r.json());
  var data2 = {type: 'ac:com.zenuml.confluence-addon:zenuml-content-sequence', title: data.title, space: {key: data.space.key}, body: data.body, container: {type: 'page', id: data.container?.id}}
  return await fetch('/wiki/rest/api/content', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data2)}).then(r => r.json())
}

//create custom content
var value = {"title":"Order Service (Demonstration only)","code":"title Order Service (Demonstration only)\n// Styling participants with background colors is an experimental feature.\n// This feature is available for users to test and provide feedback.\n@Actor Client #FFEBE6\n@Boundary OrderController #0747A6\n@EC2 <<BFF>> OrderService #E3FCEF\ngroup BusinessService {\n  @Lambda PurchaseService\n  @AzureFunction InvoiceService\n}\n\n@Starter(Client)\n//`POST /orders`\nOrderController.post(payload) {\n  OrderService.create(payload) {\n    order = new Order(payload)\n    if(order != null) {\n      par {\n        PurchaseService.createPO(order)\n        InvoiceService.createInvoice(order)      \n      }      \n    }\n  }\n}","mermaidCode":"graph TD; A-->B;","diagramType":"sequence","source":"custom-content"}

var body = {raw: {value: JSON.stringify(value), representation: 'raw'}}

var data = {type: 'ac:com.zenuml.confluence-addon-lite:zenuml-content-sequence', title: 'Order Service (Demonstration only)', space: {key: 'WHIMET4'}, body, container: {type: 'page', id: pageId}}

var customContent = await fetch('/wiki/rest/api/content', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)}).then(r => r.json())

//reset page content
var url = `/wiki/rest/api/content/${pageId}`;
var page = await fetch(`${url}?expand=body.atlas_doc_format,version.number,container,space`).then(r => r.json());

var content = [{"type":"paragraph","content":[{"text":"this is a lite macro:","type":"text"}]},{"type":"extension","attrs":{"layout":"default","extensionType":"com.atlassian.confluence.macro.core","extensionKey":"zenuml-sequence-macro-lite","parameters":{"macroParams":{"uuid":{"value":"82ce11cc-517b-4598-a7d0-339d0d11430b"},"customContentId":{"value":`${customContent.id}`},"__bodyContent":{"value":""},"updatedAt":{"value":"2023-07-08T03:21:58Z"}},"macroMetadata":{"macroId":{"value":"67625e23-8f22-4e1b-ba13-a3e03dbfe06b"},"schemaVersion":{"value":"1"},"placeholder":[{"type":"icon","data":{"url":"https://confluence-plugin.pages.dev/image/zenuml_logo.png"}}],"title":"ZenUML Diagram Lite"}},"localId":"dbee3375-27aa-489b-b827-12076b861294"}}];

var data = {type: 'page', title: page.title, status: page.status, space: {key: page.space.key}, version: {number: ++page.version.number}, body: {atlas_doc_format: {value: JSON.stringify({type: 'doc', content}), representation: 'atlas_doc_format'}}};

await fetch(url, {method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)}).then(r => r.json())

//migrate lite to full
var page = await fetch(`${url}?expand=body.atlas_doc_format,version.number,container,space`).then(r => r.json());
var content = JSON.parse(page.body.atlas_doc_format.value).content;
var check = c => c.type === 'extension' && c.attrs.extensionType === 'com.atlassian.confluence.macro.core' && c.attrs.extensionKey === 'zenuml-sequence-macro-lite';

var customContentIds = content.filter(check).map(c => c.attrs.parameters?.macroParams?.customContentId?.value);
var clones = await Promise.all(customContentIds.map(i => cloneAsFull(i).then(d => ({source: i, dest: d.id}))))
var cloneMap = clones.reduce((acc, i) => {acc[i.source] = i.dest; return acc}, {})

content.forEach(c => {
  if(check(c)) {
    c.attrs.extensionKey = 'zenuml-sequence-macro';

    var customContentId = c.attrs.parameters?.macroParams?.customContentId?.value;
    if(customContentId) {
      c.attrs.parameters.macroParams.customContentId.value = cloneMap[customContentId]
    }
  }
})

var data = {type: 'page', title: page.title, status: page.status, space: {key: page.space.key}, version: {number: ++page.version.number}, body: {atlas_doc_format: {value: JSON.stringify({type: 'doc', content}), representation: 'atlas_doc_format'}}};

await fetch(url, {method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)}).then(r => r.json())
