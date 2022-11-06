import {IAp} from "@/model/IAp";
import {ILocationContext} from "@/model/ILocationContext";
import {AtlasDocFormat, AtlasDocElement, MacroParams} from "@/model/page/AtlasDocFormat";
import {trackEvent} from "@/utils/window";

export class AtlasPage {
  _requestFn?: (req: IApRequest) => any;
  private _locationContext?: ILocationContext;
  private readonly _navigator: any;
  constructor(ap?: IAp) {
    // TODO: why? Assigning _ap causes DOMException:
    // Blocked a frame with origin "xxx" from accessing a cross-origin frame.
    // this._ap = ap;
    this._requestFn = ap?.request;
    this._navigator = ap?.navigator;
  }

  // This method cannot be private or protected because it needs to be overwritten in test.
  async _getLocationContext(): Promise<ILocationContext> {
    if(this._locationContext) {
      return this._locationContext;
    }

    const self = this;
    return new Promise((resolve) => {
      self._navigator.getLocation((data: any) => {
        self._locationContext = Object.assign({}, data.context, {href: data.href}, {target: data.target}) as ILocationContext;
        resolve(self._locationContext);
      });
    });
  }

  async getPageId() {
    return (await this._getLocationContext()).contentId;
  }

  async getSpaceKey() {
    return (await this._getLocationContext()).spaceKey;
  }

  async getContentType() {
    return (await this._getLocationContext()).contentType;
  }

  async getHref() {
    return (await this._getLocationContext()).href;
  }

  async getLocationTarget() {
    return (await this._getLocationContext()).target;
  }

  // This API may return stale data. The most recent macro may not be returned.
  // This is caused by the REST API we are calling.
  // It seems reliable enough for us to use, as we only need to know the macros
  // when we edit the newly added macro.
  private async macros(): Promise<AtlasDocElement[]> {
    if (!this._requestFn) {
      return [];
    }
    let responseStatus = '';
    let responseBody = '';
    try {
      const pageId = await this.getPageId();
      const response = await this._requestFn({
        url: `/rest/api/content/${pageId}?expand=body.atlas_doc_format&status=draft`,
        type: 'GET',
        contentType: 'application/json'
      });
      responseStatus = response?.xhr?.status || '';
      if (!response || !response.body) {
        return [];
      }
      responseBody = response.body;
      const {body: {atlas_doc_format: {value}}} = JSON.parse(response.body);
      const doc = new AtlasDocFormat(value);
      return doc.getMacros();
    } catch (e: any) {
      trackEvent(responseStatus, 'query_macro_atlas_doc_format', 'warning');
      trackEvent(e.message, 'query_macro_atlas_doc_format', 'warning');
      console.trace('Failed to query all macros on the page. Assume there is no macros on this page.')
      console.error('This message will be very helpful for the vendor to improve their product.');
      console.error('Please consider sharing it with the vendor so that they can fix the issue.');
      console.error('Please remove all sensitive data before sharing.');
      console.error('==========');
      console.error(responseBody);
      console.error('==========');
      return [];
    }
  }

  async countMacros(matcher: (mps: MacroParams) => boolean) {
    return (await this.macros())
      .map(c => c.attrs.parameters.macroParams)
      .filter(matcher)
      .length;
  }
}