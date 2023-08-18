import { createLocalVue, mount } from '@vue/test-utils'
import Vuex from 'vuex'
import Header from '@/components/Header/Header.vue'
import {DiagramType} from "@/model/Diagram/Diagram";
import store from "@/model/store2/";
const localVue = createLocalVue()
localVue.use(Vuex)

describe('Header', () => {
  it('should render correctly', (done) => {
    store.commit('updateDiagramType', DiagramType.Sequence);
    const headerWrapper = mount(Header, {store, localVue})
    // pre-condition
    const sequenceButton = headerWrapper.findComponent({ref: 'btn-sequence'});
    expect(sequenceButton.classes('bg-white')).toBeTruthy();
    const mermaidButton = headerWrapper.findComponent({ref: 'btn-mermaid'});
    expect(mermaidButton.classes('bg-white')).toBeFalsy();

    // click to switch to mermaid
    expect(headerWrapper.vm.$store.state.diagram.diagramType).toBe(DiagramType.Sequence);
    mermaidButton.trigger('click');
    expect(headerWrapper.vm.$store.state.diagram.diagramType).toBe(DiagramType.Mermaid);
    headerWrapper.vm.$nextTick(() => {
      expect(mermaidButton.classes('bg-white')).toBeTruthy();
      done();
    })
  })
})
