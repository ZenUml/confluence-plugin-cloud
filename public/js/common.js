
function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

function getUrlParam (param) {
  let codeParams = (new RegExp(param + '=([^&]*)')).exec(window.location.search);
  if(codeParams && codeParams.length >= 1) {
    const codedParam = codeParams[1];
    return decodeURIComponent(codedParam);
  }
  return null;
}

function addonKey() {
  return getUrlParam('addonKey');
}

function isLite() {
  return addonKey()?.includes('lite');
}

function getModuleKeySuffix() {
  return isLite() ? '-lite' : '';
}

function getCurrentSpace() {
  return new Promise(resolv =>
    AP.navigator.getLocation(l => resolv(l?.context?.spaceKey)));
}

async function createContent(data) {
  const url = `/rest/api/content`;
  const response = await AP.request({type: 'POST', contentType: 'application/json', data: JSON.stringify(data), url});
  return response.body && JSON.parse(response.body);
}

async function updateContent(id, data) {
  const url = `/rest/api/content/${id}`;
  const response = await AP.request({type: 'PUT', contentType: 'application/json', data: JSON.stringify(data), url});
  return response.body && JSON.parse(response.body);
}

async function getContent(id, queryParams) {
  const params = queryParams ? '?' + queryParams : '';
  const url = `/rest/api/content/${id}${params}`;
  const response = await AP.request({type: 'GET', url});
  return response.body && JSON.parse(response.body);
}

async function canEdit(pageId, userId) {
  const url = `/rest/api/content/${pageId}/permission/check`;
  const response = await AP.request({type: 'POST', contentType: 'application/json', data: JSON.stringify({subject: {type: 'user', identifier: userId}, operation: 'update'}), url});
  return response.body && JSON.parse(response.body).hasPermission;
}

const CUSTOM_CONTENT_TYPES = ['zenuml-content-sequence', 'zenuml-content-graph'];

const getCustomContentTypePrefix = () => `ac:${addonKey()}-lite`;

async function searchPagesContainingCustomContent() {
  const spaceKey = (await getCurrentSpace());
  const customContentType = t => `${getCustomContentTypePrefix()}:${t}`;
  const typeClause = t => `type="${customContentType(t)}"`;
  const typesClause = a => a.map(typeClause).join(' or ');
  const searchUrl = `/rest/api/content/search?cql=space="${spaceKey}" and (${typesClause(CUSTOM_CONTENT_TYPES)}) order by lastmodified desc&expand=container,space`;

  //search custom content whose container is page and return the page id
  const searchOnce = async (url) => {
    console.debug(`Searching content with ${url}`);
    const data = JSON.parse((await AP.request({type: 'GET', url})).body);
    console.debug(`${data?.size} results returned, has next? ${data?._links?.next != null}`);

    data.results = data?.results.filter((c) => c.container?.type === 'page').map(c => c.container.id);
    return data;
  };

  const searchAll = async () => {
    let url = searchUrl, data;
    let results = [];
    do {
      data = await searchOnce(url);
      results = results.concat(data?.results);
      url = data?._links?.next || '';
    } while(url);
    return results;
  };

  try {
    return await time(searchAll, (duration, results) => {
      trackEvent(`onboarding-panel - found ${results?.length} content, took ${duration} ms`, 'searchAll', 'info');
    });
  } catch (e) {
    console.error('searchCustomContent', e);
    trackEvent(JSON.stringify(e), 'searchCustomContent', 'error');
    return [];
  }
}

async function time(action, callback) {
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