import global from "@/model/globals";
import { getUrlParam } from "./window";

export async function getAtlassianDomain(): Promise<string> {
  const pattern = /\/\/([a-z0-9-_]+)\.atlassian\.net/i;
  const x =
    getUrlParam("xdm_e") || (await global.apWrapper._getCurrentPageUrl());
  const url: any = x && decodeURIComponent(x);
  const result = pattern.exec(url);
  if (result && result.length > 1) {
    return result[1];
  }
  return "";
}
