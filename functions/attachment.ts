import {trackEvent} from "./utils/zaraz";
import {checkWhiteList} from "./utils/white-list";
import { isLite } from './descriptor.js';
export const onRequestGet: PagesFunction = async (params: any) => {
  const {searchParams} = new URL(params.request.url);
 
  const uuid = searchParams.get('uuid') || '';
  const baseURL = searchParams.get('xdm_e') || '';
  const spaceName = searchParams.get('spaceKey') || '';
  const pageId = searchParams.get('pageId') || '';
  const appKey = searchParams.get('addonKey') || '';

  const hostName = baseURL ? new URL(baseURL).hostname : '';
  // @ts-ignore
  const subDomain = hostName.split('.')[0] || 'unknown_domain';

  try {
    await trackEvent({
      eventType: 'retrieve_attachment',
      event_label: uuid,
      confluence_page: pageId,
      confluence_space: spaceName,
      app_key: appKey,
      client_domain: subDomain
    });
  } catch (error) {
    console.error("Failed to track retrieve_attachment: ", error);
  }

  const upgradeDesc = (isLite(appKey) && checkWhiteList(params.env,subDomain)) ? `<p style="color:#97a0af;font-style:italic;">Elevate your ZenUML experience by upgrading to our Paid Version. For detailed instructions and benefits, visit https://zenuml.com/upgrade.</p>` : "";
  return new Response(
    `${upgradeDesc}<ac:image ac:width="950"> <ri:attachment ri:filename="zenuml-${uuid}.png" /> </ac:image>`,
    {}
  );
};
