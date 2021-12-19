export interface IDescriptor {
  modules: {
    dynamicContentMacros: Array<IDynamicContentMacro>
    generalPages: Array<IGeneralPage>
    customContent: Array<ICustomContentModule>
  }
}

export interface IDynamicContentMacro {
  url: string
  editor?: {
    url: string
  }
  renderModes?: {
    default: {
      url: string
    }
  }
}

interface ICustomContentModule {
  key: string
}

export interface IGeneralPage {
  url: string
}
