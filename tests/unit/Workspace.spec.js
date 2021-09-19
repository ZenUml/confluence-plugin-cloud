import {createLocalVue, mount} from '@vue/test-utils'
import Vuex from 'vuex'
import { VueSequence } from 'vue-sequence'
import Workspace from "../../src/components/Workspace"
const localVue = createLocalVue()
localVue.use(Vuex)
const storeConfig = VueSequence.Store()
storeConfig.state.styles = {}
global.document = {}
global.document.body.createTextRange = jest.fn()
// Skipped temporarily: having issues mounting codemirror.
// Not sure if it due to API change of vue-codemirror.
describe.skip('Workspace', () => {
  it('should disable color panel by default', async () => {
    const store = new Vuex.Store(storeConfig)
    store.commit('code', 'A')
    const workspaceWrapper = mount(Workspace, {store, localVue})
    await workspaceWrapper.vm.$nextTick()
    store.commit('onSelect', 'A')

    await workspaceWrapper.vm.$nextTick()
    const color1 = workspaceWrapper.find('[aria-label="#8777d9"]')
    color1.trigger('click')
    expect(store.state.styles['#A'].backgroundColor).toBe('#8777d9')

    expect(workspaceWrapper.vm.styles).toBe('<style> #A .participant { background: #8777d9; }</style>')
    store.commit('onSelect', 'A')
    expect(workspaceWrapper.vm.styles).toBe('<style> #A .participant { background: #8777d9; }</style>')
  })
})