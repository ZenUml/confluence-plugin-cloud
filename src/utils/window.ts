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

interface EventDetails {
  event_category: string
  event_label: string
  client_domain: string
  user_account_id: string
  confluence_space: string
}

export function trackEvent(label: DiagramType | string, action: string, category: string) {
  try {
    let eventDetails = {
      'event_category': category || 'category_not_set',
      'event_label' : label || 'label_not_set',
    } as EventDetails;
    // make sure event is still sent out even if there are errors in setting up the event details
    try {
      eventDetails =  {
        ...eventDetails,
        'client_domain': getClientDomain(),
        'user_account_id': getCurrentUserAccountId(),
        'confluence_space': getCurrentSpace()
      };
    } catch (e) {
      console.error(e);
    }
    // @ts-ignore
    window.gtag && window.gtag('event', action, eventDetails);
  } catch (e) {
    console.error('Error in trackingEvent. Please report to our helpdesk: https://zenuml.atlassian.net/servicedesk/customer/portals')
  }
}

// Never throw
function getClientDomain(): string {
  try {
    return clientDomain || _getAtlassianDomain() || 'unknown_atlassian_domain';
  } catch (e) {
    return 'unknown_atlassian_domain'
  }
}

function _getAtlassianDomain(): string {
  const pattern = /\/\/([a-z0-9-_]+)\.atlassian\.net/i;
  const xdme = getUrlParam('xdm_e');
  const url = xdme && decodeURIComponent(xdme) || '';
  const result = pattern.exec(url);
  if(result && result.length > 1) {
    return result[1];
  }
  return 'unknown_atlassian_domain';
}

function getCurrentUserAccountId(): string {
  // @ts-ignore
  return window.macro?._apWrapper?.currentUser?.atlassianAccountId || 'unknown_user_account_id';
}

function getCurrentSpace(): string {
  // @ts-ignore
  return window.macro?._apWrapper?.currentSpace || 'unknown_space';
}