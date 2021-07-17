// @ts-ignore
import {Store} from 'vue-sequence'
import mermaid from "mermaid";
import EventBus from './EventBus'
import Macro from "@/utils/Macro";

// @ts-ignore
const ap = AP;
const storeConfig = Store()
// @ts-ignore
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
    updateDiagramType({commit}: any, payload: any) {
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
      return state.diagramType?.toLowerCase() || 'zenuml'
    }
  },
  state: {
    ...storeConfig.state,
    macro: new Macro(ap),
    mermaidCode: 'graph TD; A-->B;',
    mermaidSvg: '',
    diagramType: 'zenuml',
    styles: {},
    onElementClick: (codeRange: any) => {
      EventBus.$emit('highlight', codeRange)
    }
  }
}

