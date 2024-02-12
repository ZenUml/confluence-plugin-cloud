export default function(body: { dsl: string; type?: string }){
  return fetch(
    "https://zenuml-portal.zenuml.workers.dev/ai-generate-title",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  )
}
