
const STORAGE_KEY = 'onboardingState';
const STORAGE_KEY_DEMO_PAGE = 'ZenUMLDemoPagePopupState';
const DEFAULT_STATE = { users: {}, lastUpdated: new Date() };
const HELP_DESK_URL = 'https://zenuml.atlassian.net/servicedesk/customer/portals';

const version = () => getUrlParam('version');
const postInstallPageKey = () => getUrlParam('postInstallPageKey');

const url = () => `/rest/atlassian-connect/1/addons/${addonKey()}/properties/${STORAGE_KEY}`;

var flag, userId = '', clientDomain = '', currentSpace = {};

const popup = () => {
  flag = AP.flag.create({
    title: 'New version of ZenUML add-on installed',
    body: 'You can embed existing diagrams and Open API specifications now. Use `/embed` to insert the macro.',
    type: 'info',
    actions: {
      'seeHowItWorks': 'See how it works',
      'noThanks': 'No thanks'
    }
  });
};

const demoPagePopup = () => {
  flag = AP.flag.create({
    title: 'ZenUML Demo Page',
    body: 'We have prepared a demo page. Would you like to check it out?',
    type: 'info',
    actions: {
      'demoPage.yes': 'Yes please',
      'demoPage.no': 'No thanks'
    }
  });
};

async function init() {
  try {
    try {
      currentSpace = await getCurrentSpace();
    } catch (e) {
      currentSpace = { key: 'unknow_space' };
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

      if (!localOnboarded && !remoteOnboarded) {
        popup();

        setOnboardedForOneYear();

        trackEvent(userId, 'display', 'onboarding');
      }
      else if (!localOnboarded) {
        setOnboardedLocalState(u, expiresOf(u, remoteState));

        trackEvent(userId, 'copy_remote_onboarded_state_to_local', 'onboarding');
      }

      if (!demoPageExists && !demoPagePopupState?.displayed) {
        demoPagePopup();
        setLocalState(STORAGE_KEY_DEMO_PAGE, { displayed: true, created: new Date() });
      }
    }

    AP.user.getCurrentUser(checkUser);
  } catch (e) {
    reportError(e, 'init');
  }
}

AP.events.on('flag.action', async function (e) {
  try {
    flag && flag.close();

    if (e.actionIdentifier === 'seeHowItWorks') {
      trackEvent(userId, 'see_how_it_works', 'onboarding');

      AP.user.getCurrentUser(u => {
        setOnboarded(u).then(gotoOnboardingPage);
      });

    }
    else if (e.actionIdentifier === 'noThanks') {
      trackEvent(userId, 'no_thanks', 'onboarding');

      setOnboardedForOneYear();
    }

    else if (e.actionIdentifier === 'demoPage.yes') {
      trackEvent(userId, 'yes', 'demoPage');

      try {
        const page = await createDemoPage();
        AP.navigator.go('contentview', { contentId: page.id });
      } catch (e) {
        reportDemoPageError(e, 'createDemoPage');
      }
    }
    else if (e.actionIdentifier === 'demoPage.no') {
      trackEvent(userId, 'no', 'demoPage');
    }

  } catch (e) {
    reportError(e, 'onFlagAction');
  }
});

function setOnboardedForOneYear() {
  AP.user.getCurrentUser(u => setOnboarded(u, getOneYearLater()));
}

function setOnboarded(user, expires) {
  try {
    setOnboardedLocalState(user, expires);
    return Promise.resolve();
  } catch (e) {
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
  newState.users[user.atlassianAccountId] = { [version()]: { lastUpdated, expires } };
  newState.lastUpdated = lastUpdated;
  return newState;
};

function gotoOnboardingPage() {
  AP.navigator.go('addonModule', { addonKey: addonKey(), moduleKey: postInstallPageKey() });
}

function getLocalState(key) {
  try {
    const localState = window.localStorage.getItem(getLocalStorageKey(key));
    return localState && JSON.parse(localState) || DEFAULT_STATE;
  } catch (e) {
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
    const data = JSON.parse((await AP.request({ url: url(), type: 'GET' })).body);
    return data && data.value;
  } catch (e) {
    if (!(e && e.xhr && e.xhr.status === 404)) { //not initial state that app property doesn't exist
      reportError(e, 'getAppProperty');
    }
    return DEFAULT_STATE;
  }
}

async function setAppProperty(data) {
  try {
    await AP.request({ url: url(), type: 'PUT', contentType: 'application/json', data: JSON.stringify(data) });
  } catch (e) {
    const label = e?.xhr?.responseText || '';
    trackEvent(label, 'set_app_property_error', 'onboarding');
    reportError(e, 'setAppProperty', true);
  }
}

function trackEvent(label, action, category) {
  try {
    const eventDetails = {
      'event_category': category,
      'event_label': label,
      'client_domain': getClientDomain(),
      'user_account_id': userId,
      'confluence_space': currentSpace?.key
    };
    window.gtag && window.gtag('event', action, eventDetails);
  } catch (e) {
    reportError(e, 'trackEvent', true);
  }
}

function getOneYearLater() {
  const date = new Date();
  const nextYear = date.getFullYear() + 1;
  if (nextYear > new Date(8640000000000000).getFullYear()) {
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
  } catch (e) {
    console.error(e);
    return 'unknown_client_domain';
  }
}

function getAtlassianDomain() {
  const pattern = /\/\/([a-z0-9-_]+)\.atlassian\.net/i;
  const xdme = getUrlParam('xdm_e');
  const url = xdme && decodeURIComponent(xdme);
  const result = pattern.exec(url);
  if (result && result.length > 1) {
    return result[1];
  }
  return '';
}

function getCurrentSpace() {
  return new Promise(resolv =>
    AP.context.getContext(c => resolv(c.confluence?.space)));
}

function reportError(error, context, skipEvent) {
  if (!skipEvent) {
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
  } else if (
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
  const url = `/rest/api/content/search?cql=(title="${demoPageTitle}" and space="${currentSpace?.key}")`;
  const response = await AP.request({ type: 'GET', contentType: 'application/json', url });
  const body = JSON.parse(response.body);
  return body.size && body.results && body.results[0];
}

async function createCustomContent(title, body, containerPageId) {
  const url = `/api/v2/custom-content`;
  const type = `ac:${addonKey()}:zenuml-content-graph`;
  const data = { type, pageId: containerPageId, title, body: { value: JSON.stringify(body), representation: 'raw' } };

  const response = await AP.request({ type: 'POST', contentType: 'application/json', data: JSON.stringify(data), url });
  return response.body && JSON.parse(response.body);
}

async function createDemoPageDraft(title, parentId) {
  const data = { spaceId: currentSpace?.id, status: 'draft', title: title || demoPageTitle, parentId, body: { value: '', representation: 'storage' } };
  const demoPageDraft = await createPage(data);
  trackEvent(userId, 'created_demo_page_draft', 'demoPage');
  return demoPageDraft;
}

async function deleteDemoPageDraft(page) {
  //We can't use "Delete content" API as it requires Connect app scope: DELETE
  const result = await updatePage(page.id, Object.assign({}, page, { status: 'deleted' }));
  if (result?.status === 'draft') {//if not deleted, fallback to old API
    await updateContent(page.id, Object.assign({}, page, { status: 'trashed', type: 'page' }));
  }
  trackEvent(userId, 'deleted_demo_page_draft', 'demoPage');
}

async function createDemoPage(title, parentId) {
  const page = await createDemoPageDraft(title, parentId);

  try {
    const [sequence, openAPI, mermaid, graph] = await Promise.all([
      createCustomContent(title ? `${title} - sequence` : demoSequenceTitle, demoSequenceContent, page.id),
      createCustomContent(title ? `${title} - openapi` : demoOpenAPITitle, demoOpenAPIContent, page.id),
      createCustomContent(title ? `${title} - mermaid` : demoMermaidTitle, demoMermaidContent, page.id),
      createCustomContent(title ? `${title} - graph` : demoGraphTitle, demoGraphContent, page.id)
    ]);

    const body = JSON.stringify(demoPageContent)
      .replaceAll('$$_SEQUENCE_CONTENT_ID', sequence.id)
      .replaceAll('$$_OPENAPI_CONTENT_ID', openAPI.id)
      .replaceAll('$$_MERMAID_CONTENT_ID', mermaid.id)
      .replaceAll('$$_GRAPH_CONTENT_ID', graph.id);

    const data = { id: page.id, status: 'current', title: title || demoPageTitle, spaceId: currentSpace?.id, body: { value: body, representation: 'atlas_doc_format' }, version: { number: page.version.number } };
    const response = await updatePage(page.id, data);

    trackEvent(userId, 'published_demo_page', 'demoPage');
    return response;
  }
  catch (e) {
    await deleteDemoPageDraft(page);
    throw e;
  }
}

async function createPage(data) {
  const url = `/api/v2/pages`;
  const response = await AP.request({ type: 'POST', contentType: 'application/json', data: JSON.stringify(data), url });
  return response.body && JSON.parse(response.body);
}

async function updateContent(id, data) {
  const url = `/rest/api/content/${id}`;
  const response = await AP.request({ type: 'PUT', contentType: 'application/json', data: JSON.stringify(data), url });
  return response.body && JSON.parse(response.body);
}

async function updatePage(id, data) {
  const url = `/api/v2/pages/${id}`;
  const response = await AP.request({ type: 'PUT', contentType: 'application/json', data: JSON.stringify(data), url });
  return response.body && JSON.parse(response.body);
}

async function getStarted() {
  try {
    currentSpace = await getCurrentSpace();
    let demoPage = await checkDemoPageExists();
    if(!demoPage) {
      demoPage = await createDemoPage();
    }

    AP.navigator.go('contentview', {contentId: demoPage.id});
  } catch (e) {
    trackEvent('error', 'getStarted', JSON.stringify(e));
  }
}

async function createPages(parentId, count) {
  try {
    currentSpace = await getCurrentSpace();
    for(let i = 0; i < count; i++) {
      await createDemoPage(`Test page - ${i} - ${new Date().toISOString()}`, parentId);
    }

    console.log(`${count} pages created under page ${parentId}`);
  } catch (e) {
    console.error('createPages error:', e)
  }
}