//The following two environment variables need to be set on https://dash.cloudflare.com/xxxxxxx/pages/view/confluence-pulgin/settings/environment-variables :
//1: WHITE_LIST_ENABLED:true  #When not enabled, it will affect all subdomains.
//2: WHITE_LIST_NAMES:	subDomain1,subDomain2
function checkWhiteList(env: any, subDomain: string) {
  console.log("checkWhiteList env",subDomain,env.WHITE_LIST_ENABLED,env.WHITE_LIST_NAMES)
  const whiteListEnabled: boolean = env.WHITE_LIST_ENABLED === 'true';
  if (!whiteListEnabled) return true;
  const whiteListNames: string[] = env.WHITE_LIST_NAMES ? env.WHITE_LIST_NAMES.split(",").map(name => name.trim().toLowerCase()) : [];
  const result= whiteListNames.includes(subDomain.toLowerCase());
  console.log("checkWhiteList result",result,whiteListNames);
  return result;
}

export {
  checkWhiteList
};