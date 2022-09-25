import MockAp from '@/model/MockAp'
import {CustomContentStorageProvider} from "@/model/ContentProvider/CustomContentStorageProvider";
import {NULL_DIAGRAM} from "@/model/Diagram/Diagram";
import ApWrapper2 from "@/model/ApWrapper2";

describe('CustomContentStorageProvider', () => {
  test('cannot find custom content', async () => {
    const mockAp = new MockAp(undefined);
    const storageProvider = new CustomContentStorageProvider(new ApWrapper2(mockAp));
    const diagram = await storageProvider.getDiagram(undefined)
    expect(diagram).toStrictEqual(NULL_DIAGRAM);
  })

  test('custom content', async () => {
    const mockAp = new MockAp('abcd');

    const storageProvider = new CustomContentStorageProvider(new ApWrapper2(mockAp));
    const diagram = await storageProvider.getDiagram('fake-content-id')
    expect(diagram).toStrictEqual({
      "id": "fake-content-id",
      "isCopy": true,
      "code": "A.method",
      "source": "custom-content",
      "styles": {
        "#A": {
          "backgroundColor": "#57d9a3"
        }
      }
    });
  })

})