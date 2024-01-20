import { StoreOptions } from 'vuex';
import { RootState} from "@/model/store2/types";
import {DiagramType, NULL_DIAGRAM} from "@/model/Diagram/Diagram";
import globals from "@/model/globals";
import EventBus from "@/EventBus";

const ExtendedStore: StoreOptions<RootState> = {
  mutations: {
    updateCode2(state: any, payload: any) {
      state.diagram.code = payload
      // update title
      if (state.diagram.code.split('\n')[0].startsWith('title ')) {
        state.diagram.title = state.diagram.code.split('\n')[0].substring(6).trim()
      }
    },
    updateMermaidCode(state: any, payload: any) {
      state.diagram.mermaidCode = payload
    },
    updateDiagramType(state: any, payload: any) {
      state.diagram.diagramType = payload
    },
    updateTitle(state: any, payload: any) {
      state.diagram.title = payload.trim()
      // update title in code
      if (state.diagramType !== 'sequence') return
      if (state.diagram.code.split('\n')[0].startsWith('title ')) {
        state.diagram.code = `title ${payload.trim()} \n` + state.diagram.code.split('\n').slice(1).join('\n')
      } else {
        state.diagram.code = `title ${payload.trim()} \n` + state.diagram.code
      }
    }
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
    },
    updateTitle({commit}: any, payload: any) {
      commit('updateTitle', payload)
    }
  },
  getters: {
    isDisplayMode: () => globals.apWrapper.isDisplayMode(),
  },
  state: {
    diagram: NULL_DIAGRAM,
    error: null,
    onElementClick: (codeRange: any) => {
      EventBus.$emit('highlight', codeRange)
    }
  }
}

export default ExtendedStore;
