import {getUrlParam} from "@/utils/window";
import {
  demoGraphContent,
  demoGraphTitle,
  demoMermaidContent,
  demoMermaidTitle,
  demoOpenAPIContent,
  demoOpenAPITitle, demoPageContent,
  demoPageTitle,
  demoSequenceContent,
  demoSequenceTitle
} from "./demo/resources"
import AP from "@/model/AP";

function isGoogleChrome() {
  //https://stackoverflow.com/questions/4565112/javascript-how-to-find-out-if-the-user-browser-is-chrome/13348618#13348618
  const isChromium = window.chrome;
  const winNav = window.navigator;
  const vendorName = winNav.vendor;
  const isOpera = typeof window.opr !== "undefined";
  const isIEedge = winNav.userAgent.indexOf("Edg") > -1;
  const isIOSChrome = winNav.userAgent.match("CriOS");

  if (isIOSChrome) {
    return false;
  }
  return isChromium !== null && typeof isChromium !== "undefined" && vendorName === "Google Inc." && !isOpera && !isIEedge;
}

const version = () => getUrlParam('version') || '';
const postInstallPageKey = () => getUrlParam('postInstallPageKey') || '';

function addonKey() {
  return getUrlParam('addonKey');
}


const STORAGE_KEY = 'onboardingState';
const STORAGE_KEY_DEMO_PAGE = 'ZenUMLDemoPagePopupState';
const DEFAULT_STATE = {users: {}, lastUpdated: new Date()};
const HELP_DESK_URL = 'https://zenuml.atlassian.net/servicedesk/customer/portals';

const url = () => `/rest/atlassian-connect/1/addons/${addonKey()}/properties/${STORAGE_KEY}`;

// @ts-ignore
var flag, userId = '', clientDomain = '', currentSpace: unknown = '';

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
  if(!isGoogleChrome()) {
    return;
  }

  try {
    try {
      currentSpace = await getCurrentSpace();
    } catch (e: any) {
      currentSpace = 'unknown_space';
      console.log('Error getting current space', e);
      trackEvent('error', 'getCurrentSpace', e.message);
    }

    const localState = getLocalState(STORAGE_KEY);
    const remoteState = await getAppProperty();

    const demoPagePopupState = getLocalState(STORAGE_KEY_DEMO_PAGE);
    const demoPageExists = await checkDemoPageExists();

    const isOnboarded = (u: any, state: any) => {
      const ver = version();
      const userState = state.users[u.atlassianAccountId];
      return userState
        && userState[ver]
        && (!userState[ver].expires || (new Date() < new Date(userState[ver].expires)));
    };

    const expiresOf = (u: any, state:any) => state.users[u.atlassianAccountId][version()].expires;

    const checkUser = (u: any) => {
      userId = u.atlassianAccountId;

      const localOnboarded = isOnboarded(u, localState);
      const remoteOnboarded = isOnboarded(u, remoteState);

      if(!localOnboarded && !remoteOnboarded) {
        popup();

        setOnboardedForOneYear();

        trackEvent(userId, 'display', 'onboarding');
      }
      else if(!localOnboarded) {
        setOnboardedLocalState(u, expiresOf(u, remoteState));

        trackEvent(userId, 'copy_remote_onboarded_state_to_local', 'onboarding');
      }

      if(!demoPageExists && !demoPagePopupState?.displayed) {
        demoPagePopup();
        setLocalState(STORAGE_KEY_DEMO_PAGE, {displayed: true, created: new Date()});
      }
    }

    AP.user.getCurrentUser(checkUser);

    AP.events.on('flag.action', async function (e: any) {
      try {
        // @ts-ignore
        flag && flag.close();

        if (e.actionIdentifier === 'seeHowItWorks') {
          trackEvent(userId, 'see_how_it_works', 'onboarding');

          AP.user.getCurrentUser((u: any) => {
            setOnboarded(u).then(gotoOnboardingPage);
          });

        } else if (e.actionIdentifier === 'noThanks') {
          trackEvent(userId, 'no_thanks', 'onboarding');

          setOnboardedForOneYear();
        } else if (e.actionIdentifier === 'demoPage.yes') {
          trackEvent(userId, 'yes', 'demoPage');

          try {
            const page = await createDemoPage();
            AP.navigator.go('contentview', {contentId: page.id});
          } catch (e) {
            reportDemoPageError(e, 'createDemoPage');
          }
        } else if (e.actionIdentifier === 'demoPage.no') {
          trackEvent(userId, 'no', 'demoPage');
        }

      } catch (e) {
        reportError(e, 'onFlagAction');
      }
    })

  } catch(e) {
    reportError(e, 'init');
  }
}

function setOnboardedForOneYear() {
  AP.user.getCurrentUser((u: any) => setOnboarded(u, getOneYearLater()));
}

function setOnboarded(user: any, expires: any = null) {
  try {
    setOnboardedLocalState(user, expires);
    return Promise.resolve();
  } catch(e: any) {
    reportError(e, 'setOnboardedLocalState');

    return setOnboardedRemoteState(user, expires);
  }
}

function setOnboardedLocalState(user: any, expires: any) {
  setLocalState(STORAGE_KEY, getOnboardedState(getLocalState(STORAGE_KEY), user, expires));
}

function setOnboardedRemoteState(user: any, expires: any) {
  return getAppProperty().then(s => setAppProperty(getOnboardedState(s, user, expires)));
}

function getOnboardedState(state: any, user: any, expires: any) {
  const lastUpdated = new Date();
  const newState = clone(state);
  newState.users[user.atlassianAccountId] = {[version()]: {lastUpdated, expires}};
  newState.lastUpdated = lastUpdated;
  return newState;
}

function gotoOnboardingPage() {
  AP.navigator.go('addonModule', {addonKey: addonKey(), moduleKey: postInstallPageKey()});
}

function getLocalState(key: any) {
  try {
    const localState = window.localStorage.getItem(getLocalStorageKey(key));
    return localState && JSON.parse(localState) || DEFAULT_STATE;
  } catch(e) {
    return DEFAULT_STATE;
  }
}

function setLocalState(key: any, state: any) {
  window.localStorage.setItem(getLocalStorageKey(key), JSON.stringify(state));
}

function getLocalStorageKey(key: any) {
  return `${key || STORAGE_KEY}-${getClientDomain()}`;
}

async function getAppProperty() {
  try {
    const data = JSON.parse((await AP.request({url: url(), type: 'GET'})).body);
    return data && data.value;
  } catch(e: any) {
    if(!(e && e.xhr && e.xhr.status === 404)) { //not initial state that app property doesn't exist
      reportError(e, 'getAppProperty');
    }
    return DEFAULT_STATE;
  }
}

async function setAppProperty(data: any) {
  try {
    await AP.request({url: url(), type: 'PUT', contentType: 'application/json', data: JSON.stringify(data)});
  } catch(e: any) {
    const label = e?.xhr?.responseText || '';
    trackEvent(label, 'set_app_property_error', 'onboarding');
    reportError(e, 'setAppProperty', true);
  }
}

function trackEvent(label: any, action: any, category: any) {
  try {
    const eventDetails = {
      'event_category': category,
      'event_label' : label,
      'client_domain': getClientDomain(),
      'user_account_id': userId,
      'confluence_space': currentSpace
    };
    window.gtag && window.gtag('event', action, eventDetails);
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

function clone(o: any) {
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
  const url = (xdme && decodeURIComponent(xdme)) || '';
  const result = pattern.exec(url);
  if(result && result.length > 1) {
    return result[1];
  }
  return '';
}

function getCurrentSpace() {
  return new Promise(resolv =>
    AP.navigator.getLocation((l: any) => resolv(l?.context?.spaceKey)));
}

function reportError(error: any, context: any, skipEvent: any = false) {
  if(!skipEvent) {
    trackEvent(`${context} error: ${error && JSON.stringify(error)}`, 'unexpected_error', 'onboarding');
  }

  console.error(`Error in ${context}. Please report to our helpdesk: ${HELP_DESK_URL}`, error);
}

function reportDemoPageError(error: any, context: any) {
  trackEvent(`${context} error: ${error && JSON.stringify(error)}`, 'unexpected_error', 'demoPage');
  console.error(`Error in ${context}. Please report to our helpdesk: ${HELP_DESK_URL}`, error);
}


async function checkDemoPageExists() {
  const url = `/rest/api/content/search?cql=(title="${demoPageTitle}" and space="${currentSpace}")`;
  const response = await AP.request({type: 'GET', contentType: 'application/json', url});
  return JSON.parse(response.body)?.size > 0;
}

async function createCustomContent(title: any, body: any, containerPageId: any) {
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

async function deleteDemoPageDraft(page: any) {
  //We can't use "Delete content" API as it requires Connect app scope: DELETE
  const demoPageDraft =await updateContent(page.id, Object.assign({}, page, {status: 'trashed'}));
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

async function createContent(data: any) {
  const url = `/rest/api/content`;
  const response = await AP.request({type: 'POST', contentType: 'application/json', data: JSON.stringify(data), url});
  return response.body && JSON.parse(response.body);
}

async function updateContent(id: any, data: any) {
  const url = `/rest/api/content/${id}`;
  const response = await AP.request({type: 'PUT', contentType: 'application/json', data: JSON.stringify(data), url});
  return response.body && JSON.parse(response.body);
}

// add listener to window for load event
window.addEventListener('load', async () => {
  console.log('ZenUML Onboarding: window load event');
  await init()
});
console.log('Hello from ZenUML');
window.isGoogleChrome = isGoogleChrome;
window.version = version;
window.postInstallPageKey = postInstallPageKey;
