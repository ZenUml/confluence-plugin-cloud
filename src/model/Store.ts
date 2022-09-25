import {VueSequence} from 'vue-sequence'
import EventBus from '../EventBus'
import {DiagramType, NULL_DIAGRAM} from "@/model/Diagram/Diagram";
import globals from '@/model/globals';
import Example from "@/utils/sequence/Example";

const storeConfig = VueSequence.Store()
export default {
  ...storeConfig,
  mutations: {
    ...storeConfig.mutations,
    updateMermaidCode(state: any, payload: any) {
      state.mermaidCode = payload
    },
    updateDiagramType(state: any, payload: any) {
      state.diagramType = payload
    },
  },
  actions: {
    ...storeConfig.actions,
    updateMermaidCode({commit}: any, payload: any) {
      commit('updateMermaidCode', payload)
    },
    updateDiagramType({commit}: any, payload: DiagramType) {
      commit('updateDiagramType', payload)
    },
    reloadZenUML({commit, state}: any) {
      const code = state.code
      commit('code', '')
      commit('code', code)
    }
  },
  getters: {
    ...storeConfig.getters,
    svg: (state: any) => {
      return state.mermaidSvg
    },
    isDisplayMode: () => globals.apWrapper.isDisplayMode(),
  },
  state: {
    ...storeConfig.state,
    mermaidCode: Example.Mermaid,
    diagramType: DiagramType.Sequence,
    mermaidSvg: '',
    diagram: NULL_DIAGRAM,
    error: null,
    onElementClick: (codeRange: any) => {
      EventBus.$emit('highlight', codeRange)
    }
  }
}

