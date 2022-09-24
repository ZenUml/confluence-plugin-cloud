import MockAp from '@/model/MockAp'
import {ContentPropertyStorageProvider} from "@/model/ContentProvider/ContentPropertyStorageProvider";
import defaultContentProvider from "@/model/ContentProvider/CompositeContentProvider";
import ApWrapper2 from "@/model/ApWrapper2";

describe('CompositeContentProvider', () => {
  test('should fallback to content property when no custom content id is provided', async () => {
    const mockAp = new MockAp('contentId');
    mockAp.request = () => {
      throw Error('custom content or content property not found')
    }
    mockAp.confluence.setContentProperty({key: 'key', version: {number: 1}, value: 'abcd'}, () => {})
    mockAp.confluence.saveMacro({uuid: 'uuid'}, 'body')

    const contentProvider = defaultContentProvider(new ApWrapper2(mockAp));
    const {doc} = (await contentProvider.load());
    expect(doc.code).toBe('abcd');
  })

  test('should fallback to macro body when content property fails', async () => {
    const mockAp = new MockAp('contentId');
    mockAp.request = () => {
      throw Error('custom content or content property not found')
    }
    mockAp.confluence.saveMacro({}, 'body')

    const contentProvider = defaultContentProvider(new ApWrapper2(mockAp));
    const {doc} = (await contentProvider.load());
    expect(doc.code).toBe('body');
  })

})