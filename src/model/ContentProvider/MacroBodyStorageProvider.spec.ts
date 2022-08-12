import MockAp from '@/model/MockAp'
import {NULL_DIAGRAM} from "@/model/Diagram/Diagram";
import {MacroBodyStorageProvider} from "@/model/ContentProvider/MacroBodyStorageProvider";

describe('MacroBodyStorageProvider', () => {
  test('macro body is empty', async () => {
    const mockAp = new MockAp(undefined);
    const storageProvider = new MacroBodyStorageProvider(mockAp);
    const diagram = await storageProvider.getDiagram(undefined)
    expect(diagram).toStrictEqual(NULL_DIAGRAM);
  })

  test('macro body', async () => {
    const mockAp = new MockAp('abcd');
    mockAp.confluence.saveMacro({}, 'A.method')
    const storageProvider = new MacroBodyStorageProvider(mockAp);

    const diagram = await storageProvider.getDiagram('fake-content-id')
    expect(diagram).toStrictEqual({
      "code": "A.method",
      "diagramType": "sequence"
    });
  })

})