import { mount } from '@vue/test-utils'
import Header from '@/components/Header/Header.vue'
import {DiagramType} from "@/model/Diagram/Diagram";
import store from "@/model/store2/";

describe('Header', () => {
  it('should render correctly', (done) => {
    store.commit('updateDiagramType', DiagramType.Sequence);
    const headerWrapper = mount(Header, {
      global: {
        plugins: [store]
      }
    })
    // pre-condition
    const sequenceButton = headerWrapper.find({ref: 'btn-sequence'});
    expect(sequenceButton.classes('bg-white')).toBeTruthy();
    const mermaidButton = headerWrapper.find({ref: 'btn-mermaid'});
    expect(mermaidButton.classes('bg-white')).toBeFalsy();

    // click to switch to mermaid
    // @ts-ignore
    expect(headerWrapper.vm.$store.state.diagram.diagramType).toBe(DiagramType.Sequence);
    mermaidButton.trigger('click');
    // @ts-ignore
    expect(headerWrapper.vm.$store.state.diagram.diagramType).toBe(DiagramType.Mermaid);
    headerWrapper.vm.$nextTick(() => {
      expect(mermaidButton.classes('bg-white')).toBeTruthy();
    })
  })
})
