import {getDescriptor} from "./descriptor-dependencies/DescriptorUtil.ts";

export const onRequestGet = async (params) => {
  const data = getDescriptor(params);

  return new Response(
    JSON.stringify(data),
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
};
