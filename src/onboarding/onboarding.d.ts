export {};
declare global {
  interface Window {
    isGoogleChrome: () => boolean;
    chrome: boolean;
    opr: boolean;
    version: () => string;
    postInstallPageKey: () => string;
  }
}
