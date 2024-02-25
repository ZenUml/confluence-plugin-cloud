import { getAtlassianDomain } from "@/utils/user";

let domain = "";
export async function getPortalDomain() {
  if (!domain) {
    domain =
      (await getAtlassianDomain()) === "zenuml-stg"
        ? "https://portal-stg.zenuml.com"
        : "https://portal.zenuml.com";
  }
  return domain;
}
