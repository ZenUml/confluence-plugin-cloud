import BaseMacro2 from "@/model/BaseMacro2";
import MockAp from '@/model/MockAp'
import {IConfluence} from "@/model/IConfluence";

let mockAp: MockAp;
let mockApConfluence: IConfluence;
let macro: BaseMacro2;

jest.mock('../../src/utils/uuid', () => {
  return () => 'random_uuid'
})

describe('BaseMacro2', () => {
  const contentId = 'content_id_1234';

  beforeEach(() => {
    mockAp = new MockAp(contentId);
    mockApConfluence = mockAp.confluence;
    macro = new BaseMacro2(mockAp);
  });


  it('creates custom content if _customContentId is null', async () => {
    await macro.load();
    delete window.location;
    // @ts-ignore
    window.location = new URL('https://zenuml.com/?contentKey=zenuml-content-graph')

    const customContentId = await macro.save({});
    expect(customContentId).toBe(1234);
  })
})