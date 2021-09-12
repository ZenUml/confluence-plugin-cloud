import MockApConfluence from './model/MockApConfluence'
import GraphMacroViewer from './utils/GraphMacroViewer'
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
  // @ts-ignore
  const macro = new GraphMacroViewer(AP);
  // @ts-ignore
  window.macro = macro;
  const {graphXml} = await macro.load();

  if(graphXml) {
    // setGraphStyle is only available on viewer and maybe should only be used on viewer.
    // @ts-ignore
    setGraphStyle && setGraphStyle('styles/default.xml');
    // @ts-ignore
    setGraphXml(graphXml);
  }
}

initializeMacro();