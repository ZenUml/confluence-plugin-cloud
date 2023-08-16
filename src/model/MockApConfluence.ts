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
    let customContentId;
    if (!this.macroParams) {
      console.log('No macro data found.');
      // if url contains '/drawio/view.html', set customContentId to 'fake-content-id-graph'
      if (window.location.href.includes('/drawio/viewer.html')) {
        customContentId = 'fake-content-id-graph'
      } else if (window.location.href.includes('/swagger-ui.html')) {
        customContentId = 'fake-content-id-openai'
      } else {
        customContentId = 'fake-content-id'
      }
      this.macroParams = {
        uuid: 'fake-macro-uuid',
        customContentId: customContentId,
        updatedAt: new Date()
      }
    }
    cb(this.macroParams)
  }

  getMacroBody(cb: (arg0: any) => void) {
    cb(this.macroBody)
  }

  setContentProperty(content: { key: any; version: {number: number}; value: any }, cb: (arg0: any) => any) {
    this.key = content.key
    this.contentProperty = content
    cb && cb(content)
  }

  getContentProperty(key: any, cb: (arg0: null) => void) {
    if (this.key !== key) {
      console.error('Retrieving content property with a different key.');
      console.error('This mock instance returns the content regardless, but it might be an error.');
    }
    cb(this.contentProperty)

  }
}
