export const onRequestGet: PagesFunction = async (params: any) => {
  const { searchParams } = new URL(params.request.url);
  const uuid = searchParams.get('uuid');
	return new Response(
		`<ac:image> <ri:attachment ri:filename="zenuml-${uuid}.png" /> </ac:image>`,
		{}
	);
};
