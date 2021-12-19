export interface IDescriptor {
  modules: {
    dynamicContentMacros: Array<IDynamicContentMacro>
    generalPages: Array<IGeneralPage>
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

export interface IGeneralPage {
  url: string
}
