import { createLocalVue, mount } from '@vue/test-utils'
import Vuex from 'vuex'
import Header from '@/components/Header.vue'
import {DiagramType} from "@/model/Diagram/Diagram";

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Header', () => {
  it('should render correctly', (done) => {
    const store = new Vuex.Store({
      state: {
        diagramType: DiagramType.Sequence
      },
      mutations: {
        updateDiagramType(state: any, payload: any) {
          state.diagramType = payload
        },
      }
    })
    const headerWrapper = mount(Header, {store, localVue})
    const sequenceButton = headerWrapper.findComponent({ref: 'btn-sequence'});
    expect(sequenceButton.classes('bg-white')).toBeTruthy();
    const mermaidButton = headerWrapper.findComponent({ref: 'btn-mermaid'});
    expect(mermaidButton.classes('bg-white')).toBeFalsy();
    expect(headerWrapper.vm.$store.state.diagramType).toBe(DiagramType.Sequence);
    mermaidButton.trigger('click');
    headerWrapper.vm.$nextTick(() => {
      expect(mermaidButton.classes('bg-white')).toBeTruthy();
      done();
    })
    expect(headerWrapper.vm.$store.state.diagramType).toBe(DiagramType.Mermaid);
  })
})
