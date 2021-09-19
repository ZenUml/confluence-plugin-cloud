import { mount, createLocalVue } from "@vue/test-utils"
import Vuex from 'vuex'
import { VueSequence } from 'vue-sequence'
import StylingPanel from '../../src/components/StylingPanel'
const localVue = createLocalVue()
localVue.use(Vuex)

describe('StylingPanel', () => {
  it('Should set styles for single Participant', async () => {
    const storeConfig = VueSequence.Store()
    storeConfig.state.styles = {}
    const store = new Vuex.Store(storeConfig)
    const stylingPanelWrapper = mount(StylingPanel, {store, localVue})
    store.commit('onSelect', 'A')
    // expect(stylingPanelWrapper.html()).toBe('')
    const color1 = stylingPanelWrapper.find('[aria-label="#8777d9"]')
    expect(color1.exists()).toBeTruthy()
    color1.trigger('click')
    expect(store.state.styles['#A'].backgroundColor).toBe('#8777d9')

    const color2 = stylingPanelWrapper.find('[aria-label="#2684ff"]')
    expect(color2.exists()).toBeTruthy()
    color2.trigger('click')
    expect(store.state.styles['#A'].backgroundColor).toBe('#2684ff')
    stylingPanelWrapper.destroy()
  })

  it('Should set styles for multiple Participants', async () => {
    const storeConfig = VueSequence.Store()
    storeConfig.state.styles = {}
    const store = new Vuex.Store(storeConfig)
    const stylingPanelWrapper = mount(StylingPanel, {store, localVue})
    store.commit('onSelect', 'A')
    store.commit('onSelect', 'B')
    // expect(stylingPanelWrapper.html()).toBe('')
    const color1 = stylingPanelWrapper.find('[aria-label="#8777d9"]')
    expect(color1.exists()).toBeTruthy()
    color1.trigger('click')
    expect(store.state.styles['#A'].backgroundColor).toBe('#8777d9')
    expect(store.state.styles['#B'].backgroundColor).toBe('#8777d9')
    stylingPanelWrapper.destroy()
  })
})