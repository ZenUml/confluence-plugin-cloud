import BaseMacro2 from "@/model/BaseMacro2";
import MockAp from '@/model/MockAp'
import {IConfluence} from "@/model/IConfluence";
import {DataSource, DiagramType} from "@/model/Diagram";
import ApWrapper2 from "@/model/ApWrapper2";
import Macro from "@/model/Macro";
import {setUpWindowLocation} from "../SetUpWindowLocation";

let mockAp: MockAp;
let mockApConfluence: IConfluence;
let macro: BaseMacro2;

jest.mock('../../src/utils/uuid', () => {
  return () => 'random_uuid'
})

const savedLocation = window.location;

describe('BaseMacro2', () => {
  const pageId = 'page_id_1234';

  beforeEach(() => {
    setUpWindowLocation("?contentKey=zenuml-content-sequence");
    mockAp = new MockAp(pageId);
    mockApConfluence = mockAp.confluence;
    macro = new BaseMacro2(new ApWrapper2(mockAp));
  });


  it('creates custom content if _customContentId is null', async () => {
    await macro.load();

    const customContentId = await macro.save({
      diagramType: DiagramType.Sequence,
      code: 'A.m',
      source: DataSource.CustomContent
    });
    expect(customContentId).toBe(1234);
  })

  it('update custom content if _customContentId is not null', async () => {
    await macro.load();

    const customContentId = await macro.save({
      diagramType: DiagramType.Sequence,
      code: 'A.m',
      source: DataSource.CustomContent
    });
    expect(customContentId).toBe(1234);
  })

  it('Remove the custom content id from macro if it is a clone', async () => {
  })

  it('If the container id is different from the current page id the macro is considered as a clone',
    async () => {
      setUpWindowLocation("?contentKey=zenuml-content-sequence");
      let mockAp = new MockAp();
      let apWrapper2 = new ApWrapper2(mockAp);
      const getLocationContext = jest.fn().mockImplementation(async () => {
        return {
          contentId: "page-001"
        }
      });
      apWrapper2.getLocationContext = getLocationContext.bind(apWrapper2);
      expect(await apWrapper2.getPageId()).toBe('page-001');
      mockApConfluence = mockAp.confluence;
      macro = new BaseMacro2(new ApWrapper2(mockAp));

      const _requestFn = jest.fn().mockImplementation(async () => {
        return {
          body: JSON.stringify({
            body: {
              raw: {
                value: JSON.stringify({
                  "code": "A.method"
                })
              }
            },
            container: {
              id: "page-002"
            }
          })
        }});
      apWrapper2._requestFn = _requestFn.bind(apWrapper2);
      const getMacroData = jest.fn().mockImplementation(async () => {
        return {
          customContentId: 1234
        }
      });
      apWrapper2.getMacroData = getMacroData.bind(apWrapper2);
      macro = new Macro(apWrapper2)
      let diagram = await macro.load();
      /**
       * in load method:
       * get the page id from the context
       * get the container id from the diagram
       * if the container id is different from the current page id the macro is considered as a clone
       */
    expect(diagram.isCopy).toBe(true);
  })

  it('If there are at least one another macro linked to the same custom content id on the same page, the macro is considered as a clone',
    async () => {
  })

  it('If there are at least one another macro linked to the same custom content id on the same page, the macro is considered as a clone',
    async () => {
  })

})