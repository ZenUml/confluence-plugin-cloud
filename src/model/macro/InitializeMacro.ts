import Vue from 'vue'
import EventBus from '@/EventBus'
import {trackEvent} from "@/utils/window";
import globals from '@/model/globals';

export async function initializeMacro(store: any) {
  const macro = globals.macro;
  try {
    await macro._apWrapper.initializeContext();

    const {code, styles, mermaidCode, diagramType} = await macro.load();
    store.commit('code', code);
    store.state.styles = styles;
    store.dispatch('updateMermaidCode', mermaidCode || store.state.mermaidCode)
    store.dispatch('updateDiagramType', diagramType)

    EventBus.$emit('diagramLoaded');
    // This is a hack to trigger reactivity on macro.
    // Without this the `Debug` component misses debug information after initializing the macro.
    Vue.set(macro, 'dummy', 'dummy');
  } catch (e) {
    console.error('Error on initializing macro:', e);
    trackEvent(JSON.stringify(e), 'load_sequence', 'error');
    store.state.error = e;
  }

}