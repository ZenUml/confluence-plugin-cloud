<template>
  <!-- screen-capture-content class is used in Attachment.js to select the node. -->
  <div class="generic viewer mx-1 pr-2">
    <Debug/>

    <error-boundary>
    <div style="width: fit-content;">
      <div class="relative pb-8 m-1" :class="{'w-full': wide, 'min-w-[300px]': !wide}">
        <div v-show="isDisplayMode" class="w-full"
            style="overflow: hidden; box-sizing: border-box; white-space: nowrap; text-align: left; z-index: 999; background-color: rgb(238, 238, 238); height: 26px; left: 0; border: 1px solid rgb(208, 208, 208);">
          <div v-show="isLite" style="display: inline-block; position: relative; padding: 3px 6px 0; vertical-align: top; font-family: Helvetica, Arial; font-size: 12px; top: 4px; cursor: default; color: rgb(0, 0, 0); opacity: 0.7;">
            Lite
          </div>
          <div title="Edit" @click="edit"
               style="border-right: 1px solid rgb(208, 208, 208); padding: 3px 6px; display: inline-block; cursor: pointer; background-color: rgb(221, 221, 221);">
            <img border="0"
                 src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVBAMAAABbObilAAAAD1BMVEUAAAAAAAAQEBBycnIgICBqwj3hAAAAAXRSTlMAQObYZgAAADlJREFUCNdjoBwoChrAmCyGggJwYWVBBSiTSVDICKFa0AEuLCiEJKyAX5gBSZgBSZgBKGwMBKQ7HAAWzQSfKKAyBgAAAABJRU5ErkJggg=="
                 class="geAdaptiveAsset" style="width: 18px; opacity: 0.6;">
          </div>
          <div title="Fullscreen" @click="fullscreen"
               style="border-right: 1px solid rgb(208, 208, 208); padding: 3px 6px; display: inline-block; cursor: pointer; background-color: rgb(238, 238, 238);">
            <img border="0"
                 src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMyA1djRoMlY1aDRWM0g1Yy0xLjEgMC0yIC45LTIgMnptMiAxMEgzdjRjMCAxLjEuOSAyIDIgMmg0di0ySDV2LTR6bTE0IDRoLTR2Mmg0YzEuMSAwIDItLjkgMi0ydi00aC0ydjR6bTAtMTZoLTR2Mmg0djRoMlY1YzAtMS4xLS45LTItMi0yeiIvPjwvc3ZnPg=="
                 class="geAdaptiveAsset" style="width: 18px; opacity: 0.6;">
          </div>
          <div title="Fullscreen" @click="reload"
               style="border-right: 1px solid rgb(208, 208, 208); padding: 3px 6px; display: inline-block; cursor: pointer; background-color: rgb(238, 238, 238);">
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAABdklEQVR4nO2Wy0oDUQyGP9dutSrUQkV9m6KCVaogLhUvDH0Fn0LEy0a8oKKgvou3vRfUjRvrZSQQ4TC2nvFMWlz0h8Awyck/ySQngTb+IQpABJwBN8CLyiVwDiwC/daEW0ANiD0iNmsWHzAOPDtOt4EKMAB0qgzqux3n4+RMKZS0D/hQR4cauQ9F4EDPfAJzIcQdwAowE3A2UuJ3YDSEPAuqGvkj0N1q8hMl3/AZllWsUNCCe/0talHcq1im5rvYokYG+04/yrMVKk5n/MBEncvAKuVD6u8qqegC7uoQPwA9GQjdDMYJ2fMZHGcgloBuGwSUSxpfq1LSY4GRtL/wSJWT2CFV0VabUNWp2jTnNHzekLycpks2NWpJe0uRA558t02zMKYjTUbbcsD5WR2pMlr/jHkljvW+lSHvQ1F7P9YlopdAlJy013S9mQKGE6vPNLALvDkzWNamTMgDqymXPemGdeOOQJwt6Hp7kVhvT4Ela8I2sMAXUBKRy27a3h0AAAAASUVORK5CYII="
                 class="geAdaptiveAsset" style="width: 18px; opacity: 0.6;">
          </div>

          <div class="right">
            <slot name="title"></slot>
          </div>
        </div>
        <div class="flex justify-center screen-capture-content">
          <div class="mr-8" :class="{'w-full': wide}">
            <slot></slot>
          </div>
        </div>
      </div>
    </div>
    </error-boundary>
  </div>
</template>

<script>
import {mapState, mapGetters} from "vuex";
import EventBus from '../../EventBus'
import Debug from '@/components/Debug/Debug.vue'
import ErrorBoundary from "@/components/ErrorBoundary";
import globals from '@/model/globals';
import {DataSource, NULL_DIAGRAM} from "@/model/Diagram/Diagram";
import defaultContentProvider from "@/model/ContentProvider/CompositeContentProvider";
import AP from "@/model/AP";
import ApWrapper2 from "@/model/ApWrapper2";

export default {
  name: "GenericViewer",
  props: ['wide'],
  data: () => {
    return {
      doc: NULL_DIAGRAM,
      canUserEdit: true,
      rawStyles: {},
    }
  },
  components: {
    Debug,
    ErrorBoundary
  },
  computed: {
    // We use {} instead of [] to get type checking
    ...mapState({diagramType: 'diagramType', diagram: 'diagram'}),
    ...mapGetters({isDisplayMode: 'isDisplayMode'}),
    isLite() {
      return globals.apWrapper.isLite();
    },
    styles() {
      const statements = Object.keys(this.rawStyles)
          .map(k => `${k} .participant { background: ${(this.rawStyles)[k].backgroundColor}; }`)
          .join('\n');
      return `<style> ${statements}</style>`;
    },
  },
  async created() {
    const compositeContentProvider = defaultContentProvider(new ApWrapper2(AP));
    const {doc} = await compositeContentProvider.load();
    // this.$store.state.diagram = doc;
    this.doc = doc;
    await globals.apWrapper.initializeContext();
    const canUserEditPage = await globals.apWrapper.canUserEdit();
    const storedWithCustomContent = this.doc?.source === DataSource.CustomContent;
    const notCopy = !this.doc?.isCopy;
    this.canUserEdit = canUserEditPage && storedWithCustomContent && notCopy;
  },
  methods: {
    edit() {
      console.debug('edit');
      EventBus.$emit('edit');
    },
    fullscreen() {
      console.debug('fullscreen');
      EventBus.$emit('fullscreen');
    },
    reload() {
      console.debug('reload');
      EventBus.$emit('reload');
    },
  },
}
</script>
