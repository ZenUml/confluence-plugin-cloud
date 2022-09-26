declare module cloudflareNs {
  export interface Parameters {
    request: Request;
  }

  export interface Request {
    headers: Headers;
    url:     string;
  }

  export interface Headers {
    get: (header: string) => string;
  }
}
export default cloudflareNs;
