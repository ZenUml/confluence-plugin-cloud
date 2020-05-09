import Vue from "vue";
import Vuex from "vuex";
import {Store} from "vue-sequence";

import MockApConfluence from './MockApConfluence'
import Macro from '../../src/utils/Macro'

Vue.use(Vuex)

describe('Macro', () => {
  describe('when initialising', () => {
    describe('should load content', () => {
      describe('if not initialized', () => {
        test('use Example', () => {
          const mockApConfluence = new MockApConfluence();
          const store = new Vuex.Store(Store);
          const macro = new Macro(store);
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
})