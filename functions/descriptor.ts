import cloudflareNs, {getDescriptor} from "./descriptor-dependencies/DescriptorUtil";
import Parameters = cloudflareNs.Parameters;

export const onRequestGet = async (params: Parameters) => {
  const originalHost = params.request.headers.get('x-forwarded-host');
  const originalUrl = params.request.url;
  const data = getDescriptor(originalHost, originalUrl);

  return new Response(
    JSON.stringify(data),
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
};
