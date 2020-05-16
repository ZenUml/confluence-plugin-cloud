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
    describe('E2E - should save macro data  and content property', () => {
      // TODO: check if saveMacroData({}) will remove macro-body
      it('for the first time', async () => {
        const mockApConfluence = new MockApConfluence();
        const macro = new Macro(mockApConfluence);
        const code = 'A.method';
        macro.onSubmit(code)
        expect(await macro.load()).toBe(code)
        expect(macro.key).toBe('random_uuid')
      })

      it('for the next times', async () => {
        const mockApConfluence = new MockApConfluence();
        // mockApConfluence.saveMacro({uuid: '1234'}, 'body')
        // mockApConfluence.setContentProperty({key: '1234', value: 'A.method'})
        const macro = new Macro(mockApConfluence);
        const oldCode = 'A.method';
        macro.onSubmit(oldCode)
        const newCode = 'B.method';
        macro.onSubmit(newCode)
        expect(await macro.load()).toBe(newCode)
        expect(macro.key).toBe('random_uuid')
      })
    })

    describe('Mocked data - should save macro data  and content property', () => {
      it('for the next times', async () => {
        const mockApConfluence = new MockApConfluence();
        mockApConfluence.saveMacro({uuid: '1234'}, 'body')
        mockApConfluence.setContentProperty({key: '1234', value: 'A.method'})
        const macro = new Macro(mockApConfluence);
        // Must load first
        await macro.load()
        const newCode = 'B.method';
        macro.onSubmit(newCode)
        expect(await macro.load()).toBe(newCode)
        expect(macro.key).toBe('1234')
      })
    })
  })
})