export function setUpWindowLocation(query: string) {
  delete window.location;
  // @ts-ignore
  window.location = new URL("https://zenuml.com/" + query);
}