import MockApConfluence from '../../src/utils/MockApConfluence'
import Macro from '../../src/utils/Macro'

jest.mock('../../src/utils/uuid', () => {
  return () => 'random_uuid'
})
describe('Macro', () => {
  describe('load content when initialising', () => {
    // no data, no body, no prop
    it('if not initialised uses Example', async () => {
      const mockApConfluence = new MockApConfluence();
      const macro = new Macro(mockApConfluence);
      const code = (await macro.load()).code
      expect(code).toBe(macro.EXAMPLE)
    })

    // data
    test('data, no body or property', async () => {
      const mockApConfluence = new MockApConfluence();
      mockApConfluence.saveMacro({uuid: 1234})
      const macro = new Macro(mockApConfluence);
      const code = (await macro.load()).code;
      expect(code).toBe(macro.EXAMPLE)
    })

    // body
    test('or macro body', async () => {
      const mockApConfluence = new MockApConfluence();
      mockApConfluence.saveMacro({}, 'body')
      const macro = new Macro(mockApConfluence);
      const code = (await macro.load()).code;
      expect(code).toBe('body')
    })

    // data, prop
    test('or content property', async () => {
      const mockApConfluence = new MockApConfluence();
      mockApConfluence.saveMacro({uuid: '1234'})
      mockApConfluence.setContentProperty({key: 'zenuml-sequence-macro-1234-body', value: 'A.method'})
      const macro = new Macro(mockApConfluence);
      const code = (await macro.load()).code;
      expect(code).toBe('A.method')
    })

    // data, prop
    test('or content property, but uuid from window.location.search', async () => {
      delete global.window.location;
      global.window = Object.create(window);
      global.window.location = {
        search: '?uuid=1234',
      };
      const mockApConfluence = new MockApConfluence();
      mockApConfluence.setContentProperty({key: 'zenuml-sequence-macro-1234-body', value: 'A.method'})
      const macro = new Macro(mockApConfluence);
      const code = (await macro.load()).code;
      expect(code).toBe('A.method')
      global.window.location = {
        search: '',
      };
    })

    // data, body
    test('or content property', async () => {
      const mockApConfluence = new MockApConfluence();
      mockApConfluence.saveMacro({uuid: '1234'}, 'body')
      const macro = new Macro(mockApConfluence);
      const code = (await macro.load()).code;
      expect(code).toBe('body')
    })

    // data, body, prop
    test('or content property', async () => {
      const mockApConfluence = new MockApConfluence();
      mockApConfluence.saveMacro({uuid: '1234'}, 'body')
      mockApConfluence.setContentProperty({key: 'zenuml-sequence-macro-1234-body', value: 'A.method'})
      const macro = new Macro(mockApConfluence);
      const code = (await macro.load()).code;
      expect(code).toBe('A.method')
    })

    // body, prop
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
        await macro.save(code)
        expect((await macro.load()).code).toBe(code)
        const contentProperty = await macro.getContentProperty();
        expect(contentProperty.value.code).toBe(code)
        expect(contentProperty.version.number).toBe(1)
        const data = await macro.getMacroData()
        expect(data.uuid).toBe('random_uuid')
        expect(data.updatedAt).toBeDefined()
      })

      it('for the next times', async () => {
        const mockApConfluence = new MockApConfluence();
        // mockApConfluence.saveMacro({uuid: '1234'}, 'body')
        // mockApConfluence.setContentProperty({key: '1234', value: 'A.method'})
        const macro = new Macro(mockApConfluence);
        await macro.load()
        const oldCode = 'A.method';
        await macro.save(oldCode)
        await macro.load()
        const newCode = 'B.method';
        await macro.save(newCode)
        expect((await macro.load()).code).toBe(newCode)
        const contentProperty = await macro.getContentProperty();
        expect(contentProperty.version.number).toBe(2)
        const data = await macro.getMacroData()
        expect(data.uuid).toBe('random_uuid')
        expect(data.updatedAt).toBeDefined()
        const body = await macro.getMacroBody()
        expect(body).toBe('B.method')
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
        await macro.save(newCode)
        expect((await macro.load()).code).toBe(newCode)
        const contentProperty = await macro.getContentProperty();
        expect(contentProperty.version.number).toBe(101)
      })
    })
  })
})