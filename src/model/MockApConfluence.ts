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
    if (!this.macroParams) {
      let customContentId;
      const href = location.href;
      if (href.includes('sequence-viewer.html') || href.includes('sequence-viewer-dialog.html')
        || href.includes('sequence-editor.html') || href.includes('sequence-editor-dialog.html')) {
        if(href.includes('diagram-type=mermaid')) {
          customContentId = 'fake-content-id-diagram-mermaid';
        } else {
          customContentId = 'fake-content-id-diagram-sequence';
        }
      } else {
        // home page
        customContentId = 'fake-content-id-diagram-sequence';
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
