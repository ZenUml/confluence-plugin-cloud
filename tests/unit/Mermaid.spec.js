import {mount, createLocalVue} from '@vue/test-utils'
import Vuex from 'vuex'
import Mermaid from '../../src/components/Mermaid'

const localVue = createLocalVue()
localVue.use(Vuex)

const Store = {
  state: {
    mermaidCode: `
    graph TD;
      A-->B;
  `
  }
}

describe('Mermaid', () => {
  it('should render a mermaid diagram', () => {
    const store = new Vuex.Store(Store)

    const mermaid = mount(Mermaid, {store, localVue})
    const exist = mermaid.find('div')
    expect(exist).toBeTruthy()
    expect(mermaid.text()).toContain('graph TD;')
  })
})