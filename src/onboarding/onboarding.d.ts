export {};
declare global {
  interface Window {
    isGoogleChrome: () => boolean;
    chrome: boolean;
    opr: boolean;
  }
}
