import {setUpWindowLocation} from "../../../tests/SetUpWindowLocation";
import {getClientDomain, getSpaceKey, getSubdomain} from "@/utils/ContextParameters/ContextParameters";

describe('ContextParameters', () => {
  it.each([
    ['https://a.atlassian.net', 'a'],
    ['https://a1.atlassian.net', 'a1'],
    ['https://a_.atlassian.net', 'a_'],
    ['https://a-b.atlassian.net', 'a-b'],
    ['https://A.atlassian.net', 'a'],
    ['https://1024.atlassian.net', '1024'],
    ['https://1024.atlassian.ne', ''],
  ])('base url [%s] => subdomain [%s]', (baseUrl: string, subdomain: string) => {
    expect(getSubdomain(baseUrl)).toBe(subdomain)
  })

  it('should return client domain', () => {
    const query = '?version=2022.07&spaceKey=ZS&pageId=121504351&pageVersion=17&macroId=c43e14c1-6db6-41b2-9f04-ad6065acf4ba&uuid=41af36e0-925f-42bc-9f07-4c73980cc39c&outputType=display&addonKey=com.zenuml.confluence-addon&contentKey=zenuml-content-graph&xdm_e=https%3A%2F%2Fzenuml-stg.atlassian.net&xdm_c=channel-com.zenuml.confluence-addon__zenuml-graph-macro8557314653811711875&cp=%2Fwiki&xdm_deprecated_addon_key_do_not_use=com.zenuml.confluence-addon&lic=none&cv=1000.0.0-19ac9bc0de8a';
    setUpWindowLocation(query);
    expect(getClientDomain()).toBe('zenuml-stg');
    expect(getSpaceKey()).toBe('ZS')
  })
})

