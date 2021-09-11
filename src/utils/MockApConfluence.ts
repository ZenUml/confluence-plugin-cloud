export default class MockApConfluence {
  private macroParams: any
  private macroBody: any
  public key: any
  private contentProperty: any

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

  setContentProperty(content: { key: any; }, cb: (arg0: any) => any) {
    this.key = content.key
    this.contentProperty = content
    cb && cb(content)
  }

  getContentProperty(key: any, cb: (arg0: null) => void) {
    if (this.key === key) {
      cb(this.contentProperty)
    } else {
      cb(null)
    }
  }
}