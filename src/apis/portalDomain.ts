export function getPortalDomain() {
  return ["conf-full.zenuml.com", "conf-lite.zenuml.com"].includes(
    window.location.host
  )
    ? "https://portal.zenuml.com"
    : "https://portal-stg.zenuml.com";
}
