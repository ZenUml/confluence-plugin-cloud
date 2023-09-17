// https://developer.atlassian.com/cloud/confluence/context-parameters/
// xdm_e: the base URL of the host application, used for the JavaScript bridge (xdm - cross domain message)

export function getClientDomain() {
  return getSubdomain(getBaseUrl());
}

export function getBaseUrl() {
  let url = getUrlParam('xdm_e');

  //@ts-ignore
  if(!url && window.initialContext?.currentPageUrl) {
    //@ts-ignore
    url = new URL(window.initialContext?.currentPageUrl).origin; //in macro editor
  }

  return url.toLowerCase();
}

export function getSpaceKey() {
  //@ts-ignore
  return getUrlParam('spaceKey') || window.initialContext?.currentSpace?.key;
}

export function getSubdomain(baseUrl: string) {
  const regexp = new RegExp('https://([a-z0-9-_]+).atlassian.net');
  const subdomainMatches = regexp.exec(baseUrl.toLowerCase());
  return subdomainMatches && subdomainMatches[1] || '';
}

export function getUrlParam (param: string): string {
  try {
    const query = window.location.search;
    const matches = (new RegExp(param + '=([^&]*)')).exec(query);
    return matches && matches[1] && decodeURIComponent(matches[1]) || '';
  } catch (e) {
    return ''
  }
}
