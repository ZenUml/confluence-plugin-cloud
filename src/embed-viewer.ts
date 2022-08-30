import {trackEvent} from "@/utils/window";
import {DiagramType} from "@/model/Diagram/Diagram";
import AP from "@/model/AP";
import defaultContentProvider from "@/model/ContentProvider/CompositeContentProvider";
import ApWrapper2 from "@/model/ApWrapper2";

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
    const contentProvider = defaultContentProvider(new ApWrapper2(AP));
    const { doc } = await contentProvider.load()
    const { diagramType } = doc;

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