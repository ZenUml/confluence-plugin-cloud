//The following  environment variables need to be set on https://dash.cloudflare.com/xxxxxxx/pages/view/confluence-pulgin/settings/environment-variables :
//WHITE_LIST:	subDomain1,subDomain2 #if contains * ,will effect all domain.
function checkWhiteList(env: any, subDomain: string) {
  const whiteListNames: string[] = env.WHITE_LIST
    ? env.WHITE_LIST.split(",").map(name => name.trim().toLowerCase()).filter(name => name !== "")
    : [];
  if(whiteListNames.includes("*"))return true;
  return whiteListNames.includes(subDomain.toLowerCase());
}

export {
  checkWhiteList
};