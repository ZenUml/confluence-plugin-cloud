import { DiagramType } from "@/model/Diagram/Diagram";
import {
  getClientDomain,
  getSpaceKey,
} from "@/utils/ContextParameters/ContextParameters";
import mixpanel from "mixpanel-browser";

mixpanel.init("0c62cea9ed2247f4824bf196f6817941", {
  debug: true,
  track_pageview: true,
  persistence: "localStorage",
});

let identified = false;

export function getUrlParam(param: string): string | undefined {
  try {
    const matches = new RegExp(param + "=([^&]*)").exec(window.location.search);
    return (
      (matches && matches[1] && decodeURIComponent(matches[1])) || undefined
    );
  } catch (e) {
    return undefined;
  }
}

interface EventDetails {
  event_category: string;
  event_label: string;
  client_domain: string;
  user_account_id: string;
  confluence_space: string;
  [key: string]: string | number;
}

export function trackEvent(
  label: DiagramType | string | undefined,
  action: string,
  category: string,
  resetEventDetails = {}
) {
  try {
    if (!identified) {
      mixpanel.identify(getCurrentUserAccountId());
      identified = true;
    }
    let eventDetails = {
      event_category: category || "category_not_set",
      event_label: label || "label_not_set",
      ...resetEventDetails,
    } as EventDetails;
    // make sure event is still sent out even if there are errors in setting up the event details
    try {
      eventDetails = {
        ...eventDetails,
        client_domain: getClientDomain() || "unknown_atlassian_domain",
        user_account_id: getCurrentUserAccountId(),
        confluence_space: getSpaceKey() || "unknown_space",
      };
    } catch (e) {
      console.error(e);
    }

    try {
      // Track an event. It can be anything, but in this example, we're tracking a Sign Up event.
      mixpanel.track(action, eventDetails);
    } catch (e) {
      console.error("Error in calling mixpanel", e);
    }

    try {
      // @ts-ignore
      window.gtag && window.gtag("event", action, eventDetails);
    } catch (e) {
      console.log("Error in calling gtag", e);
    }

    r2Track(action, eventDetails);
  } catch (e) {
    console.error(
      "Error in trackingEvent. Please report to our helpdesk: https://zenuml.atlassian.net/servicedesk/customer/portals",
      e
    );
  }
}

function getCurrentUserAccountId(): string {
  return (
    // @ts-ignore
    window.globals?.apWrapper?.currentUser?.atlassianAccountId ||
    "unknown_user_account_id"
  );
}

export function addonKey() {
  return getUrlParam("addonKey") || "unknown_addon";
}

function version() {
  return getUrlParam("version") || "unknown_version";
}

function r2Track(action: string, eventDetails: any) {
  try {
    fetch("/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        Object.assign(
          {
            event_source: window.location.host,
            addon_key: addonKey(),
            version: version(),
            action,
          },
          eventDetails
        )
      ),
    });
  } catch (e) {
    console.log("Error in calling /track", e);
  }
}

export function getLocalStorageKey(key: string) {
  return `${key}-${getClientDomain()}`;
}

export function getLocalState(key: string, DEFAULT_STATE: any) {
  try {
    const localState = window.localStorage.getItem(getLocalStorageKey(key));
    return (localState && JSON.parse(localState)) || DEFAULT_STATE;
  } catch (e) {
    return DEFAULT_STATE;
  }
}

export function setLocalState(key: string, state: any) {
  window.localStorage.setItem(getLocalStorageKey(key), JSON.stringify(state));
}
