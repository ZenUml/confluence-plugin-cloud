import MockApConfluence from "@/model/MockApConfluence.ts";
import {IAp} from "@/model/IAp";
import {IConfluence} from "@/model/IConfluence";

const CONTRACT: any = {
  customContent: {method: 'get', URL: /\/rest\/api\/content\/(\d+)/},
  createCustomContent: { method: 'post', URL: /\/rest\/api\/content/}
};

const matchContract = (request: any, api: string): any => {
  const contract = CONTRACT[api];
  return contract && request.type.toLowerCase() === contract.method && request.url.match(contract.URL);
};

interface RequestHandler {
  match(request: any): boolean,
  handle(request: any): any
}

export default class MockAp implements IAp{
  public confluence: IConfluence
  public request: any
  public navigator: any
  public dialog: any;
  public user: any;

  public contentId: any
  private requestHandlers: Array<RequestHandler> = [];
  private requestResponseMap: any = {};
  constructor() {
    this.confluence = new MockApConfluence();
    this.navigator = {
      getLocation: (cb: any) => cb({
          context: { }
        }
      )
    };
    // @ts-ignore
    this.requestHandlers.push({match: r => {
        const result = matchContract(r, 'createCustomContent');
        return !!result;
      }, handle: r => ({body: JSON.stringify({id: 1234, body: {raw: {value: JSON.stringify('content')}}})})});
    this.request = (request: any) => {
      const handler = this.requestHandlers.find(h => h.match(request));
      if(handler) {
        return handler.handle(request);
      } else {
        return this.requestResponseMap[request.url];
      }
    };
  }

  setCustomContent(customContentId: any, content: any) {
    this.requestHandlers.push({match: r => {
      const result = matchContract(r, 'customContent');
      if(result && result.length > 1) {
        return result[1] == String(customContentId);
      }
    }, handle: r => ({body: JSON.stringify({body: {raw: {value: JSON.stringify(content)}}})})} as RequestHandler);
  }

  whenRequestThenRespond(url: string, response: object) {
    this.requestResponseMap[url] = response;
  }
}