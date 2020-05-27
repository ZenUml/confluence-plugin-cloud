import {createLocalVue, mount} from '@vue/test-utils'
import Vuex from 'vuex'
import { Store } from 'vue-sequence'
import Workspace from "../../src/components/Workspace"
const localVue = createLocalVue()
localVue.use(Vuex)
Store.state.styles = {}
describe('Workspace', () => {
  it('should disable color panel by default', async () => {
    const store = new Vuex.Store(Store)
    store.commit('code', 'A')
    const workspaceWrapper = mount(Workspace, {store, localVue})
    await workspaceWrapper.vm.$nextTick()
    expect(workspaceWrapper.find('.disabled').exists()).toBeTruthy()
    store.commit('onSelect', 'A')

    await workspaceWrapper.vm.$nextTick()
    // expect(workspaceWrapper.html()).toBe('')
    // expect(workspaceWrapper.find('.disabled').exists()).toBeFalsy()
    const color1 = workspaceWrapper.find('[aria-label="#8777d9"]')
    color1.trigger('click')
    expect(store.state.styles.A).toBe('#8777d9')
    expect(workspaceWrapper.vm.colorPanelEnabled).toBeTruthy()

    expect(workspaceWrapper.vm.styles).toBe('<style> #A .participant { background: #8777d9; }</style>')
    store.commit('onSelect', 'A')
    expect(workspaceWrapper.vm.colorPanelEnabled).toBeFalsy()
    expect(workspaceWrapper.vm.styles).toBe('<style> #A .participant { background: #8777d9; }</style>')
    expect(workspaceWrapper.find('.disabled').exists()).toBeTruthy()
  })
})