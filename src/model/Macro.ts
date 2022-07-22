import {trackEvent} from '@/utils/window';
import BaseMacro2 from './BaseMacro2';
import Example from '../utils/sequence/Example'
import {DataSource} from "@/model/Diagram";

/**
 * Macro is BaseMacro2 plus load example and save with a different parameter list.
 */
class Macro extends BaseMacro2 {
  EXAMPLE = Example;

  async load() {
    const result = await super.load();

    if(!result.mermaidCode && !result.code) {
      trackEvent('sequence', 'new_macro', 'custom_content');
      result.code = this.EXAMPLE;
      result.source = DataSource.Example;
    }

    return result;
  }

  async save2(code: string, styles: any, mermaidCode: any, diagramType: any, title: any) {
    return await super.save({title, code, styles, mermaidCode, diagramType});
  }
}

export default Macro