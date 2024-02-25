import { getPortalDomain } from "./portalDomain";

export default async function (body: { dsl: string; type?: string }) {
  return fetch(`${await getPortalDomain()}/ai-generate-title`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}
