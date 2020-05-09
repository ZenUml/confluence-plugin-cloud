import Vue from "vue";
import Vuex from "vuex";
import {Store} from "vue-sequence";

import MockApConfluence from './MockApConfluence'
import Macro from '../../src/utils/Macro'

Vue.use(Vuex)
jest.mock('../../src/utils/uuid', () => {
  return () => 'random_uuid'
})
describe('Macro', () => {
  describe('when initialising', () => {
    describe('should load content', () => {
      describe('if not initialized', () => {
        test('use Example', () => {
          const mockApConfluence = new MockApConfluence();
          const store = new Vuex.Store(Store);
          const macro = new Macro(mockApConfluence, store);
          mockApConfluence.getMacroData(function (data) {
            macro.initialize(data);
            expect(store.state.code).toBe(macro.EXAMPLE)
          })
        })
      })

      test('or macro body', () => {

      })
    })
  })
  describe('when submitting', () => {
    // TODO: check if saveMacroData({}) will remove macro-body
    it('should save macro data  and content property', () => {
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