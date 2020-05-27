import { shallowMount, createLocalVue } from "@vue/test-utils"
import Vuex from 'vuex'
import { Store } from 'vue-sequence'
import Workspace from "../../src/components/Workspace"
const localVue = createLocalVue()
localVue.use(Vuex)

describe('Workspace', () => {
  it('should disable color panel by default', async () => {
    const store = new Vuex.Store(Store)
    const workspaceWrapper = shallowMount(Workspace, {store, localVue})
    expect(workspaceWrapper.find('.disabled').exists()).toBeTruthy()
    store.commit('onSelect', 'A')
    expect(workspaceWrapper.vm.colorPanelEnabled).toBeTruthy()

    expect(workspaceWrapper.find('.disabled').exists()).toBeFalsy()
    store.commit('onSelect', 'A')
    expect(workspaceWrapper.vm.colorPanelEnabled).toBeFalsy()
    expect(workspaceWrapper.find('.disabled').exists()).toBeTruthy()
  })
})