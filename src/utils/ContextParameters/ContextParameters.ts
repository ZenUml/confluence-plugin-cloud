// https://developer.atlassian.com/cloud/confluence/context-parameters/
// xdm_e: the base URL of the host application, used for the JavaScript bridge (xdm - cross domain message)

export function getClientDomain() {
  return getSubdomain(getBaseUrl());
}

export function getBaseUrl() {
  return getUrlParam('xdm_e').toLowerCase();
}

export function getSpaceKey() {
  return getUrlParam('spaceKey');
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
