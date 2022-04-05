import MockApConfluence from './model/MockApConfluence'
import GraphMacro from './model/GraphMacro'
import AP from "@/model/AP";
import ApWrapper2 from "@/model/ApWrapper2";
import createAttachmentIfContentChanged from "@/model/Attachment";
import {trackEvent} from "@/utils/window";

console.debug('Running graph main viewer');
if (window.location.href.includes('localhost')) {
  // eslint-disable-next-line
  console.log('You are using a mocked AP.confluence')
  // @ts-ignore
    window.AP = {
    confluence: new MockApConfluence()
  }
}
async function initializeMacro() {
  const apWrapper = new ApWrapper2(AP);
  await apWrapper.initializeContext();

  const macro = new GraphMacro(apWrapper);
  // @ts-ignore
  window.macro = macro;
  const {graphXml} = await macro.load();

  if(graphXml) {
    // setGraphStyle is only available on viewer and maybe should only be used on viewer.
    // @ts-ignore
    setGraphStyle && setGraphStyle('styles/default.xml');
    // @ts-ignore
    setGraphXml(graphXml);

    try {
      await createAttachmentIfContentChanged(graphXml);
    } catch (e) {
      // Do not re-throw the error
      console.error('Error when creating attachment', e);
      trackEvent(JSON.stringify(e), 'create_attachment', 'error');
    }

  }
}

initializeMacro();