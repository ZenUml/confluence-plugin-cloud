import {DiagramType} from "@/model/Diagram/Diagram";
import {getClientDomain, getSpaceKey} from "@/utils/ContextParameters/ContextParameters";
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
        'client_domain': getClientDomain() || 'unknown_atlassian_domain',
        'user_account_id': getCurrentUserAccountId(),
        'confluence_space': getSpaceKey() || 'unknown_space'
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

function getCurrentUserAccountId(): string {
  // @ts-ignore
  return window.macro?._apWrapper?.currentUser?.atlassianAccountId || 'unknown_user_account_id';
}
