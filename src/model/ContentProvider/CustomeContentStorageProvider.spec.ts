import MockAp from '@/model/MockAp'
import {ContentPropertyStorageProvider} from "@/model/ContentProvider/ContentPropertyStorageProvider";
import {CustomContentStorageProvider} from "@/model/ContentProvider/CustomContentStorageProvider";
import {NULL_DIAGRAM} from "@/model/Diagram/Diagram";

describe('ContentPropertyStorageProvider', () => {
  test('cannot find custom content', async () => {
    const mockAp = new MockAp(undefined);
    const storageProvider = new CustomContentStorageProvider(mockAp);
    const diagram = await storageProvider.getContent(undefined)
    expect(diagram).toStrictEqual(NULL_DIAGRAM);
  })

  test('custom content', async () => {
    const mockAp = new MockAp('abcd');

    const storageProvider = new CustomContentStorageProvider(mockAp);
    const diagram = await storageProvider.getContent('fake-content-id')
    expect(diagram).toStrictEqual({
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