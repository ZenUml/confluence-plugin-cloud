import MockAp from '@/model/MockAp'
import Macro from '@/model/Macro'
import {IConfluence} from "@/model/IConfluence";
import ApWrapper2 from "@/model/ApWrapper2";
import helper from './TestHelper';

let mockAp: MockAp;
let mockApConfluence: IConfluence;
let macro: Macro;


describe('Mermaid', () => {
  const contentId = 'content_id_1234';

  beforeEach(() => {
    helper.setUpUrlParam('contentKey=sequence');

    mockAp = new MockAp(contentId);
    mockApConfluence = mockAp.confluence;
    macro = new Macro(new ApWrapper2(mockAp));
  });

  it('saved in custom content', async () => {
    mockApConfluence.saveMacro({customContentId: 1234}, '');
    const diagram = {
      "code": "",
      "styles": {},
      "mermaidCode": "graph TD; A-->B1;",
      "diagramType": "mermaid"
    }
    mockAp.setCustomContent(1234, diagram);
    // const mermaidCode = (await macro.load()).mermaidCode;
    // expect(mermaidCode).toBe('graph TD; A-->B1;');
  })
})