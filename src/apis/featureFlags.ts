import { getUrlParam } from "@/utils/window";
import Global from "@/model/globals/Global";
import { getPortalDomain } from "./portalDomain";

export const FEATURES = ["AI_TITLE"];

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
  const client = await getAtlassianDomain();
  const portal = getPortalDomain();
  return fetch(
    `${portal}/feature-flags?client=${client}&features=${features.join(",")}`
  ).then((res) => res.json());
}
