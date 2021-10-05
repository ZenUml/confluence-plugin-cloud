import {IConfluence} from "@/model/IConfluence";
import {ICallback} from "@/model/ICallback";
import {ContentProperty} from "@/model/ContentProperty";

export default class MockApConfluence implements IConfluence{
  private macroParams: any
  private macroBody: any
  public key: any
  private contentProperty?: ContentProperty

  saveMacro(params: any, body: any) {
    this.macroParams = params
    this.macroBody = body
  }

  getMacroData(cb: (arg0: any) => void) {
    cb(this.macroParams)
  }

  getMacroBody(cb: (arg0: any) => void) {
    cb(this.macroBody)
  }

  setContentProperty(content: ContentProperty, callback: ICallback) {
    this.key = content.key
    this.contentProperty = content
    callback && callback(content)
  }

  getContentProperty(key: any, cb: (arg0: ContentProperty | undefined) => void) {
    if (this.key !== key) {
      console.error('Retrieving content property with a different key.');
      console.error('This mock instance returns the content regardless, but it might be an error.');
    }
    cb(this.contentProperty)
  }
}