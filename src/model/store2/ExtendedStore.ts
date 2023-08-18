import { StoreOptions } from 'vuex';
import { RootState} from "@/model/store2/types";
import {DiagramType, NULL_DIAGRAM} from "@/model/Diagram/Diagram";
import globals from "@/model/globals";
import EventBus from "@/EventBus";

const ExtendedStore: StoreOptions<RootState> = {
  mutations: {
    updateCode2(state: any, payload: any) {
      state.diagram.code = payload
    },
    updateMermaidCode(state: any, payload: any) {
      state.diagram.mermaidCode = payload
    },
    updateDiagramType(state: any, payload: any) {
      state.diagramType = payload
      state.diagram.diagramType = payload
    },
  },
  actions: {
    updateCode2({commit}: any, payload: any) {
      commit('updateCode2', payload)
    },
    updateMermaidCode({commit}: any, payload: any) {
      commit('updateMermaidCode', payload)
    },
    updateDiagramType({commit}: any, payload: DiagramType) {
      commit('updateDiagramType', payload)
    }
  },
  getters: {
    isDisplayMode: () => globals.apWrapper.isDisplayMode(),
  },
  state: {
    diagramType: DiagramType.Sequence,
    diagram: NULL_DIAGRAM,
    error: null,
    onElementClick: (codeRange: any) => {
      EventBus.$emit('highlight', codeRange)
    }
  }
}

export default ExtendedStore;
