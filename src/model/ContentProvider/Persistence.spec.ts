import {saveToPlatform} from "@/model/ContentProvider/Persistence";
import {NULL_DIAGRAM} from "@/model/Diagram/Diagram";
import {vi} from "vitest";

global.fetch = () => Promise.resolve(new Response("mock fetch success"));

const mockSave = vi.fn(() => "mocked_custom_content_id");
const mockSaveMacro = vi.fn();
const mockIsInContentEditOrContentCreate = vi.fn();
const mockGetMacroData = () => {
  return {
    "uuid": "uuid_from_macro_data"
  }
};

vi.mock("@/model/ContentProvider/CustomContentStorageProvider", () => {
  return {
    CustomContentStorageProvider: class CustomContentStorageProvider {
      save = mockSave
    }
  }
})

vi.mock("@/model/ApWrapper2", () => {
  return {
    default: class ApWrapper2 {
      getMacroData = mockGetMacroData
      saveMacro = mockSaveMacro
      isInContentEditOrContentCreate = mockIsInContentEditOrContentCreate
    }
  }
})

vi.mock('@/utils/uuid', () => {
  return {
    default: 'random_uuid'
  }
})

describe('Persistence', function () {

  beforeEach(() => {
    mockSaveMacro.mockClear();
    mockIsInContentEditOrContentCreate.mockClear();
    mockSave.mockClear();
  });

  it('should save the diagram in content edit mode', async () => {
    mockIsInContentEditOrContentCreate.mockReturnValue(true);
    await saveToPlatform(NULL_DIAGRAM);
    expect(mockSave).toBeCalledWith(NULL_DIAGRAM);
    expect(mockSaveMacro).toBeCalledWith(expect.objectContaining({
      "uuid": "uuid_from_macro_data",
      "customContentId": "mocked_custom_content_id"
    }), '')
  })

  it('should not save macro in content view mode', async () => {
    mockIsInContentEditOrContentCreate.mockReturnValue(false);
    await saveToPlatform(NULL_DIAGRAM);
    expect(mockSave).toBeCalledWith(NULL_DIAGRAM);
    expect(mockSaveMacro.mock.calls.length).toBe(0);
  })
});
