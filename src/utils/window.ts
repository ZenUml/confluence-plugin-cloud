import {DiagramType} from "@/model/Diagram";

export function getUrlParam (param: string): string | undefined {
  try {
    const matches = (new RegExp(param + '=([^&]*)')).exec(window.location.search);
    return matches && matches[1] && decodeURIComponent(matches[1]) || undefined;
  } catch (e) {
    return undefined
  }
}

export function trackEvent(label: DiagramType | string, event: string, category: string) {
    // @ts-ignore
  window.gtag && window.gtag('event', event, {'event_category': category, 'event_label' : label});
}