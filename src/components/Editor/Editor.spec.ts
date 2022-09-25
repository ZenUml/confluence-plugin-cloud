import { createLocalVue, mount } from '@vue/test-utils'
import Vuex from 'vuex'
import Editor from '@/components/Editor/Editor.vue'
import Store from "@/model/Store";
import {DiagramType} from "@/model/Diagram/Diagram";
import Example from "@/utils/sequence/Example";
const localVue = createLocalVue()
localVue.use(Vuex)

// The following code solves "TypeError: range(...).getBoundingClientRect is not a function"
document.createRange = () => {
  const range = new Range();

  range.getBoundingClientRect = jest.fn();

  range.getClientRects = () => {
    return {
      item: () => null,
      length: 0,
      [Symbol.iterator]: jest.fn()
    };
  };
  return range;
}
describe('Editor', () => {
  it('should render correctly', () => {
    const store = new Vuex.Store(Store) as any;
    const editorWrapper = mount(Editor, {store, localVue})
    const vm = editorWrapper.vm as any;
    expect(vm.code).toBe(Example.Sequence);
    store.commit('updateDiagramType', DiagramType.Mermaid);
    expect(store.state.diagramType).toBe(DiagramType.Mermaid);
    expect(vm.code).toBe(Example.Mermaid);
  })
})
