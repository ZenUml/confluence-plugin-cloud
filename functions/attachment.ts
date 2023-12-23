import {trackEvent} from "./utils/zaraz";

export const onRequestGet: PagesFunction = async (params: any) => {
  const {searchParams} = new URL(params.request.url);

  const uuid = searchParams.get('uuid') || '';
  const baseURL = searchParams.get('xdm_e') || '';
  const spaceName = searchParams.get('spaceKey') || '';
  const pageId = searchParams.get('pageId') || '';
  const appKey = searchParams.get('addonKey') || '';

  const hostName = baseURL ? new URL(baseURL).hostname : 'unknown_host';
  // @ts-ignore
  const subDomain = hostName.split('.')[0] || 'unknown_domain';

  try {
    await trackEvent({
      eventType: 'retrieve_attachment',
      event_label: uuid,
      confluence_page: pageId,
      confluence_space: spaceName,
      app_key: appKey,
      domain: subDomain
    });
  } catch (error) {
    console.error("Failed to track retrieve_attachment: ", error);
  }

  return new Response(
    `<ac:image ac:width="950"> <ri:attachment ri:filename="zenuml-${uuid}.png" /> </ac:image>`,
    {}
  );
};
