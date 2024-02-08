import { Ai } from "./vendor/@cloudflare/ai.js";

const strategies = [
  async (ai, dsl, type) => {
    const chat = {
      messages: [
        {
          role: "system",
          content: `You will help the user to create a title for an ${
            type || "UML"
          } diagram, the user will give a DSL that describing an ${
            type || "UML"
          } diagram, you should just give out one title describing the whole UML and enclose it with triple quotes. For example, if the DSL is 'class A {}', you should give out '"""A"""'.`,
        },
        { role: "user", content: dsl },
      ],
    };
    const result = await ai.run("@cf/meta/llama-2-7b-chat-int8", chat);
    console.log("AI response:", result);

    try {
      const matchResult = result.response.match(/"""(.*)"""/is);
      const title = matchResult && matchResult[1];
      console.log("Extracted title:", title);

      if (title) {
        return title;
      } else {
        throw new Error("Failed to extract title");
      }
    } catch (err) {
      console.log(err);
      throw new Error("Failed to generate");
    }
  },
  async (ai, dsl) => {
    const chat = {
      messages: [
        {
          role: "system",
          content:
            //`You will help the use to create a title for an UML diagram, the user will give a DSL that describing an UML, you should just give out one title describing the whole UML and enclose it with triple quotes. For example, if the DSL is 'class A {}', you should give out '"""A"""'.`,
            "You are an expert of ZenUML sequence diagram. Generate title for the given DSL. Only output the title, nothing else.",
        },
        { role: "user", content: dsl },
      ],
    };
    const result = await ai.run("@cf/meta/llama-2-7b-chat-int8", chat);
    console.log("AI response:", result);

    try {
      const matchResult = result.response.match(/[^"]+title[^"]+"([^"]+)"/is);
      const title = matchResult && matchResult[1];
      console.log("Extracted title:", title);

      if (title) {
        return title;
      } else {
        throw new Error("Failed to extract title");
      }
    } catch (err) {
      console.log(err);
      throw new Error("Failed to generate");
    }
  },
];

export default {
  async fetch(request, env) {
    const { dsl, type } = await request.json();
    const ai = new Ai(env.AI);

    let title = "";
    for (let i = 0; i < strategies.length; i++) {
      const result = await strategies[i](ai, dsl, type).catch(() => {});
      if (result) {
        title = result;
        break;
      }
    }

    let response;
    if (title && dsl !== "getError") {
      response = new Response(title, { status: 200 });
    } else {
      response = new Response("Failed to generate title", { status: 500 });
    }

    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "*");
    return response;
  },
};
