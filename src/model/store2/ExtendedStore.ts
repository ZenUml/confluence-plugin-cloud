import {VueSequence} from '@zenuml/core';
import { StoreOptions } from 'vuex';
import { RootState} from "@/model/store2/types";
import {DiagramType, NULL_DIAGRAM} from "@/model/Diagram/Diagram";
import globals from "@/model/globals";
import Example from "@/utils/sequence/Example";
import EventBus from "@/EventBus";
const storeConfig = VueSequence.Store()

const ExtendedStore: StoreOptions<RootState> = {
  ...storeConfig,
  mutations: {
    ...storeConfig.mutations,
    updateCode2(state: any, payload: any) {
      state.code = payload
      state.diagram.code = payload
    },
    updateMermaidCode(state: any, payload: any) {
      state.mermaidCode = payload
      state.diagram.mermaidCode = payload
    },
    updateDiagramType(state: any, payload: any) {
      state.diagramType = payload
      state.diagram.diagramType = payload
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

export default ExtendedStore;
