export function getPortalDomain() {
  return ["conf-full.zenuml.com", "conf-lite.zenuml.com"].includes(
    window.location.host
  )
    ? "https://portal-stg.zenuml.com"
    : "https://portal.zenuml.com";
}
