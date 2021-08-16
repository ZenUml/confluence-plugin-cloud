import MockApConfluence from '../../src/utils/MockApConfluence'
import Macro from '../../src/utils/Macro'

let mockApConfluence;
let macro;

jest.mock('../../src/utils/uuid', () => {
  return () => 'random_uuid'
})
describe('Macro', () => {
  beforeEach(() => {
    mockApConfluence = new MockApConfluence();
    const mockAp = {
      confluence: mockApConfluence,
      request: () => {},
      navigator: {
        getLocation: (cb) => { cb(
          {
            context: {
              contentId: 'abcd'
            }
          }
        ) }
      }
    };
    macro = new Macro(mockAp);
  });

  describe('load content when initialising', () => {
    // no data, no body, no prop
    it('if not initialised uses Example', async () => {
      const code = (await macro.load()).code
      expect(code).toBe(macro.EXAMPLE)
    })

    // data
    test('data, no body or property', async () => {
      mockApConfluence.saveMacro({uuid: 1234})
      const code = (await macro.load()).code;
      expect(code).toBe(macro.EXAMPLE)
    })

    // body
    test('or macro body', async () => {
      mockApConfluence.saveMacro({}, 'body')
      const code = (await macro.load()).code;
      expect(code).toBe('body')
    })

    // data, prop
    test('or content property', async () => {
      mockApConfluence.saveMacro({uuid: '1234'})
      mockApConfluence.setContentProperty({key: 'zenuml-sequence-macro-1234-body', value: 'A.method'})
      const code = (await macro.load()).code;
      expect(code).toBe('A.method')
    })

    test('or content property as object {code, styles}', async () => {
      mockApConfluence.saveMacro({uuid: '1234'})
      mockApConfluence.setContentProperty({key: 'zenuml-sequence-macro-1234-body', value: {code: 'A.method', styles: {'#A': { backgroundColor: '#FFF'}}}})
      const code = (await macro.load()).code;
      expect(code).toBe('A.method')
      const styles = (await macro.load()).styles
      expect(styles['#A'].backgroundColor).toBe('#FFF')
    })

    // data, prop
    test('or content property, but uuid from window.location.search', async () => {
      delete global.window.location;
      global.window = Object.create(window);
      global.window.location = {
        search: '?uuid=1234',
      };
      mockApConfluence.setContentProperty({key: 'zenuml-sequence-macro-1234-body', value: 'A.method'})
      const code = (await macro.load()).code;
      expect(code).toBe('A.method')
      global.window.location = {
        search: '',
      };
    })

    // data, body
    test('or content property', async () => {
      mockApConfluence.saveMacro({uuid: '1234'}, 'body')
      const code = (await macro.load()).code;
      expect(code).toBe('body')
    })

    // data, body, prop
    test('or content property', async () => {
      mockApConfluence.saveMacro({uuid: '1234'}, 'body')
      mockApConfluence.setContentProperty({key: 'zenuml-sequence-macro-1234-body', value: 'A.method'})
      const code = (await macro.load()).code;
      expect(code).toBe('A.method')
    })

    // body, prop
    test('if no macro data', async () => {
      mockApConfluence.saveMacro({}, 'body')
      mockApConfluence.setContentProperty({key: 'zenuml-sequence-macro-1234-body', value: 'A.method'})
      const code = (await macro.load()).code;
      expect(code).toBe('body')
    })
  })

  describe('when submitting', () => {
    describe('E2E - should save macro data  and content property', () => {
      // TODO: check if saveMacroData({}) will remove macro-body
      it('for the first time', async () => {
        await macro.load()
        const code = 'A.method';
        const styles = {'#A': { backgroundColor: '#FFF'}}
        await macro.save(code, styles)
        expect((await macro.load()).code).toBe(code)
        // Style is only available in custom content
        // expect((await macro.load()).styles['#A'].backgroundColor).toBe('#FFF')
        // const contentProperty = await macro.getContentProperty('random_uuid');
        // expect(contentProperty.value.code).toBe(code)
        // expect(contentProperty.version.number).toBe(1)
        const data = await macro._confluenceWrapper.getMacroData()
        expect(data.uuid).toBe('random_uuid')
        expect(data.updatedAt).toBeDefined()
      })

      it('for the next times', async () => {
        // mockApConfluence.saveMacro({uuid: '1234'}, 'body')
        // mockApConfluence.setContentProperty({key: '1234', value: 'A.method'})
        await macro.load()
        const oldCode = 'A.method';
        await macro.save(oldCode)
        await macro.load()
        const newCode = 'B.method';
        await macro.save(newCode)
        expect((await macro.load()).code).toBe(newCode)
        const data = await macro._confluenceWrapper.getMacroData()
        expect(data.uuid).toBe('random_uuid')
        expect(data.updatedAt).toBeDefined()
        const body = await macro._confluenceWrapper.getMacroBody()
        expect(body).toBe('B.method')
      })
    })

  })
})