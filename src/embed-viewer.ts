import {trackEvent} from "@/utils/window";
import './GTagConfig'
import {DiagramType} from "@/model/Diagram";
import AP from "@/model/AP";
import {MacroIdProvider} from "@/model/ContentProvider/MacroIdProvider";
import {CustomContentStorageProvider} from "@/model/ContentProvider/CustomContentStorageProvider";
import {ContentProvider} from "@/model/ContentProvider/ContentProvider";

function loadViewer(url: string) {
  const e = document.createElement('meta');
  e.setAttribute('http-equiv', 'refresh');
  e.setAttribute('content', `0;URL='${url}'`);
  const h = document.getElementsByTagName('head')[0];
  h && h.appendChild(e);
}

function getViewerUrl(diagramType: DiagramType) {
  if(diagramType == DiagramType.Sequence || diagramType == DiagramType.Mermaid) {
    return '/sequence-viewer.html';
  }
  if(diagramType == DiagramType.Graph) {
    return '/drawio/viewer.html';
  }
  if(diagramType == DiagramType.OpenApi) {
    return '/swagger-ui.html';
  }

  console.warn(`Unknown diagramType: ${diagramType}`);
}

async function initializeMacro() {
  try {
    const idProvider = new MacroIdProvider(AP);
    const customContentStorageProvider = new CustomContentStorageProvider(AP);
    const contentProvider = new ContentProvider(idProvider, customContentStorageProvider);
    const { content } = await contentProvider.load()
    // @ts-ignore
    const { diagramType } = content.value;

    if(diagramType) {
      const url = `${getViewerUrl(diagramType)}${window.location.search}`;
      loadViewer(url);
    }
  } catch (e) {
    console.error('Error on initializing macro:', e);
    trackEvent(JSON.stringify(e), 'load_macro', 'error');
  }
}

initializeMacro();