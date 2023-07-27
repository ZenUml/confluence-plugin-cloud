import {VueSequence} from '@zenuml/core';
import EventBus from '../EventBus'
import {DiagramType, NULL_DIAGRAM} from "@/model/Diagram/Diagram";
import globals from '@/model/globals';
import Example from "@/utils/sequence/Example";

const storeConfig = VueSequence.Store()
export default {
  ...storeConfig,
  mutations: {
    ...storeConfig.mutations,
    updateCode2(state: any, payload: any) {
      state.code2 = payload
    },
    updateMermaidCode(state: any, payload: any) {
      state.mermaidCode = payload
    },
    updateDiagramType(state: any, payload: any) {
      state.diagramType = payload
    },
  },
  actions: {
    ...storeConfig.actions,
    updateCode2({commit}: any, payload: any) {
      commit('updateCode2', payload)
    },
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
    code2: '',
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

