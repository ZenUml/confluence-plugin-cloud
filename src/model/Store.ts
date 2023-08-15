import EventBus from '../EventBus'
import {DiagramType, NULL_DIAGRAM} from "@/model/Diagram/Diagram";
import globals from '@/model/globals';

export default {
  mutations: {
    updateCode2(state: any, payload: any) {
      state.diagram.code = payload
    },
    updateMermaidCode(state: any, payload: any) {
      state.diagram.mermaidCode = payload
    },
    updateDiagramType(state: any, payload: any) {
      console.log('updateDiagramType', payload, location.href)
      state.diagram.diagramType = payload
    },
  },
  actions: {
    updateCode2({commit}: any, payload: any) {
      commit('updateCode2', payload)
    },
    updateMermaidCode({commit}: any, payload: any) {
      console.debug('updateMermaidCode', payload)
      commit('updateMermaidCode', payload)
    },
    updateDiagramType({commit}: any, payload: DiagramType) {
      commit('updateDiagramType', payload)
    },
  },
  getters: {
    svg: (state: any) => {
      return state.mermaidSvg
    },
    isDisplayMode: () => globals.apWrapper.isDisplayMode(),
  },
  state: {
    styles: {},
    mermaidSvg: '',
    diagram: NULL_DIAGRAM,
    error: null,
    onElementClick: (codeRange: any) => {
      EventBus.$emit('highlight', codeRange)
    }
  }
}

