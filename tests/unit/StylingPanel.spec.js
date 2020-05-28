import { mount, createLocalVue } from "@vue/test-utils"
import Vuex from 'vuex'
import { Store } from 'vue-sequence'
import Workspace from "../../src/components/Workspace"
import StylingPanel from '../../src/components/StylingPanel'
const localVue = createLocalVue()
localVue.use(Vuex)
Store.state.styles = {}
function cloneDeep (obj) {
  if (obj == null || typeof (obj) !== 'object') {
    return obj
  }

  var temp = new obj.constructor()

  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      temp[key] = cloneDeep(obj[key])
    }
  }

  return temp
}

describe('StylingPanel', () => {
  it('Should set styles for single Participant', async () => {
    const store = new Vuex.Store(cloneDeep(Store))
    const stylingPanelWrapper = mount(StylingPanel, {store, localVue})
    store.commit('onSelect', 'A')
    // expect(stylingPanelWrapper.html()).toBe('')
    const color1 = stylingPanelWrapper.find('[aria-label="#8777d9"]')
    expect(color1.exists()).toBeTruthy()
    color1.trigger('click')
    expect(store.state.styles['A'].backgroundColor).toBe('#8777d9')

    const color2 = stylingPanelWrapper.find('[aria-label="#2684ff"]')
    expect(color2.exists()).toBeTruthy()
    color2.trigger('click')
    expect(store.state.styles['A'].backgroundColor).toBe('#2684ff')
    stylingPanelWrapper.destroy()
  })

  it('Should set styles for multiple Participants', async () => {
    const store = new Vuex.Store(cloneDeep(Store))
    const stylingPanelWrapper = mount(StylingPanel, {store, localVue})
    store.commit('onSelect', 'A')
    store.commit('onSelect', 'B')
    // expect(stylingPanelWrapper.html()).toBe('')
    const color1 = stylingPanelWrapper.find('[aria-label="#8777d9"]')
    expect(color1.exists()).toBeTruthy()
    color1.trigger('click')
    expect(store.state.styles['A'].backgroundColor).toBe('#8777d9')
    expect(store.state.styles['B'].backgroundColor).toBe('#8777d9')
    stylingPanelWrapper.destroy()
  })
})