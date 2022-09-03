import {AtlasDocFormat} from "@/model/page/AtlasDocFormat";
import AtlasDocExample1 from './AtlasDocExample1';

describe('AtlasDocFormat', () => {
  it('should get all macros', () => {
    const doc = new AtlasDocFormat(JSON.stringify(AtlasDocExample1));
    expect(doc.getMacros().length).toBe(6);
  });
  
  it('should get macros by key', () => {
    const doc = new AtlasDocFormat(JSON.stringify(AtlasDocExample1));
    expect(doc.getMacros('zenuml-sequence-macro').length).toBe(2);
  });
});