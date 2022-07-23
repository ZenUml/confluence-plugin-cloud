export function setUpWindowLocation(query: string, origin?: string) {
  // @ts-ignore
  delete window.location;
  // @ts-ignore
  window.location = new URL(origin || "https://zenuml.com/" + query);
}