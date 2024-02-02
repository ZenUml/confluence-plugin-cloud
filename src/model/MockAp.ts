import MockApConfluence from "@/model/MockApConfluence";
import {IAp} from "@/model/IAp";
import customContentListSeq from "@/model/Ap/MockedResponse/custom-content-list-sequence.json";
import customContentListGraph from "@/model/Ap/MockedResponse/custom-content-list-graph.json";
import customContentByIdV1DiagramSequence from "@/model/Ap/MockedResponse/custom-content-by-id-v1-diagram-sequence.json";
import customContentByIdV1DiagramMermaid from "@/model/Ap/MockedResponse/custom-content-by-id-v1-diagram-mermaid.json";

const CONTRACT: any = {
  customContent: {method: 'get', URL: /\/rest\/api\/content\/(\d+)/},
  customContentV2: {method: 'get', URL: /\/api\/v2\/custom-content\/(\d+)/},
  createCustomContentV2: { method: 'post', URL: /\/api\/v2\/custom-content/},
  updateCustomContentV2: { method: 'put', URL: /\/api\/v2\/custom-content\/(\d+)/},
  createCustomContent: { method: 'post', URL: /\/rest\/api\/content/}
};

const matchContract = (request: any, ...apis: Array<string>): any => {
  //find the first matched contract
  return apis.map(api => {
    const contract = CONTRACT[api];
    return contract && request.type.toLowerCase() === contract.method && request.url.match(contract.URL);
    }).find(r => r);
};

interface RequestHandler {
  match(request: any): boolean,
  handle(request: any): any
}

export default class MockAp implements IAp {
  public confluence: any
  public request: any = async (req: any) => {
    console.debug('req', req);
    if (!req) {
      return 'OK. (req is empty)'
    }

    // if request.url start with '/rest/api/content/fake-content-id', return mocked response
    if (req.url.startsWith('/api/v2/custom-content/fake-content-id-diagram-sequence')) {
      return {body: JSON.stringify(customContentByIdV1DiagramSequence)};
    }
    if (req.url.startsWith('/api/v2/custom-content/fake-content-id-diagram-mermaid')) {
      return {body: JSON.stringify(customContentByIdV1DiagramMermaid)};
    }

    // if request.url start with '/rest/api/content?', return {}
    if (req.url.startsWith('/rest/api/content?')) {
      console.log('req.url.startsWith(\'/rest/api/content?\')');
      // if request.url contains 'zenuml-content-graph', return {}
      if (req.url.includes('zenuml-content-graph')) {
        console.log('req.url.includes(\'zenuml-content-graph\')');
        return {body: JSON.stringify(customContentListGraph)};
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
  public context: any;

  private readonly contentId: any
  private requestHandlers: Array<RequestHandler> = []

  public CURRENT_SPACE = {id: 123, key: 'fake-space'};

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
          context: { contentId: this.contentId, spaceKey: 'fake-space' },
          href: 'http://localhost:8080/wiki/space/fake-space/pages/fake-page-id'
        }
      )
    };
    this.context = {
      getContext: (cb: any) => cb({
          confluence: { content: {id: this.contentId, type: 'page'}, space: this.CURRENT_SPACE }
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
      const result = matchContract(r, 'customContent', 'customContentV2');
      if(result && result.length > 1) {
        return result[1] == String(customContentId);
      }
    }, handle: r => ({body: JSON.stringify({body: {raw: {value: JSON.stringify(content)}}})})} as RequestHandler);
  }

  setupCreateCustomContent(content: any) {
    this.requestHandlers.push({
      match: r => matchContract(r, 'customContent', 'createCustomContentV2'),
      handle: r => ({body: JSON.stringify({id: content.id, body: {raw: {value: JSON.stringify(content)}}})})} as RequestHandler);
  }

  setupUpdateCustomContent(customContentId: string, content: any) {
    this.requestHandlers.push({
      match: r => {
        const result = matchContract(r, 'updateCustomContentV2');
        if(result && result.length > 1) {
          return result[1] == String(customContentId);
        }
      },
      handle: r => ({body: JSON.stringify({id: content.id, body: {raw: {value: JSON.stringify(content)}}})})} as RequestHandler);
  }

}
