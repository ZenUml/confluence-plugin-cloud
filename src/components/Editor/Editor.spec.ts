import { shallowMount } from '@vue/test-utils'
import Editor from '@/components/Editor/Editor.vue'
import store from "@/model/store2";
import {DiagramType} from "@/model/Diagram/Diagram";
import Example from "@/utils/sequence/Example";
import {vi} from "vitest";

// The following code solves "TypeError: range(...).getBoundingClientRect is not a function"
document.createRange = () => {
  const range = new Range();

  range.getBoundingClientRect = vi.fn();

  range.getClientRects = () => {
    return {
      item: () => null,
      length: 0,
      [Symbol.iterator]: vi.fn()
    };
  };
  return range;
}
describe('Editor', () => {
  it('should render correctly', () => {
    const editorWrapper = shallowMount(Editor, {
      global: {
        plugins: [store]
      }
    })
    const vm = editorWrapper.vm as any;
    expect(vm.code).toBe("");
    store.commit('updateDiagramType', DiagramType.Mermaid);
    expect(store.state.diagram.diagramType).toBe(DiagramType.Mermaid);
    store.commit('updateMermaidCode', Example.Mermaid);
    expect(vm.code).toBe(Example.Mermaid);
  })
})
