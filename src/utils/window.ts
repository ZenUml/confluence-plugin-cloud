import {DiagramType} from "@/model/Diagram/Diagram";
import {getBaseUrl, getClientDomain, getSpaceKey} from "@/utils/ContextParameters/ContextParameters";
import mixpanel from "mixpanel-browser";

mixpanel.init('0c62cea9ed2247f4824bf196f6817941', { debug: true, track_pageview: true, persistence: 'localStorage' });

let identified = false;

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
    if(!identified) {
      mixpanel.identify(getCurrentUserAccountId());
      identified = true;
    }
    let eventDetails = {
      'event_category': category || 'category_not_set',
      'event_label' : label || 'label_not_set',
    } as EventDetails;
    // make sure event is still sent out even if there are errors in setting up the event details
    try {
      eventDetails =  {
        ...eventDetails,
        'client_domain': getClientDomain() || 'unknown_atlassian_domain',
        'user_account_id': getCurrentUserAccountId(),
        'confluence_space': getSpaceKey() || 'unknown_space'
      };
    } catch (e) {
      console.error(e);
    }

    try {
      // Track an event. It can be anything, but in this example, we're tracking a Sign Up event.
      mixpanel.track(action, eventDetails);
    } catch (e) {
      console.error('Error in calling mixpanel', e);
    }

    try {
      // @ts-ignore
      window.gtag && window.gtag('event', action, eventDetails);
    } catch(e) {
      console.log('Error in calling gtag', e);
    }

    r2Track(action, eventDetails);
  } catch (e) {
    console.error('Error in trackingEvent. Please report to our helpdesk: https://zenuml.atlassian.net/servicedesk/customer/portals', e)
  }
}

function getCurrentUserAccountId(): string {
  // @ts-ignore
  return window.globals?.apWrapper?.currentUser?.atlassianAccountId || 'unknown_user_account_id';
}

function addonKey() {
  return getUrlParam('addonKey') || 'unknown_addon';
}

function version() {
  return getUrlParam('version') || 'unknown_version';
}

function r2Track(action: string, eventDetails: any) {
  try {
    fetch('/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.assign({event_source: window.location.host, addon_key: addonKey(), version: version(), action}, eventDetails))
    });
  } catch(e) {
    console.log('Error in calling /track', e)
  }
}
