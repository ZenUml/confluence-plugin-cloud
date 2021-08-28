import SequenceDiagramLoader from "@/utils/SequenceDiagramLoader";
import MockApConfluence from '@/utils/MockApConfluence'
import Macro from '../../src/utils/Macro'

class MockApWrapper {
  _param;
  _code;
  setUp_saveMacro(param, code) {
    this._param = param;
    this._code = code;
  }

  async getMacroBody() {
    return this._code;
  }

  setup_saveContentProperty(content) {
    this._code = content.value;
  }
  // Note: we do not need key for this method.
  async getContentProperty2() {
    return {code: this._code};
  }
}

describe('SequenceDiagramLoader', () => {
  it('Load macro body', async () => {
    let mockApWrapper = new MockApWrapper();
    mockApWrapper.setUp_saveMacro(null, 'A.method1');
    let sequenceDiagramLoader = new SequenceDiagramLoader(mockApWrapper);
    let diagram = await sequenceDiagramLoader.load();
    expect(diagram.code).toBe('A.method1')
  })

  it('Load from content property by uuid from macro data', async () => {
    let mockApWrapper = new MockApWrapper();
    mockApWrapper.setUp_saveMacro({
      uuid: 'uuid_1234'
    });
    mockApWrapper.setup_saveContentProperty({key: 'zenuml-sequence-macro-1234-body', value: 'A.method'})
    let sequenceDiagramLoader = new SequenceDiagramLoader(mockApWrapper);
    let diagram = await sequenceDiagramLoader.load();
    expect(diagram.code).toBe('A.method')
  })

  it('Load from custom content by uuid from macro data', () => {

  })
})

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
})