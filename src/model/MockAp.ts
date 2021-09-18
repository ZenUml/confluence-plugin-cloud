import MockApConfluence from "@/model/MockApConfluence.ts";
import {IAp} from "@/model/IAp";

const CONTRACT: any = {
  customContent: {method: 'get', URL: /\/rest\/api\/content\/(\d+)/}
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
  public confluence: any
  public request: any
  public navigator: any
  public dialog: any;
  public user: any;

  private contentId: any
  private requestHandlers: Array<RequestHandler> = []

  constructor(_contentId: any = null) {
    this.confluence = new MockApConfluence();
    this.contentId = _contentId;
    this.navigator = {
      getLocation: (cb: any) => cb({
          context: { contentId: this.contentId }
        }
      )
    };
    this.request = jest.fn(request => {
      const handler = this.requestHandlers.find(h => h.match(request));
      if(handler) {
        return handler.handle(request);
      }
    });
  }

  setCustomContent(customContentId: any, content: any) {
    this.requestHandlers.push({match: r => {
      const result = matchContract(r, 'customContent');
      if(result && result.length > 1) {
        return result[1] == String(customContentId);
      }
    }, handle: r => ({body: JSON.stringify({body: {raw: {value: JSON.stringify(content)}}})})} as RequestHandler);
  }

}