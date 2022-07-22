import {VueSequence} from 'vue-sequence'
import mermaid from "mermaid";
import EventBus from '../EventBus'
import {DiagramType} from "@/model/Diagram";
import globals from '@/model/globals';

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
    },
    updateCanEdit(state: any, payload: any) {
      state.canEdit = payload
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
    updateCanEdit({commit}: any, payload: any) {
      commit('updateCanEdit', payload)
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
    content: (state: any, getters: any) => {
      return getters.diagramType === 'mermaid' ? state.mermaidCode : state.code
    },
    isDisplayMode: () => globals.apWrapper.isDisplayMode(),
    canEdit: (state: any) => state.canEdit
  },
  state: {
    ...storeConfig.state,
    mermaidCode: 'graph TD; A-->B;',
    mermaidSvg: '',
    diagramType: DiagramType.Sequence,
    canEdit: false,
    styles: {},
    error: null,
    onElementClick: (codeRange: any) => {
      EventBus.$emit('highlight', codeRange)
    }
  }
}

