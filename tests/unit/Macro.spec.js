import MockApConfluence from './MockApConfluence'
import Macro from '../../src/utils/Macro'

jest.mock('../../src/utils/uuid', () => {
  return () => 'random_uuid'
})
describe('Macro', () => {
  describe('when initialising', () => {
    describe('should load content', () => {
      describe('if not initialized', () => {
        it('uses Example', async () => {
          const mockApConfluence = new MockApConfluence();
          const macro = new Macro(mockApConfluence);
          const code = await macro.load();
          expect(code).toBe(macro.EXAMPLE)
        })
      })

      test('or macro body', async () => {
        const mockApConfluence = new MockApConfluence();
        mockApConfluence.saveMacro({}, 'body')
        const macro = new Macro(mockApConfluence);
        const code = await macro.load();
        expect(code).toBe('body')
      })

      test('or content property', async () => {
        const mockApConfluence = new MockApConfluence();
        mockApConfluence.saveMacro({uuid: '1234'}, 'body')
        mockApConfluence.setContentProperty({key: '1234', value: 'A.method'})
        const macro = new Macro(mockApConfluence);
        const code = await macro.load();
        expect(code).toBe('A.method')
      })

      test('if no macro data', async () => {
        const mockApConfluence = new MockApConfluence();
        mockApConfluence.saveMacro({}, 'body')
        mockApConfluence.setContentProperty({key: '1234', value: 'A.method'})
        const macro = new Macro(mockApConfluence);
        const code = await macro.load();
        expect(code).toBe('body')
      })
    })
  })

  describe('when submitting', () => {
    // TODO: check if saveMacroData({}) will remove macro-body
    it.skip('should save macro data  and content property', () => {
      const mockApConfluence = new MockApConfluence();
      const store = new Vuex.Store(Store);
      const macro = new Macro(mockApConfluence, store);
      const code = 'a';
      macro.onSubmit(code)
      mockApConfluence.getMacroData((data) => {
        expect(data.uuid).toBe('random_uuid')
        mockApConfluence.getContentProperty(data.uuid, (cp) => {
          expect(cp.value).toBe(code)
        })
      })
    })
  })
})