
const STORAGE_KEY = 'onboardingState';
const STORAGE_KEY_DEMO_PAGE = 'ZenUMLDemoPagePopupState';
const DEFAULT_STATE = {users: {}, lastUpdated: new Date()};
const HELP_DESK_URL = 'https://zenuml.atlassian.net/servicedesk/customer/portals';

const version = () => getUrlParam('version');
const postInstallPageKey = () => getUrlParam('postInstallPageKey');

const url = () => `/rest/atlassian-connect/1/addons/${addonKey()}/properties/${STORAGE_KEY}`;

let userId = '', clientDomain = '', currentSpace = '';

const UPGRADE_INCLUDE_DOMAINS = ['whimet4'];

async function init() {

  if(!addonKey().includes('-lite') && UPGRADE_INCLUDE_DOMAINS.includes(getClientDomain())) {
    console.log('Upgrade - full plugin detected, kicking off..')
    AP.user.getCurrentUser(async (u) => await upgrade(u.atlassianAccountId));
  }
  
  
  if(!isGoogleChrome()) {
    return;
  }

  try {
    try {
      currentSpace = await getCurrentSpace();
    } catch (e) {
      currentSpace = 'unknown_space';
      console.log('Error getting current space', e);
      trackEvent('error', 'getCurrentSpace', e.message);
    }

    const localState = getLocalState(STORAGE_KEY);
    const remoteState = await getAppProperty();

    const demoPagePopupState = getLocalState(STORAGE_KEY_DEMO_PAGE);
    const demoPageExists = await checkDemoPageExists();

    const isOnboarded = (u, state) => {
      const ver = version();
      const userState = state.users[u.atlassianAccountId];
      return userState
        && userState[ver]
        && (!userState[ver].expires || (new Date() < new Date(userState[ver].expires)));
    };

    const expiresOf = (u, state) => state.users[u.atlassianAccountId][version()].expires;

    const checkUser = (u) => {
      userId = u.atlassianAccountId;

      const localOnboarded = isOnboarded(u, localState);
      const remoteOnboarded = isOnboarded(u, remoteState);

      if(!localOnboarded && !remoteOnboarded) {
        // popup();
        setOnboardedForOneYear();
        trackEvent(userId, 'display', 'onboarding');
      }
      else if(!localOnboarded) {
        setOnboardedLocalState(u, expiresOf(u, remoteState));
        trackEvent(userId, 'copy_remote_onboarded_state_to_local', 'onboarding');
      }

      if(!demoPageExists && !demoPagePopupState?.displayed) {
        // demoPagePopup();
        setLocalState(STORAGE_KEY_DEMO_PAGE, {displayed: true, created: new Date()});
        trackEvent(userId, 'display', 'demo');
      }
    }

    AP.user.getCurrentUser(checkUser);
  } catch(e) {
    reportError(e, 'init');
  }
}


function setOnboardedForOneYear() {
  AP.user.getCurrentUser(u => setOnboarded(u, getOneYearLater()));
}

function setOnboarded(user, expires) {
  try {
    setOnboardedLocalState(user, expires);
    return Promise.resolve();
  } catch(e) {
    reportError(e, 'setOnboardedLocalState');

    return setOnboardedRemoteState(user, expires);
  }
};

function setOnboardedLocalState(user, expires) {
  setLocalState(STORAGE_KEY, getOnboardedState(getLocalState(STORAGE_KEY), user, expires));
};

function setOnboardedRemoteState(user, expires) {
  return getAppProperty().then(s => setAppProperty(getOnboardedState(s, user, expires)));
};

function getOnboardedState(state, user, expires) {
  const lastUpdated = new Date();
  const newState = clone(state);
  newState.users[user.atlassianAccountId] = {[version()]: {lastUpdated, expires}};
  newState.lastUpdated = lastUpdated;
  return newState;
};

function gotoOnboardingPage() {
  AP.navigator.go('addonModule', {addonKey: addonKey(), moduleKey: postInstallPageKey()});
}

function getLocalState(key) {
  try {
    const localState = window.localStorage.getItem(getLocalStorageKey(key));
    return localState && JSON.parse(localState) || DEFAULT_STATE;
  } catch(e) {
    return DEFAULT_STATE;
  }
}

function setLocalState(key, state) {
  window.localStorage.setItem(getLocalStorageKey(key), JSON.stringify(state));
}

function getLocalStorageKey(key) {
  return `${key || STORAGE_KEY}-${getClientDomain()}`;
}

async function getAppProperty() {
  try {
    const data = JSON.parse((await AP.request({url: url(), type: 'GET'})).body);
    return data && data.value;
  } catch(e) {
    if(!(e && e.xhr && e.xhr.status === 404)) { //not initial state that app property doesn't exist
      reportError(e, 'getAppProperty');
    }
    return DEFAULT_STATE;
  }
}

async function setAppProperty(data) {
  try {
    await AP.request({url: url(), type: 'PUT', contentType: 'application/json', data: JSON.stringify(data)});
  } catch(e) {
    const label = e?.xhr?.responseText || '';
    trackEvent(label, 'set_app_property_error', 'onboarding');
    reportError(e, 'setAppProperty', true);
  }
}

function trackEvent(label, action, category) {
  try {
    const eventDetails = {
      'event_category': category,
      'event_label' : label,
      'client_domain': getClientDomain(),
      'user_account_id': userId,
      'confluence_space': currentSpace
    };
    window.gtag && window.gtag('event', action, eventDetails);
    if(window.zaraz) {
      window.zaraz.track(action, eventDetails);
    }
  } catch (e) {
    reportError(e, 'trackEvent', true);
  }
}

function getOneYearLater() {
  const date = new Date();
  const nextYear = date.getFullYear() + 1;
  if(nextYear > new Date(8640000000000000).getFullYear()) {
    throw 'Date value out of range';
  }
  date.setFullYear(nextYear);
  return date;
}

function clone(o) {
  return JSON.parse(JSON.stringify(o));
}

function getClientDomain() {
  try {
    return clientDomain || (clientDomain = getAtlassianDomain()) || 'unknown_client_domain';
  } catch(e){
    console.error(e);
    return 'unknown_client_domain';
  }
}

function getAtlassianDomain() {
  const pattern = /\/\/([a-z0-9-_]+)\.atlassian\.net/i;
  const xdme = getUrlParam('xdm_e');
  const url = xdme && decodeURIComponent(xdme);
  const result = pattern.exec(url);
  if(result && result.length > 1) {
    return result[1];
  }
  return '';
}

function getCurrentSpace() {
  return new Promise(resolv =>
    AP.navigator.getLocation(l => resolv(l?.context?.spaceKey)));
}

function reportError(error, context, skipEvent) {
  if(!skipEvent) {
    trackEvent(`${context} error: ${error && JSON.stringify(error)}`, 'unexpected_error', 'onboarding');
  }

  console.error(`Error in ${context}. Please report to our helpdesk: ${HELP_DESK_URL}`, error);
}

function reportDemoPageError(error, context) {
  trackEvent(`${context} error: ${error && JSON.stringify(error)}`, 'unexpected_error', 'demoPage');
  console.error(`Error in ${context}. Please report to our helpdesk: ${HELP_DESK_URL}`, error);
}

function isGoogleChrome() {
  //https://stackoverflow.com/questions/4565112/javascript-how-to-find-out-if-the-user-browser-is-chrome/13348618#13348618
  var isChromium = window.chrome;
  var winNav = window.navigator;
  var vendorName = winNav.vendor;
  var isOpera = typeof window.opr !== "undefined";
  var isIEedge = winNav.userAgent.indexOf("Edg") > -1;
  var isIOSChrome = winNav.userAgent.match("CriOS");

  if (isIOSChrome) {
    // is Google Chrome on IOS
  } else if(
    isChromium !== null &&
    typeof isChromium !== "undefined" &&
    vendorName === "Google Inc." &&
    isOpera === false &&
    isIEedge === false
  ) {
    // is Google Chrome
    return true;
  } else {
    // not Google Chrome
  }
}

async function checkDemoPageExists() {
  const url = `/rest/api/content/search?cql=(title="${demoPageTitle}" and space="${currentSpace}")`;
  const response = await AP.request({type: 'GET', contentType: 'application/json', url});
  return JSON.parse(response.body)?.size > 0;
}

async function createCustomContent(title, body, containerPageId) {
  const url = `/rest/api/content`;
  const type = `ac:${addonKey()}:zenuml-content-graph`;
  const data = {type, title, container: {id: containerPageId, type: 'page'}, space: {key: currentSpace}, body: {raw: {value: JSON.stringify(body), representation: 'raw'}}};

  const response = await AP.request({type: 'POST', contentType: 'application/json', data: JSON.stringify(data), url});
  return response.body && JSON.parse(response.body);
}

async function createDemoPageDraft() {
  const data = {type: 'page', title: demoPageTitle, status: 'draft', space: {key: currentSpace}, body: {raw: {value: '', representation: 'raw'}}};
  const demoPageDraft = await createContent(data);
  trackEvent(userId, 'created_demo_page_draft', 'demoPage');
  return demoPageDraft;
}

async function deleteDemoPageDraft(page) {
  //We can't use "Delete content" API as it requires Connect app scope: DELETE
  await updateContent(page.id, Object.assign({}, page, {status: 'trashed'}));
  trackEvent(userId, 'deleted_demo_page_draft', 'demoPage');
  return demoPageDraft;
}

async function createDemoPage() {
  const page = await createDemoPageDraft();

  try {
    const [sequence, openAPI, mermaid, graph] = await Promise.all([
      createCustomContent(demoSequenceTitle, demoSequenceContent, page.id),
      createCustomContent(demoOpenAPITitle, demoOpenAPIContent, page.id),
      createCustomContent(demoMermaidTitle, demoMermaidContent, page.id),
      createCustomContent(demoGraphTitle, demoGraphContent, page.id)
    ]);

    const body = JSON.stringify(demoPageContent)
      .replaceAll('$$_SEQUENCE_CONTENT_ID', sequence.id)
      .replaceAll('$$_OPENAPI_CONTENT_ID', openAPI.id)
      .replaceAll('$$_MERMAID_CONTENT_ID', mermaid.id)
      .replaceAll('$$_GRAPH_CONTENT_ID', graph.id);

    const data = {type: 'page', title: demoPageTitle, status: 'current', space: {key: currentSpace}, version: {number: page.version.number}, body: {atlas_doc_format: {value: body, representation: 'atlas_doc_format'}}};
    const response = await updateContent(page.id, data);

    trackEvent(userId, 'published_demo_page', 'demoPage');
    return response;
  }
  catch(e) {
    await deleteDemoPageDraft(page);
    throw e;
  }
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

const getCustomContentTypePrefix = (isLite) => `ac:${addonKey()}${isLite ? '-lite' : ''}`;

async function searchPagesContainingCustomContent(isLite, spaceKey, customContentFilter) {
  spaceKey = spaceKey || (await getCurrentSpace());
  const customContentType = t => `${getCustomContentTypePrefix(isLite)}:${t}`;
  const typeClause = t => `type="${customContentType(t)}"`;
  const typesClause = a => a.map(typeClause).join(' or ');
  const searchUrl = `/rest/api/content/search?cql=space="${spaceKey}" and (${typesClause(CUSTOM_CONTENT_TYPES)}) order by lastmodified desc&expand=container,space,body.raw`;

  //search custom content whose container is page and return the page id
  const searchOnce = async (url) => {
    console.debug(`Searching content with ${url}`);
    const data = JSON.parse((await AP.request({type: 'GET', url})).body);
    console.debug(`${data?.size} results returned, has next? ${data?._links?.next != null}`);

    const shouldInclude = (customContent) => customContent.container?.type === 'page' && (!customContentFilter || customContentFilter(customContent));
    data.results = data?.results.filter(shouldInclude).map(c => c.container.id);
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


async function getSpaces() {
  const url = `/rest/api/space`;
  const response = await AP.request({type: 'GET', url});
  return (response.body && JSON.parse(response.body))?.results || [];
}

async function canEdit(pageId, userId) {
  const url = `/rest/api/content/${pageId}/permission/check`;
  const response = await AP.request({type: 'POST', contentType: 'application/json', data: JSON.stringify({subject: {type: 'user', identifier: userId}, operation: 'update'}), url});
  return response.body && JSON.parse(response.body).hasPermission;
}

function unique(array) {
  return Array.from(new Set(array));
}

async function getSourceCustomContentId(customContentId) {
  const data = await getContent(customContentId, 'expand=body.raw,version.number,container,space');
  return JSON.parse(data.body.raw.value).sourceCustomContentId;
}

async function downgradePage(pageId, userId) {
  console.log(`Downgrade - processing page ${pageId}`)

  const b = await canEdit(pageId, userId);
  if(!b) {
    console.log(`Downgrade - no edit permission, skip page ${pageId}`);
    return;
  }

  const page = await getContent(pageId, 'expand=body.atlas_doc_format,version.number,container,space');
  const content = JSON.parse(page.body.atlas_doc_format.value).content;
  const check = (c) => c.type === 'extension' && c.attrs.extensionType === 'com.atlassian.confluence.macro.core' && /zenuml-(sequence|graph|openapi|embed)-macro/.test(c.attrs.extensionKey);
  const macros = content.filter(check);
  const contentIds = macros.map(c => c.attrs?.parameters?.macroParams?.customContentId?.value).filter(i => i);

  if(contentIds.length) {
    const results = await Promise.all(contentIds.map(i => getSourceCustomContentId(i).then(d => ({source: i, dest: d}))));
    const resultMap = results.reduce((acc, i) => {acc[i.source] = i.dest; return acc}, {});
    
    macros.forEach(c => {
      c.attrs.extensionKey = `${c.attrs.extensionKey}-lite`;
  
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

async function downgrade(userId, spaceKey) {
  console.log(`Downgrade - kicking off in space ${spaceKey}`)
  const pages = unique(await searchPagesContainingCustomContent(false, spaceKey, (c) => {
    const value = JSON.parse(c.body.raw.value);
    return value.upgraded && value.sourceCustomContentId;
  }));
  
  console.log("Pages to downgrade: ", pages)
  pages.forEach(async (p) => await downgradePage(p, userId));
}