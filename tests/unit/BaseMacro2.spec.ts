import BaseMacro2 from "@/model/BaseMacro2";
import MockAp from '@/model/MockAp'
import {IConfluence} from "@/model/IConfluence";
import {DataSource, DiagramType} from "@/model/Diagram";
import ApWrapper2 from "@/model/ApWrapper2";

let mockAp: MockAp;
let mockApConfluence: IConfluence;
let macro: BaseMacro2;

jest.mock('../../src/utils/uuid', () => {
  return () => 'random_uuid'
})

const savedLocation = window.location;

describe('BaseMacro2', () => {
  const contentId = 'content_id_1234';

  beforeEach(() => {
    // See the following pattern at https://icing.space/2021/mocking-window-location-in-jest/
    delete window.location;
    // @ts-ignore
    window.location = Object.assign(new URL("https://zenuml.com/?contentKey=zenuml-content-sequence"), {
      ancestorOrigins: "",
      assign: jest.fn(),
      reload: jest.fn(),
      replace: jest.fn()
    });
    mockAp = new MockAp(contentId);
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
})