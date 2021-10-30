import BaseMacro2 from "@/model/BaseMacro2";
import MockAp from '@/model/MockAp'
import {IConfluence} from "@/model/IConfluence";
import {DataSource, DiagramType} from "@/model/Diagram";
import ApWrapper2 from "@/model/ApWrapper2";
import helper from './TestHelper';

let mockAp: MockAp;
let mockApConfluence: IConfluence;
let macro: BaseMacro2;

jest.mock('../../src/utils/uuid', () => {
  return () => 'random_uuid'
})

describe('BaseMacro2', () => {
  const contentId = 'content_id_1234';

  function setUp(param: string) {
    helper.setUpUrlParam(param);

    mockAp = new MockAp(contentId);
    mockApConfluence = mockAp.confluence;
    macro = new BaseMacro2(new ApWrapper2(mockAp));
  };

  it('creates custom content if _customContentId is null', async () => {
    setUp('contentKey=sequence');
    await macro.load();

    const customContentId = await macro.save({
      diagramType: DiagramType.Sequence,
      code: 'A.m',
      source: DataSource.CustomContent
    });
    expect(customContentId).toBe(1234);
  })

  it('update custom content if _customContentId is not null', async () => {
    setUp('contentKey=sequence');
    await macro.load();

    const customContentId = await macro.save({
      diagramType: DiagramType.Sequence,
      code: 'A.m',
      source: DataSource.CustomContent
    });
    expect(customContentId).toBe(1234);
  })

  it('save content property in dialog editor', async () => {
    setUp('contentKey=sequence&rendered.for=dialog-editor');

    const key = 'zenuml-sequence-macro-abc-123-body';
    const value = {code: 'a.foo'};

    mockApConfluence.saveMacro({uuid: 'abc-123'}, JSON.stringify(value));
    mockApConfluence.setContentProperty({key: key, version: {number: 1}, value});

    const payload = await macro.load();
    expect(payload.source).toBe(DataSource.ContentProperty);

    const diagram = {
      diagramType: DiagramType.Sequence,
      code: 'A.m',
      source: DataSource.ContentProperty
    };
    await macro.saveOnDialog(diagram);
    mockApConfluence.getContentProperty(key, (content) => expect(content).toEqual({version: {number: 2}, key, value: diagram}));
  })
})