import MockAp from '@/model/MockAp'
import {DataSource, DiagramType} from "@/model/Diagram/Diagram";
import ApWrapper2 from "@/model/ApWrapper2";
import {buildCustomContentResponse} from "../CustomContentFixtures";
import helper from './TestHelper';
import MockApConfluence from "@/model/MockApConfluence";
import {saveToPlatform} from "@/model/ContentProvider/Persistence";
import defaultContentProvider from "@/model/ContentProvider/CompositeContentProvider";

let mockAp: MockAp;
let mockApConfluence: MockApConfluence;

jest.mock('../../src/utils/uuid', () => {
  return () => 'random_uuid'
})

describe('Content loading', () => {

  function setUp(param: string) {
    helper.setUpUrlParam(param);

    mockAp = new MockAp();
    mockApConfluence = mockAp.confluence;
  }

  it('creates custom content if _customContentId is null', async () => {
    setUp('contentKey=sequence');

    const customContentId = await saveToPlatform({
      diagramType: DiagramType.Sequence,
      code: 'A.m',
      source: DataSource.CustomContent
    });
    expect(customContentId).toBe(1234);
  })

  it('update custom content if _customContentId is not null', async () => {
    setUp('contentKey=sequence');
    const customContentId = await saveToPlatform({
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
      setUp("contentKey=zenuml-content-sequence");
      let mockAp = new MockAp();
      let apWrapper2 = new ApWrapper2(mockAp);
      const getLocationContext = jest.fn().mockImplementation(async () => {
        return {
          contentId: "page-001"
        }
      });
      apWrapper2._page._getLocationContext = getLocationContext.bind(apWrapper2);
      expect(await apWrapper2._page.getPageId()).toBe('page-001');
      mockApConfluence = mockAp.confluence;

      const _requestFn = jest.fn().mockImplementation(async () => {
        return buildCustomContentResponse("page-002", "A.method");
      });
      apWrapper2._requestFn = _requestFn.bind(apWrapper2);
      const getMacroData = jest.fn().mockImplementation(async () => {
        return {
          customContentId: 1234
        }
      });
      apWrapper2.getMacroData = getMacroData.bind(apWrapper2);
      // macro = new Macro(apWrapper2)
      const contentProvider = defaultContentProvider(apWrapper2);
      const {id, doc} = await contentProvider.load();
      expect(id).toBe(1234);
      expect(doc.isCopy).toBeTruthy();
  })

  it('If there are at least one another macro linked to the same custom content id on the same page, the macro is considered as a clone',
    async () => {
  })

  it('If there are at least one another macro linked to the same custom content id on the same page, the macro is considered as a clone',
    async () => {
  })
})