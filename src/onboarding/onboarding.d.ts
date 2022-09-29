export {};
declare global {
  interface Window {
    isGoogleChrome: () => boolean;
    chrome: boolean;
    opr: boolean;
    version: () => string;
    postInstallPageKey: () => string;
    gtag: (type: string, event: string, params: any) => void;
  }
}
