import AP from "@/model/AP";

function isGoogleChrome() {
  //https://stackoverflow.com/questions/4565112/javascript-how-to-find-out-if-the-user-browser-is-chrome/13348618#13348618
  const isChromium = window.chrome;
  const winNav = window.navigator;
  const vendorName = winNav.vendor;
  const isOpera = typeof window.opr !== "undefined";
  const isIEedge = winNav.userAgent.indexOf("Edg") > -1;
  const isIOSChrome = winNav.userAgent.match("CriOS");

  if (isIOSChrome) {
    return false;
  }
  return isChromium !== null && typeof isChromium !== "undefined" && vendorName === "Google Inc." && !isOpera && !isIEedge;
}
console.log('Hello, Setup isGoogleChrome!', AP);

window.isGoogleChrome = isGoogleChrome;
