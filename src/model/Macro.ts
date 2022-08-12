import BaseMacro2 from './BaseMacro2';

/**
 * Macro is BaseMacro2 plus load example and save with a different parameter list.
 */
class Macro extends BaseMacro2 {

  async save2(code: string, styles: any, mermaidCode: any, diagramType: any, title: any) {
    return await super.save({title, code, styles, mermaidCode, diagramType});
  }
}

export default Macro