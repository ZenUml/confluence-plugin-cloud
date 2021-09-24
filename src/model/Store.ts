import {VueSequence} from 'vue-sequence'
import mermaid from "mermaid";
import EventBus from '../EventBus'
import Macro from "@/model/Macro";
import AP from "@/model/AP";
import {DiagramType} from "@/model/Diagram";

const ap = AP;
const storeConfig = VueSequence.Store()
export default {
  ...storeConfig,
  mutations: {
    ...storeConfig.mutations,
    updateMermaidCode(state: any, payload: any) {
      state.mermaidCode = payload
    },
    updateMermaidDiagram(state: any, payload: any) {
      state.mermaidSvg = payload
    },
    updateDiagramType(state: any, payload: any) {
      state.diagramType = payload
    }
  },
  actions: {
    ...storeConfig.actions,
    updateMermaidCode({commit}: any, payload: any) {
      commit('updateMermaidCode', payload)
      try {
        mermaid.parse(payload);
        mermaid.mermaidAPI.render('any-id',
          payload,
          (svg) => {
            commit('updateMermaidDiagram', svg);
          }
        );
      } catch (e) {
        return false;
      }
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
    diagramType: (state: any) => {
      return state.diagramType?.toLowerCase() || DiagramType.Sequence
    },
    isDisplayMode: (state: any) => state.macro._apWrapper.isDisplayMode()
  },
  state: {
    ...storeConfig.state,
    macro: new Macro(ap),
    mermaidCode: 'graph TD; A-->B;',
    mermaidSvg: '',
    diagramType: DiagramType.Sequence,
    styles: {},
    error: null,
    onElementClick: (codeRange: any) => {
      EventBus.$emit('highlight', codeRange)
    }
  }
}

