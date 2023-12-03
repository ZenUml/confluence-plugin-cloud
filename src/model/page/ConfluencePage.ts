import {IAp} from "@/model/IAp";
import {AtlasDocFormat, AtlasDocElement} from "@/model/page/AtlasDocFormat";
import {trackEvent} from "@/utils/window";

export class ConfluencePage {
  _requestFn?: (req: IApRequest) => any;
  private readonly _pageId: string;
  
  constructor(pageId: string, ap?: IAp) {
    this._requestFn = ap?.request;
    this._pageId = pageId;
  }

  getPageId() {
    return this._pageId;
  }

  // This API may return stale data. The most recent macro may not be returned.
  // This is caused by the REST API we are calling.
  // It seems reliable enough for us to use, as we only need to know the macros
  // when we edit the newly added macro.
  async macroByCustomContentId(customContentId: string): Promise<AtlasDocElement | undefined> {
    if (!this._requestFn) {
      return;
    }
    let responseStatus = '';
    let responseBody = '';
    try {
      const pageId = this._pageId;
      if(!pageId) {
        return;
      }

      const response = await this._requestFn({
        url: `/rest/api/content/${pageId}?expand=body.atlas_doc_format`,
        type: 'GET',
        contentType: 'application/json'
      });
      responseStatus = response?.xhr?.status || '';
      if (!response || !response.body) {
        return;
      }

      responseBody = response.body;
      const {body: {atlas_doc_format: {value}}} = JSON.parse(response.body);
      const doc = new AtlasDocFormat(value);
      const macros = doc.getMacros();

      return macros.find(m => m.attrs.parameters.macroParams.customContentId?.value === customContentId);
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
    }
  }

}