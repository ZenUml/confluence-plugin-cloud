import MockApConfluence from "@/model/MockApConfluence";
import {IAp} from "@/model/IAp";
import customContentListSeq from "@/model/Ap/MockedResponse/custom-content-list-sequence.json";
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

export default class MockAp implements IAp {
  public confluence: any
  public request: any = async (req: any) => {
    console.log('req', req);
    if (!req) {
      return 'OK. (req is empty)'
    }

    // if request.url start with '/rest/api/content?', return {}
    if (req.url.startsWith('/rest/api/content?')) {
      console.log('req.url.startsWith(\'/rest/api/content?\')');
      // if request.url contains 'zenuml-content-graph', return {}
      if (req.url.includes('zenuml-content-graph')) {
        console.log('req.url.includes(\'zenuml-content-graph\')');
        return customContentListSeq;
      }

      if (req.url.includes('zenuml-content-sequence')) {
        console.log('req.url.includes(\'zenuml-content-sequence\')', customContentListSeq);
        return {body: JSON.stringify(customContentListSeq)};
      }


      return {body: JSON.stringify({id: 1234, body: {raw: {value: JSON.stringify('content')}}})};
    }

    const handler = this.requestHandlers.find(h => h.match(req));
    if(handler) {
      return handler.handle(req);
    }
  }
  public navigator: any
  public dialog: any;
  public user: any;

  private readonly contentId: any
  private requestHandlers: Array<RequestHandler> = []

  constructor(pageId: any = null) {
    this.user = {
      getCurrentUser: function (cb: any) {
        cb({
          atlassianAccountId: 'fake:user-account-id',
        })
      }
    }
    this.confluence = new MockApConfluence();
    this.navigator = {
      getLocation: (_: any) => {}
    }
    this.contentId = pageId;
    this.navigator = {
      getLocation: (cb: any) => cb({
          context: { contentId: this.contentId, spaceKey: 'fake-space' }
        }
      )
    };
    // @ts-ignore
    this.requestHandlers.push({match: r => {
        const result = matchContract(r, 'createCustomContent');
        return !!result;
      }, handle: r => ({body: JSON.stringify({id: 1234, body: {raw: {value: JSON.stringify('content')}}})})});
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