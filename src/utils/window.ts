import {DiagramType} from "@/model/Diagram";
let clientDomain = '';

export function getUrlParam (param: string): string | undefined {
  try {
    const matches = (new RegExp(param + '=([^&]*)')).exec(window.location.search);
    return matches && matches[1] && decodeURIComponent(matches[1]) || undefined;
  } catch (e) {
    return undefined
  }
}

export function trackEvent(label: DiagramType | string, action: string, category: string) {
  try {
    const eventDetails = {
      'event_category': category, 
      'event_label' : label,
      'client_domain': getClientDomain(),
      'user_account_id': getCurrentUserAccountId(),
      'confluence_space': getCurrentSpace()
    };

    // @ts-ignore
    window.gtag && window.gtag('event', action, eventDetails);
  } catch (e) {
    console.error('Error in trackingEvent. Please report to our helpdesk: https://zenuml.atlassian.net/servicedesk/customer/portals')
  }
}

function getClientDomain(): string {
  return clientDomain || getAtlassianDomain();
}

function getAtlassianDomain(): string {
  const pattern = /\/\/([a-z0-9-_]+)\.atlassian\.net/i;
  const xdme = getUrlParam('xdm_e');
  const url = xdme && decodeURIComponent(xdme) || '';
  const result = pattern.exec(url);
  if(result && result.length > 1) {
    return result[1];
  }
  return '';
}

function getCurrentUserAccountId(): string {
  // @ts-ignore
  return window.macro?._apWrapper?.currentUser?.atlassianAccountId || '';
}

function getCurrentSpace(): string {
  // @ts-ignore
  return window.macro?._apWrapper?.currentSpace || '';
}