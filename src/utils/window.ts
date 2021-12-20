import {DiagramType} from "@/model/Diagram";

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
    // @ts-ignore
    window.gtag && window.gtag('event', action, {'event_category': category, 'event_label' : label});
  } catch (e) {
    console.error('Error in trackingEvent. Please report to our helpdesk:https://zenuml.atlassian.net/servicedesk/customer/portals')
  }
}