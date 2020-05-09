class MockApConfluence {
  macroParams
  macroBody
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

  setContentProperty(content) {
    this.contentProperty = content
  }

  getContentProperty(key, cb) {
    cb(this.contentProperty)
  }
}

export default MockApConfluence