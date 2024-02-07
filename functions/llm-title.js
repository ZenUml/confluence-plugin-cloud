import { Ai } from "./vendor/@cloudflare/ai.js";

export default {
  async fetch(request, env) {
    const { dsl } = await request.json();
    const ai = new Ai(env.AI);
    const chat = {
      messages: [
        {
          role: "system",
          content:
            //`You will help the use to create a title for an UML diagram, the user will give a DSL that describing an UML, you should just give out one title describing the whole UML and enclose it with triple quotes. For example, if the DSL is 'class A {}', you should give out '"""A"""'.`,
            'You are an expert of ZenUML sequence diagram. Generate title for the given DSL. Only output the title, nothing else.',
        },
        { role: "user", content: dsl },
      ],
    };
    const result = await ai.run("@cf/meta/llama-2-7b-chat-int8", chat);
    console.log('AI response:', result)

    let response
    try {
      const matchResult = result.response.match(/[^"]+title[^"]+"([^"]+)"/si);
      let title = matchResult && matchResult[1];
      console.log('Extracted title:', title)
      
      if (title) {
        response = new Response(title, { status: 200 });
      } else {
        response = new Response("Something wrong, please try again", { status: 500 });
      }
    } catch (err) {
      console.log(err)
      response = new Response("Something wrong, please try again", { status: 500 });
    }

    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', '*')
    return response
  },
};
