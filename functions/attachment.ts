import {trackEvent} from "./utils/zaraz";

export const onRequestGet: PagesFunction = async (params: any) => {
  const {searchParams} = new URL(params.request.url);

  const uuid = searchParams.get('uuid');
  const domain = searchParams.get('xdm_e');

  await trackEvent({
    eventType: 'download_attachment',
    domain
  });

  return new Response(
    `<ac:image ac:width="950"> <ri:attachment ri:filename="zenuml-${uuid}.png" /> </ac:image>`,
    {}
  );
};
