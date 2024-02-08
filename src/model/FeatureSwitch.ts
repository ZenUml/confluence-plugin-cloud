import { getUrlParam } from "@/utils/window";
import Global from "./globals/Global";

async function getAtlassianDomain(): Promise<string> {
  const pattern = /\/\/([a-z0-9-_]+)\.atlassian\.net/i;
  const xdme = getUrlParam('xdm_e') || (await Global.apWrapper._getCurrentPageUrl());
  const url: any = xdme && decodeURIComponent(xdme);
  const result = pattern.exec(url);
  if(result && result.length > 1) {
    return result[1];
  }
  return '';
}

const AI_TITLE_ENABLED_DOMAINS = ['whimet4', 'zenuml-stg', 'zenuml', 'dyon'];

export default {
  isAiTitleEnabled: async () => AI_TITLE_ENABLED_DOMAINS.includes(await getAtlassianDomain())
};
