import { trackEvent } from '@/utils/window';
import BaseMacro2 from './BaseMacro2';
import Example from '../utils/sequence/Example'

class Macro extends BaseMacro2 {
  EXAMPLE = Example;

  async load() {
    const result = await super.load();

    if(!result.mermaidCode && !result.code) {
      trackEvent(this._pageId, 'load_macro', 'default_example');
      result.code = this.EXAMPLE;
    }

    return result;
  }

  async save2(code: string, styles: any, mermaidCode: any, diagramType: any) {
    return await super.save({code, styles, mermaidCode, diagramType});
  }
}

export default Macro