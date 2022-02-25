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
    store.state.styles = styles;
    store.dispatch('updateMermaidCode', mermaidCode || store.state.mermaidCode)
    store.dispatch('updateDiagramType', diagramType)

    EventBus.$emit('diagramLoaded');
  } catch (e) {
    console.error('Error on initializing macro:', e);
    trackEvent(JSON.stringify(e), 'load_sequence', 'error');
    store.state.error = e;
  } finally {
    // Trigger reactivity of state.macro._diagram. It is used in the debug panel.
    // TODO: We may be able to find a better way to do this.
    store.state.macro = Object.assign({}, macro);
  }
}