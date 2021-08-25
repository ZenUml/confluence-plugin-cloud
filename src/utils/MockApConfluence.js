class MockApConfluence {
  macroParams
  macroBody
  key
  contentProperty

  saveMacro(params, body) {
    this.macroParams = params
    this.macroBody = body
  }

  getMacroData(cb) {
    cb(this.macroParams)
  }

  getMacroBody(cb) {
    cb(this.macroBody)
  }

  setContentProperty(content, cb) {
    this.key = content.key
    this.contentProperty = content
    cb && cb(content)
  }

  getContentProperty(key, cb) {
    if (this.key === key) {
      cb(this.contentProperty)
    } else {
      cb(null)
    }
  }
}

if (window.location.href.includes('localhost')) {
  console.log('You are using a mocked AP.confluence')
  let mockApConfluence = new MockApConfluence();
  window.AP = {
    confluence: mockApConfluence,
    resize() {}
  }
}

export default MockApConfluence