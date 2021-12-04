import {IAp} from "@/model/IAp";

export class AtlasPage {
  private _requestFn?: (req: IApRequest) => any;
  constructor(public id: string, ap?: IAp) {
    console.log("Page.constructor", id);
    // Assigning _ap causes DOMException: Blocked a frame with origin "xxx" from accessing a cross-origin frame.
    // this._ap = ap;
    this._requestFn = ap?.request;
  }


  async macros(matcher: (e: AtlasDocElement) => boolean): Promise<AtlasDocElement[]> {
    if (!this._requestFn) {
      return [];
    }
    const response = await this._requestFn({
      url: `/rest/api/content/${this.id}?expand=body.atlas_doc_format&status=draft`,
      type: 'GET',
      contentType: 'application/json'
    });
    console.debug("Page.macros", response);
    if (!response || !response.body) {
      return [];
    }
    const {body: {atlas_doc_format: {value}}} = JSON.parse(response.body);
    const {content: contentList} = JSON.parse(value);
    console.debug("Page.macros", contentList);
    return contentList.filter(({type}: any) => type === AtlasDocElementType.Extension)
      .filter(matcher);
  }
  }
enum AtlasDocElementType {
  Extension = 'extension',
}

interface AtlasDocElement {
  type: AtlasDocElementType;
  attrs: {
    parameters: {
      macroParams: {
        customContentId?: string;
      }
    }
  };
}