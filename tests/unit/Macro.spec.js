import MockApConfluence from '../../src/utils/MockApConfluence'
import Macro from '../../src/utils/Macro'

jest.mock('../../src/utils/uuid', () => {
  return () => 'random_uuid'
})
describe('Macro', () => {
  describe('load content when initialising', () => {
    it('if not initialised uses Example', async () => {
      const mockApConfluence = new MockApConfluence();
      const macro = new Macro(mockApConfluence);
      const code = (await macro.load()).code
      expect(code).toBe(macro.EXAMPLE)
    })

    test('or macro body', async () => {
      const mockApConfluence = new MockApConfluence();
      mockApConfluence.saveMacro({}, 'body')
      const macro = new Macro(mockApConfluence);
      const code = (await macro.load()).code;
      expect(code).toBe('body')
    })

    test('or content property', async () => {
      const mockApConfluence = new MockApConfluence();
      mockApConfluence.saveMacro({uuid: '1234'}, 'body')
      mockApConfluence.setContentProperty({key: 'zenuml-sequence-macro-1234-body', value: 'A.method'})
      const macro = new Macro(mockApConfluence);
      const code = (await macro.load()).code;
      expect(code).toBe('A.method')
    })

    test('if no macro data', async () => {
      const mockApConfluence = new MockApConfluence();
      mockApConfluence.saveMacro({}, 'body')
      mockApConfluence.setContentProperty({key: 'zenuml-sequence-macro-1234-body', value: 'A.method'})
      const macro = new Macro(mockApConfluence);
      const code = (await macro.load()).code;
      expect(code).toBe('body')
    })
  })

  describe('when submitting', () => {
    describe('E2E - should save macro data  and content property', () => {
      // TODO: check if saveMacroData({}) will remove macro-body
      it('for the first time', async () => {
        const mockApConfluence = new MockApConfluence();
        const macro = new Macro(mockApConfluence);
        await macro.load()
        const code = 'A.method';
        await macro.onSubmit(code)
        expect((await macro.load()).code).toBe(code)
        const contentProperty = await macro.getContentProperty();
        expect(contentProperty.value).toBe(code)
        expect(contentProperty.version.number).toBe(1)
      })

      it('for the next times', async () => {
        const mockApConfluence = new MockApConfluence();
        // mockApConfluence.saveMacro({uuid: '1234'}, 'body')
        // mockApConfluence.setContentProperty({key: '1234', value: 'A.method'})
        const macro = new Macro(mockApConfluence);
        const oldCode = 'A.method';
        await macro.load()
        await macro.onSubmit(oldCode)
        const newCode = 'B.method';
        await macro.load()
        await macro.onSubmit(newCode)
        expect((await macro.load()).code).toBe(newCode)
        const contentProperty = await macro.getContentProperty();
        expect(contentProperty.version.number).toBe(2)
      })
    })

    describe('Submit styles', () => {
      it('for styles', async () => {
        const mockApConfluence = new MockApConfluence();
        const macro = new Macro(mockApConfluence);
        await macro.load()

        await macro.onSubmit('A.method', {'selector': {backgroundColor: 'red'}})
        const zenData = await macro.load()

        expect(zenData.code).toBe('A.method')
      })
    })

    describe('Mocked data - should save macro data  and content property', () => {
      it('for the next times', async () => {
        const mockApConfluence = new MockApConfluence();
        mockApConfluence.saveMacro({uuid: '1234'}, 'body')
        mockApConfluence.setContentProperty({key: 'zenuml-sequence-macro-1234-body', value: 'A.method', version: {number: 100}})
        const macro = new Macro(mockApConfluence);
        // Must load first
        await macro.load()
        const newCode = 'B.method';
        await macro.onSubmit(newCode)
        expect((await macro.load()).code).toBe(newCode)
        const contentProperty = await macro.getContentProperty();
        expect(contentProperty.version.number).toBe(101)
      })
    })
  })
})