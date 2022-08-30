import MockAp from '@/model/MockAp'
import {IConfluence} from "@/model/IConfluence";
import ApWrapper2 from "@/model/ApWrapper2";
import helper from './TestHelper';
import defaultContentProvider from "@/model/ContentProvider/CompositeContentProvider";

let mockAp: MockAp;
let mockApConfluence: IConfluence;


describe('Mermaid', () => {
  const contentId = 'content_id_1234';

  beforeEach(() => {
    helper.setUpUrlParam('contentKey=sequence');

    mockAp = new MockAp(contentId);
    mockApConfluence = mockAp.confluence;
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

    const contentProvider = defaultContentProvider(new ApWrapper2(mockAp));
    const {id, doc} = await contentProvider.load();

    expect(id).toBe(1234);
    expect(doc.mermaidCode).toBe('graph TD; A-->B1;');
  })
})