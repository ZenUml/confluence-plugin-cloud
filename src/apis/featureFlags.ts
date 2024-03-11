import {getUrlParam, trackEvent} from "@/utils/window";
import Global from "@/model/globals/Global";
import { getPortalDomain } from "./portalDomain";

async function getAtlassianDomain(): Promise<string> {
  const pattern = /\/\/([a-z0-9-_]+)\.atlassian\.net/i;
  const x =
    getUrlParam("xdm_e") || (await Global.apWrapper._getCurrentPageUrl());
  const url: any = x && decodeURIComponent(x);
  const result = pattern.exec(url);
  if (result && result.length > 1) {
    return result[1];
  }
  return "";
}

export default async function (features: string[]) {
  try {
    const client = await getAtlassianDomain();
    const portal = getPortalDomain(); // Assuming getPortalDomain is async; if not, remove await.
    const response = await fetch(
      `${portal}/feature-flags?client=${client}&features=${features.join(",")}`
    );

    if (!response.ok) {
      // Log error or throw an exception
      console.error("HTTP Error:", response.status, response.statusText);
      trackEvent(response.statusText, 'get_feature_flags', 'error');
      return {};
    }

    const data = await response.json();
    console.debug("featureFlags", client, features, data);
    return data;
  } catch (error) {
    console.error("Fetching feature flags failed:", error);
    trackEvent(JSON.stringify(error), 'get_feature_flags', 'error');
    return {};
  }
}
