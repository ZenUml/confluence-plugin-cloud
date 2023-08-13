
async function cloneAsFull(customContentId) {
  const data = await getContent(customContentId, 'expand=body.raw,version.number,container,space');
  const data2 = {type: 'ac:com.zenuml.confluence-addon:zenuml-content-sequence', title: data.title, space: {key: data.space.key}, body: data.body, container: {type: 'page', id: data.container?.id}}
  return await createContent(data2);
}

async function upgradePage(pageId, userId) {
  console.log(`Upgrade - processing page ${pageId}`)

  const b = await canEdit(pageId, userId);
  if(!b) {
    console.log(`Upgrade - no edit permission, skip page ${pageId}`);
    return;
  }

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
    
    // const name = await getUserDisplayName(userId);
    const data = {type: 'page', title: page.title, status: page.status, space: {key: page.space.key}, version: {number: ++page.version.number, message: `ZenUML lite macro(s) on this page are upgraded by XXX on behalf of ZenUML App`}, body: {atlas_doc_format: {value: JSON.stringify({type: 'doc', content}), representation: 'atlas_doc_format'}}};
    
    await updateContent(pageId, data);
    return contentIds.length;
    
  } else {
    console.log(`Upgrade - lite macro not found on page ${pageId}`)
  }
}

function unique(array) {
  return Array.from(new Set(array));
}

async function upgrade(userId) {
  if(localStorage.zenumlUpgradeDisabed) {
    return;
  }

  const context = await AP.context.getContext();
  if(context?.confluence?.content?.type !== 'page') return;

  const pageId = context.confluence.content.id;
  const macroCount = await upgradePage(pageId, userId)
  if(macroCount) {
    showPopup(pageId, macroCount);
  }

  const pages = await searchPagesContainingCustomContent();
  unique(pages.filter(p => p != pageId)).forEach(async (p) => await upgradePage(p, userId));
}

function showPopup(pageId, macroCount) {
  const flag = AP.flag.create({
    title: `${macroCount} Lite macros migrated to Full on page ${pageId}`,
    actions: {
      'reload': 'Reload Page'
    }
  });

  AP.events.on('flag.action', function(e) {
    flag && flag.close();

    if(e.actionIdentifier === 'reload') {
      trackEvent(userId, 'reload', 'lite-to-full-upgrade');

      AP.navigator.go('contentview', {contentId: pageId});

    }
  });
}