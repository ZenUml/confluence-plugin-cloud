import MockAp from '@/model/MockAp'
import {ContentPropertyStorageProvider} from "@/model/ContentProvider/ContentPropertyStorageProvider";
import defaultCompositeContentProvider from "@/model/ContentProvider/CompositeContentProvider";

describe('ContentPropertyStorageProvider', () => {

  test('should fallback to macro body when content property fails', async () => {
    const mockAp = new MockAp('contentId');
    mockAp.request = () => {
      throw Error('custom content or content property not found')
    }
    mockAp.confluence.saveMacro({}, 'body')

    const contentProvider = defaultCompositeContentProvider(mockAp);
    const {content} = (await contentProvider.load());
    expect(content.code).toBe('body');
  })

})