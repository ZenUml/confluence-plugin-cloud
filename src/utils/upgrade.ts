import { getUrlParam, trackEvent } from "@/utils/window";
//old/lite custom content: migrated: true, destCustomContentId: xxx (needed by embedded macro migration)
//new/full custom content: migrated: true, sourceCustomContentId: xxx (needed by downgrade)
//content properties

const UPGRADE_INCLUDE_DOMAINS = ['whimet4', 'whimet6', 'zenuml-dashboard-full-test'];

async function request(url: string, data: any = undefined, method: string | undefined = undefined): Promise<any> {
  const type = data ? method || 'POST' : 'GET';
  const params = Object.assign({url, type}, data ? {contentType: 'application/json', data: JSON.stringify(data)}: {});
  //@ts-ignore
  const response = await AP.request(params);
  return Object.assign({}, response && response.body && JSON.parse(response.body), {xhr: response.xhr});
}

async function getContent(id: string, queryParams: string) {
  const params = queryParams ? '?' + queryParams : '';
  const url = `/rest/api/content/${id}${params}`;
  return await request(url);
}

async function getPage(id: string) {
  const url = `/api/v2/pages/${id}?body-format=atlas_doc_format`;
  return await request(url);
}

async function updatePage(id: string, data: any) {
  const url = `/api/v2/pages/${id}`;
  return await request(url, data, 'PUT');
}

async function getCustomContent(id: string) {
  const url = `/api/v2/custom-content/${id}?body-format=raw`;
  return await request(url);
}

async function createCustomContent(data: any) {
  return await request(`/api/v2/custom-content`, data);
}

async function createContent(data: any) {
  return await request(`/rest/api/content`, data);
}

async function updateContent(id: string, data: any) {
  const url = `/rest/api/content/${id}`;
  return await request(url, data, 'PUT');
}

async function getAllSpaces() {
  return (await request(`/api/v2/spaces`)).results;
}

async function cloneAsFull(customContentId: string) {
  const data = await getCustomContent(customContentId);
  data.body.raw.value = JSON.stringify(Object.assign(JSON.parse(data.body.raw.value), {migrated: true, sourceCustomContentId: customContentId}));
  const createData = {type: 'ac:com.zenuml.confluence-addon:zenuml-content-sequence', title: data.title, pageId: data.pageId, body: data.body};
  return await createCustomContent(createData);
}

async function getSourceCustomContentId(customContentId: string) {
  const data = await getContent(customContentId, 'expand=body.raw,version.number,container,space');
  return JSON.parse(data.body.raw.value).sourceCustomContentId;
}

async function canEdit(pageId: string, userId: string) {
  const url = `/rest/api/content/${pageId}/permission/check`;
  const data = await request(url, {subject: {type: 'user', identifier: userId}, operation: 'update'});
  return data.hasPermission;
}

async function upgradePage(pageId: string, migratedCallback: any, spaceKey: string) {
  const page = await getPage(pageId);
  const traversal = (array: any, result: Array<any>): any => {
    result.push(...array);
    array.forEach((c: any) => {
      if(c.content) {
        traversal(c.content, result)
      }
    })
  };
  const content = JSON.parse(page.body.atlas_doc_format.value).content;
  const allContents: Array<any> = [];
  traversal(content, allContents);

  const check = (c: any) => c.type === 'extension' && c.attrs.extensionType === 'com.atlassian.confluence.macro.core' && /zenuml-(sequence|graph|openapi|embed)-macro-lite/.test(c.attrs.extensionKey);

  const macros = allContents.filter(check);
  const contentIds = macros.map((c: any) => c.attrs?.parameters?.macroParams?.customContentId?.value).filter((i: any) => i);

  if(contentIds.length) {
    const clones = await Promise.all(contentIds.map((i: any) => cloneAsFull(i).then(d => ({source: i, dest: d.id}))));
    const cloneMap = clones.reduce((acc: any, i) => {acc[i.source] = i.dest; return acc}, {});

    macros.forEach((c: any) => {
      c.attrs.extensionKey = c.attrs.extensionKey.replace('-lite', '');

      const id = c.attrs.parameters?.macroParams?.customContentId?.value;
      if(id) {
        c.attrs.parameters.macroParams.customContentId.value = cloneMap[id]
      }
    });

    const data = {id: pageId, title: page.title, status: page.status, version: {number: ++page.version.number, message: `ZenUML lite macro(s) on this page are upgraded by ZenUML App`}, body: {value: JSON.stringify({type: 'doc', content}), representation: 'atlas_doc_format'}};

    await updatePage(pageId, data);
    console.log(`Upgrade - ${contentIds.length} macro(s) migrated on page ${pageId} in space ${spaceKey}`);

    migratedCallback && migratedCallback(contentIds.length);

    return contentIds.length;

  } else {
    console.log(`Upgrade - lite macro not found in latest version of page ${pageId}`)
  }
}

async function downgradePage(pageId: string, userId: string) {
  console.log(`Downgrade - processing page ${pageId}`)

  const b = await canEdit(pageId, userId);
  if(!b) {
    console.log(`Downgrade - no edit permission, skip page ${pageId}`);
    return;
  }

  const page = await getContent(pageId, 'expand=body.atlas_doc_format,version.number,container,space');
  const content = JSON.parse(page.body.atlas_doc_format.value).content;
  const check = (c: any) => c.type === 'extension' && c.attrs.extensionType === 'com.atlassian.confluence.macro.core' && /zenuml-(sequence|graph|openapi|embed)-macro/.test(c.attrs.extensionKey);
  const macros = content.filter(check);
  const contentIds = macros.map((c: any) => c.attrs?.parameters?.macroParams?.customContentId?.value).filter((i: any) => i);

  if(contentIds.length) {
    const results = await Promise.all(contentIds.map((i: any) => getSourceCustomContentId(i).then(d => ({source: i, dest: d}))));
    const resultMap = results.reduce((acc, i) => {acc[i.source] = i.dest; return acc}, {});

    macros.forEach((c: any) => {
      c.attrs.extensionKey = `${c.attrs.extensionKey}'-lite'`;

      const id = c.attrs.parameters?.macroParams?.customContentId?.value;
      if(id) {
        c.attrs.parameters.macroParams.customContentId.value = resultMap[id]
      }
    });

    const data = {type: 'page', title: page.title, status: page.status, space: {key: page.space.key}, version: {number: ++page.version.number, message: `ZenUML full macro(s) on this page are downgraded by ZenUML App`}, body: {atlas_doc_format: {value: JSON.stringify({type: 'doc', content}), representation: 'atlas_doc_format'}}};

    await updateContent(pageId, data);
    return contentIds.length;

  } else {
    console.log(`Downgrade - full macro not found on page ${pageId}`)
  }
}

function unique(array: Array<any>) {
  return Array.from(new Set(array));
}


function addonKey() {
  return getUrlParam('addonKey');
}

function getCurrentSpace(): string {
  //@ts-ignore
  return new Promise(resolv => AP.context.getContext(c => resolv(c.confluence?.space?.key)));
}

const CUSTOM_CONTENT_TYPES = ['zenuml-content-sequence', 'zenuml-content-graph'];

const getCustomContentTypePrefix = (isLite: boolean) => `ac:${addonKey()}${isLite ? (addonKey()?.includes('lite') ? '' : '-lite') : ''}`;

async function searchCustomContent(isLite: boolean, spaceKey: string | undefined = undefined, customContentFilter: any = undefined) {
  spaceKey = spaceKey || (await getCurrentSpace());
  const customContentType = (t: string) => `${getCustomContentTypePrefix(isLite)}:${t}`;
  const typeClause = (t: string) => `type="${customContentType(t)}"`;
  const typesClause = (a: Array<string>) => a.map(typeClause).join(' or ');
  const searchUrl = `/rest/api/content/search?cql=space="${spaceKey}" and (${typesClause(CUSTOM_CONTENT_TYPES)}) order by lastmodified desc&expand=container,space`;

  //search custom content whose container is page and return the page id
  const searchOnce = async (url: string) => {
    console.debug(`Searching content with ${url}`);
    const data = await request(url);
    console.debug(`${data?.size} results returned, has next? ${data?._links?.next != null}`);

    const shouldInclude = (c: any) => c.container?.type === 'page' && (!customContentFilter || customContentFilter(c));
    data.results = data?.results.filter(shouldInclude);
    return data;
  };

  const searchAll = async () => {
    let url = searchUrl, data;
    let results: Array<any> = [];
    do {
      data = await searchOnce(url);
      results = results.concat(data?.results);
      url = data?._links?.next || '';
    } while(url);
    return results;
  };

  try {
    return await time(searchAll, (duration: number, results: Array<any>) => {
      trackEvent(`Upgrade - found ${results?.length} content, took ${duration} ms`, 'searchAll', 'info');
    });
  } catch (e) {
    console.error('searchCustomContent', e);
    trackEvent(JSON.stringify(e), 'searchCustomContent', 'error');
    return [];
  }
}

async function time(action: any, callback: any) {
  let actionResult;
  const startTime = performance.now();
  try {
    actionResult = await action();
    return actionResult;
  } finally {
    const duration = Math.round(performance.now() - startTime);
    callback(duration, actionResult);
  }
}

async function upgradeAllSpaces(userId: string, report: any) {
  report.migratedMacros = report.totalMacros = report.totalPages = report.uneditablePages = 0;

  const spaces = await getAllSpaces();
  await Promise.all(spaces.map((s: any) => upgradeSpace(userId, s.key, report)));

  report({migrated: report.migrated, total: report.total, completed: true});

  console.log(`Upgrade - migrated ${report.migratedMacros} macro(s) on ${report.totalPages} page(s) in all spaces. ${report.uneditablePages} page(s) skipped(no edit permission). Total macro(s): ${report.totalMacros}.`)

  showPopup(`Migrated ${report.migratedMacros} macro(s) on ${report.totalPages} page(s). ${report.uneditablePages > 0 ? report.uneditablePages + ' page(s) are skipped as the current user does not have edit permission.' : ''}`);
}

async function upgradeSpace(userId: string, spaceKey: string, report: any) {
  const contents = await searchCustomContent(true, spaceKey);
  const pageIds = contents.map((c: any) => c.container.id);
  const uniqPageIds = unique(pageIds);

  const canEditResults = await Promise.all(uniqPageIds.map(p => canEdit(p, userId).then(b => ({pageId: p, canEdit: b}))));
  const editablePageIds = canEditResults.filter(i => i.canEdit).map(i => i.pageId);
  const uneditablePageCount = canEditResults.filter(i => !i.canEdit).length;

  report.totalMacros += contents.length;
  report.uneditablePages += uneditablePageCount;
  
  const pageMigratedCallback = (macrosCount: number) => {
    report.migratedMacros += macrosCount;
    report.totalPages++;
    report({migrated: report.migratedMacros, total: report.totalMacros});
  };

  const results = await Promise.all(editablePageIds.map(p => upgradePage(p, pageMigratedCallback, spaceKey)));
  const macroCount = results.filter(r => r).reduce((acc: number, i: any) => acc = acc + i, 0);
  const pagesCount = results.filter(r => r).length;

  console.log(`Upgrade - finished space ${spaceKey}, ${macroCount} macros upgraded in ${pagesCount} pages, ${uneditablePageCount} pages skipped(no edit permission)`);
}

async function downgrade(userId: string, spaceKey: string) {
  console.log(`Downgrade - kicking off in space ${spaceKey}`)
  const pages = unique(await searchCustomContent(false, spaceKey, (c: any) => {
    const value: any = JSON.parse(c.body.raw.value);
    return value.upgraded && value.sourceCustomContentId;
  }));

  console.log("Pages to downgrade: ", pages)
  pages.forEach(async (p) => await downgradePage(p, userId));
}

function showPopup(title: string, actions: any = undefined): any {
  //@ts-ignore
  if(showPopup.flag) {
    //@ts-ignore
    showPopup.flag.close();
  }

  //@ts-ignore
  return showPopup.flag = AP.flag.create({ title, actions });
}


function getAtlassianDomain(): string {
  const pattern = /\/\/([a-z0-9-_]+)\.atlassian\.net/i;
  const xdme = getUrlParam('xdm_e');
  const url: any = xdme && decodeURIComponent(xdme);
  const result = pattern.exec(url);
  if(result && result.length > 1) {
    return result[1];
  }
  return '';
}

function isUpgradeEnabled(): boolean {
  return UPGRADE_INCLUDE_DOMAINS.includes(getAtlassianDomain());
}

export default {
  isEnabled: isUpgradeEnabled,
  run(progressReporter: any) {
    if(isUpgradeEnabled()) {
      console.log('Upgrade - atlassian domain allowed, kicking off..');
      showPopup('Started to migrate ZenUML Lite macros in all spaces');

      //@ts-ignore
      AP.user.getCurrentUser(async (u) => await upgradeAllSpaces(u.atlassianAccountId, progressReporter));
    }
  }
};
