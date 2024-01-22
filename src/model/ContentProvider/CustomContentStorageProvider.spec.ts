import MockAp from '@/model/MockAp'
import {CustomContentStorageProvider} from "@/model/ContentProvider/CustomContentStorageProvider";
import {NULL_DIAGRAM} from "@/model/Diagram/Diagram";
import ApWrapper2 from "@/model/ApWrapper2";

global.fetch = () => Promise.resolve(new Response("mock fetch success"));

describe('CustomContentStorageProvider', () => {
  test('cannot find custom content', async () => {
    const mockAp = new MockAp(undefined);
    const storageProvider = new CustomContentStorageProvider(new ApWrapper2(mockAp));
    const diagram = await storageProvider.getDiagram(undefined)
    expect(diagram).toStrictEqual(NULL_DIAGRAM);
  })

  test('custom content', async () => {
    const mockAp = new MockAp('abcd');
    mockAp.setCustomContent(123, {
      source: 'custom-content',
      code: 'A.method',
      styles:{"#A":{"backgroundColor":"#57d9a3"}}
    });

    const storageProvider = new CustomContentStorageProvider(new ApWrapper2(mockAp));
    const diagram = await storageProvider.getDiagram('123')
    expect(diagram).toStrictEqual({
      "id": "123",
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