
async function cloneAsFull(customContentId) {
  const data = await getContent(customContentId, 'expand=body.raw,version.number,container,space');
  const data2 = {type: 'ac:com.zenuml.confluence-addon:zenuml-content-sequence', title: data.title, space: {key: data.space.key}, body: data.body, container: {type: 'page', id: data.container?.id}}
  return await createContent(data2);
}

async function upgrade() {
  const context = await AP.context.getContext();
  if(context?.confluence?.content?.type !== 'page') return;

  const pageId = context.confluence.content.id;
  const page = await getContent(pageId, 'expand=body.atlas_doc_format,version.number,container,space');
  const content = JSON.parse(page.body.atlas_doc_format.value).content;
  const check = (c) => c.type === 'extension' && c.attrs.extensionType === 'com.atlassian.confluence.macro.core' && /zenuml-(sequence|graph|openapi|embed)-macro-lite/.test(c.attrs.extensionKey);
  const macros = content.filter(check);
  const contentIds = macros.map(c => c.attrs?.parameters?.macroParams?.customContentId?.value).filter(i => i);

  if(contentIds.length) {
    const clones = await Promise.all(contentIds.map(i => cloneAsFull(i).then(d => ({source: i, dest: d.id}))));
    const cloneMap = clones.reduce((acc, i) => {acc[i.source] = i.dest; return acc}, {});
    
    macros.forEach(c => {
      c.attrs.extensionKey = c.attrs.extensionKey.replace('-lite', '');
  
      const id = c.attrs.parameters?.macroParams?.customContentId?.value;
      if(id) {
        c.attrs.parameters.macroParams.customContentId.value = cloneMap[id]
      }
    });
    
    const data = {type: 'page', title: page.title, status: page.status, space: {key: page.space.key}, version: {number: ++page.version.number, message: 'ZenUML lite macros are upgraded'}, body: {atlas_doc_format: {value: JSON.stringify({type: 'doc', content}), representation: 'atlas_doc_format'}}};
    
    await updateContent(pageId, data);
    
    AP.flag.create({title: `${contentIds.length} Lite macros migrated to Full`});
  } else {
    console.log('Upgrade - lite macro not found')
  }
}