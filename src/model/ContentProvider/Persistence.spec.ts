import {saveToPlatform} from "@/model/ContentProvider/Persistence";
import {NULL_DIAGRAM} from "@/model/Diagram/Diagram";

const mockSave = jest.fn(() => "mocked_custom_content_id");
const mockSaveMacro = jest.fn();
const mockIsInContentEdit = jest.fn();
const mockGetMacroData = () => {
  return {
    "uuid": "uuid_from_macro_data"
  }
};

jest.mock("@/model/ContentProvider/CustomContentStorageProvider", () => {
  return {
    CustomContentStorageProvider: class CustomContentStorageProvider {
      save = mockSave
    }
  }
})

jest.mock("@/model/ApWrapper2", () => {
  return class ApWrapper2 {
    getMacroData = mockGetMacroData
    saveMacro = mockSaveMacro
    isInContentEdit = mockIsInContentEdit
  }
})

jest.mock('@/utils/uuid', () => {
  return () => 'random_uuid'
})

describe('Persistence', function () {

  beforeEach(() => {
    mockSaveMacro.mockClear();
    mockIsInContentEdit.mockClear();
    mockSave.mockClear();
  });

  it('should save the diagram in content edit mode', async () => {
    mockIsInContentEdit.mockReturnValue(true);
    await saveToPlatform(NULL_DIAGRAM);
    expect(mockSave).toBeCalledWith(NULL_DIAGRAM);
    expect(mockSaveMacro).toBeCalledWith(expect.objectContaining({"uuid": "uuid_from_macro_data", "customContentId": "mocked_custom_content_id"}), '')
  })

  it('should not save macro in content view mode', async () => {
    mockIsInContentEdit.mockReturnValue(false);
    await saveToPlatform(NULL_DIAGRAM);
    expect(mockSave).toBeCalledWith(NULL_DIAGRAM);
    expect(mockSaveMacro.mock.calls.length).toBe(0);
  })
});