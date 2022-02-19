import EventBus from '@/EventBus'
import {trackEvent} from "@/utils/window";

export async function initializeMacro(store: any) {
  // @ts-ignore
  const macro = window.macro || store.state.macro;
  // @ts-ignore
  window.macro = macro;
  try {
    await macro._apWrapper.initializeContext();
    
    const {code, styles, mermaidCode, diagramType} = await macro.load();
    store.commit('code', code);
    // @ts-ignore
    store.state.styles = styles;
    // @ts-ignore
    // @ts-ignore
    store.dispatch('updateMermaidCode', mermaidCode || store.state.mermaidCode)
    store.dispatch('updateDiagramType', diagramType)

    EventBus.$emit('diagramLoaded');
  } catch (e) {
    // @ts-ignore
    console.error('Error on initializing macro:', e);
    trackEvent(JSON.stringify(e), 'load_sequence', 'error');
    // @ts-ignore
    store.state.error = e;
  }

}