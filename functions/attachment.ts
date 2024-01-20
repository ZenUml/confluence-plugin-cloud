import {trackEvent} from "./utils/zaraz";
import {Env} from "./utils/KVEnv";
import {checkWhiteList} from "./utils/white-list";
import { isLite } from './descriptor.js';
export const onRequestGet: PagesFunction<Env> = async (params: any) => {
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

  // try {
  //   const WHITE_LIST_PDF = await params.env.FEATURES.get("WHITE_LIST_PDF");
  //   console.log("kv WHITE_LIST_PDF",WHITE_LIST_PDF);
  // } catch (error) {
  //   console.error("fail kv WHITE_LIST_PDF", error);
  // }
 
  const upgradeDesc = (isLite(appKey) && await checkWhiteList(params.env.FEATURES,"WHITE_LIST_PDF",subDomain)) ? `<p style="color:#97a0af;font-style:italic;">Elevate your ZenUML experience by upgrading to our Paid Version. For detailed instructions and benefits, visit https://zenuml.com/upgrade.</p>` : "";
  return new Response(
    `${upgradeDesc}<ac:image ac:width="950"> <ri:attachment ri:filename="zenuml-${uuid}.png" /> </ac:image>`,
    {}
  );
};
