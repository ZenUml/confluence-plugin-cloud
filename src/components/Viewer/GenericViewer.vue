<template>
<!-- screen-capture-content class is used in Attachment.js to select the node. -->
<div class="generic viewer mx-1 pr-2">
  <Debug />
  <error-boundary>

  <div :class="{'w-full': wide, 'w-fit': !wide, 'mx-auto': true}">
    <div class="frame relative pb-8 m-1" :class="{'w-full': wide, 'min-w-[300px]': !wide}">
      <div class="header flex" :class="{flex: isDisplayMode, hidden: !isDisplayMode}">
        <div class="left">
          <div class="actions flex" :class="{flex: isDisplayMode, hidden: !isDisplayMode}">
            <div v-show="isLite">
              <div class="p-2 text-xs font-bold leading-none text-gray-300 bg-gray-100 rounded">Lite</div>
            </div>
            <div v-show="isEmbedded">
              <div class="p-2 text-xs font-bold leading-none text-gray-300 bg-gray-100 rounded cursor-help" title="content is embedded from another page">Embedded</div>
            </div>
            <button @click="edit" v-show="showEdit" class="p-2 rounded hover:bg-gray-300">
              <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M0.0200123 15.23C-0.0130986 15.392 -0.00552525 15.5597 0.0420541 15.718C0.0896335 15.8764 0.175734 16.0205 0.292649 16.1374C0.409564 16.2543 0.553645 16.3404 0.711994 16.388C0.870343 16.4355 1.03802 16.4431 1.20001 16.41L5.01001 15.63L0.800013 11.42L0.0200123 15.23ZM5.94101 12.61L3.82101 10.49L12.306 2H12.308L14.429 4.121L5.94001 12.611L5.94101 12.61ZM15.844 2.707L13.724 0.585004C13.5381 0.399083 13.3173 0.251699 13.0743 0.15131C12.8314 0.0509205 12.5709 -0.000498213 12.308 3.63842e-06C11.796 3.63842e-06 11.284 0.195004 10.893 0.585004L1.13601 10.343L6.08601 15.293L15.843 5.535C16.218 5.15995 16.4286 4.65133 16.4286 4.121C16.4286 3.59068 16.218 3.08206 15.843 2.707H15.844Z" fill="#47566F"/>
              </svg>
            </button>
            <button @click="fullscreen" class="p-2 rounded hover:bg-gray-300">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M2 14H5C5.26522 14 5.51957 14.1054 5.70711 14.2929C5.89464 14.4804 6 14.7348 6 15C6 15.2652 5.89464 15.5196 5.70711 15.7071C5.51957 15.8946 5.26522 16 5 16H2C1.46957 16 0.960859 15.7893 0.585786 15.4142C0.210714 15.0391 0 14.5304 0 14V11C0 10.7348 0.105357 10.4804 0.292893 10.2929C0.48043 10.1054 0.734784 10 1 10C1.26522 10 1.51957 10.1054 1.70711 10.2929C1.89464 10.4804 2 10.7348 2 11V14ZM14 16H11C10.7348 16 10.4804 15.8946 10.2929 15.7071C10.1054 15.5196 10 15.2652 10 15C10 14.7348 10.1054 14.4804 10.2929 14.2929C10.4804 14.1054 10.7348 14 11 14H14V11C14 10.7348 14.1054 10.4804 14.2929 10.2929C14.4804 10.1054 14.7348 10 15 10C15.2652 10 15.5196 10.1054 15.7071 10.2929C15.8946 10.4804 16 10.7348 16 11V14C16 14.5304 15.7893 15.0391 15.4142 15.4142C15.0391 15.7893 14.5304 16 14 16ZM2 0H5C5.26522 0 5.51957 0.105357 5.70711 0.292893C5.89464 0.48043 6 0.734784 6 1C6 1.26522 5.89464 1.51957 5.70711 1.70711C5.51957 1.89464 5.26522 2 5 2H2V5C2 5.26522 1.89464 5.51957 1.70711 5.70711C1.51957 5.89464 1.26522 6 1 6C0.734784 6 0.48043 5.89464 0.292893 5.70711C0.105357 5.51957 0 5.26522 0 5V2C0 1.46957 0.210714 0.960859 0.585786 0.585786C0.960859 0.210714 1.46957 0 2 0ZM14 2H11C10.7348 2 10.4804 1.89464 10.2929 1.70711C10.1054 1.51957 10 1.26522 10 1C10 0.734784 10.1054 0.48043 10.2929 0.292893C10.4804 0.105357 10.7348 0 11 0H14C14.5304 0 15.0391 0.210714 15.4142 0.585786C15.7893 0.960859 16 1.46957 16 2V5C16 5.26522 15.8946 5.51957 15.7071 5.70711C15.5196 5.89464 15.2652 6 15 6C14.7348 6 14.4804 5.89464 14.2929 5.70711C14.1054 5.51957 14 5.26522 14 5V2Z" fill="#47566F"/>
              </svg>
            </button>
            <button v-show="!isLite" @click="downloadPng" class="flex justify-center items-center p-2 rounded hover:bg-gray-300" title="Download PNG">
              <svg width="20" height="20" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="0.5" y="0.44043" width="15" height="13.125" rx="1.875" fill="#42526E"/>
                <path d="M2.63941 8.03931V7.27576H3.58548C3.79692 7.27576 3.96137 7.22174 4.07884 7.11371C4.19812 7.00568 4.25775 6.84912 4.25775 6.64404V6.63855C4.25775 6.43164 4.19812 6.27509 4.07884 6.16888C3.96137 6.06268 3.79692 6.00958 3.58548 6.00958H2.63941V5.23505H3.82674C4.1177 5.23505 4.3707 5.29364 4.58576 5.41083C4.80081 5.52618 4.96708 5.68915 5.08454 5.89972C5.20382 6.10846 5.26346 6.35474 5.26346 6.63855V6.64404C5.26346 6.92603 5.20382 7.1723 5.08454 7.38287C4.96708 7.59161 4.80081 7.75366 4.58576 7.86902C4.3707 7.98254 4.1177 8.03931 3.82674 8.03931H2.63941ZM2.14062 9.19836V5.23505H3.13549V9.19836H2.14062Z" fill="#F5F5F5"/>
                <path d="M5.99537 9.19836V5.23505H6.78963L8.68176 7.81958L7.97696 7.46252H8.47032V5.23505H9.41368V9.19836H8.62484L6.72728 6.59186L7.43209 6.95166H6.93873V9.19836H5.99537Z" fill="#F5F5F5"/>
                <path d="M12.0811 9.30548C11.6799 9.30548 11.3356 9.22217 11.0483 9.05554C10.7609 8.88708 10.5396 8.64722 10.3841 8.33594C10.2305 8.02283 10.1537 7.64929 10.1537 7.21533V7.20984C10.1537 6.78137 10.2305 6.4115 10.3841 6.10022C10.5378 5.78894 10.7564 5.54907 11.0402 5.38062C11.3257 5.21216 11.6636 5.12793 12.054 5.12793C12.3739 5.12793 12.6603 5.18652 12.9133 5.30371C13.1663 5.4209 13.3714 5.58295 13.5287 5.78986C13.6877 5.99493 13.7835 6.23206 13.816 6.50122L13.8187 6.52869H12.8374L12.832 6.50397C12.7904 6.33734 12.6992 6.20551 12.5582 6.10846C12.419 6.01141 12.251 5.96289 12.054 5.96289C11.8697 5.96289 11.7106 6.01324 11.5769 6.11395C11.445 6.21283 11.3438 6.35474 11.2733 6.53967C11.2028 6.72278 11.1676 6.9425 11.1676 7.19885V7.20435C11.1676 7.46436 11.2055 7.68958 11.2814 7.88C11.3591 8.0686 11.4676 8.21417 11.6067 8.31671C11.7477 8.41925 11.913 8.47052 12.1028 8.47052C12.2528 8.47052 12.3856 8.44305 12.5013 8.38812C12.6187 8.33136 12.7109 8.25262 12.7778 8.15192C12.8464 8.04938 12.8844 7.93036 12.8916 7.79486L12.897 7.72894H12.1841V7.03406H13.8594V7.54767C13.8594 7.91205 13.788 8.22516 13.6452 8.487C13.5025 8.74884 13.2982 8.95117 13.0326 9.09399C12.7687 9.23499 12.4516 9.30548 12.0811 9.30548Z" fill="#F5F5F5"/>
              </svg>
              <span class="bg-blue-100 text-blue-800 text-xs font-bold ms-0.5 px-1 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">New</span>
            </button>
<!--            https://zenuml.com/confluence-migration-instructions/-->
            <a v-show="isLite" @click="trackUpgradeEvent"
               target="_blank" href="https://zenuml.com/confluence-migration-instructions/"
               class="flex justify-center items-center p-2 rounded hover:bg-gray-300" title="Download PNG">
              <svg width="20" height="20" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="0.5" y="0.44043" width="15" height="13.125" rx="1.875" fill="#42526E"/>
                <path d="M2.63941 8.03931V7.27576H3.58548C3.79692 7.27576 3.96137 7.22174 4.07884 7.11371C4.19812 7.00568 4.25775 6.84912 4.25775 6.64404V6.63855C4.25775 6.43164 4.19812 6.27509 4.07884 6.16888C3.96137 6.06268 3.79692 6.00958 3.58548 6.00958H2.63941V5.23505H3.82674C4.1177 5.23505 4.3707 5.29364 4.58576 5.41083C4.80081 5.52618 4.96708 5.68915 5.08454 5.89972C5.20382 6.10846 5.26346 6.35474 5.26346 6.63855V6.64404C5.26346 6.92603 5.20382 7.1723 5.08454 7.38287C4.96708 7.59161 4.80081 7.75366 4.58576 7.86902C4.3707 7.98254 4.1177 8.03931 3.82674 8.03931H2.63941ZM2.14062 9.19836V5.23505H3.13549V9.19836H2.14062Z" fill="#F5F5F5"/>
                <path d="M5.99537 9.19836V5.23505H6.78963L8.68176 7.81958L7.97696 7.46252H8.47032V5.23505H9.41368V9.19836H8.62484L6.72728 6.59186L7.43209 6.95166H6.93873V9.19836H5.99537Z" fill="#F5F5F5"/>
                <path d="M12.0811 9.30548C11.6799 9.30548 11.3356 9.22217 11.0483 9.05554C10.7609 8.88708 10.5396 8.64722 10.3841 8.33594C10.2305 8.02283 10.1537 7.64929 10.1537 7.21533V7.20984C10.1537 6.78137 10.2305 6.4115 10.3841 6.10022C10.5378 5.78894 10.7564 5.54907 11.0402 5.38062C11.3257 5.21216 11.6636 5.12793 12.054 5.12793C12.3739 5.12793 12.6603 5.18652 12.9133 5.30371C13.1663 5.4209 13.3714 5.58295 13.5287 5.78986C13.6877 5.99493 13.7835 6.23206 13.816 6.50122L13.8187 6.52869H12.8374L12.832 6.50397C12.7904 6.33734 12.6992 6.20551 12.5582 6.10846C12.419 6.01141 12.251 5.96289 12.054 5.96289C11.8697 5.96289 11.7106 6.01324 11.5769 6.11395C11.445 6.21283 11.3438 6.35474 11.2733 6.53967C11.2028 6.72278 11.1676 6.9425 11.1676 7.19885V7.20435C11.1676 7.46436 11.2055 7.68958 11.2814 7.88C11.3591 8.0686 11.4676 8.21417 11.6067 8.31671C11.7477 8.41925 11.913 8.47052 12.1028 8.47052C12.2528 8.47052 12.3856 8.44305 12.5013 8.38812C12.6187 8.33136 12.7109 8.25262 12.7778 8.15192C12.8464 8.04938 12.8844 7.93036 12.8916 7.79486L12.897 7.72894H12.1841V7.03406H13.8594V7.54767C13.8594 7.91205 13.788 8.22516 13.6452 8.487C13.5025 8.74884 13.2982 8.95117 13.0326 9.09399C12.7687 9.23499 12.4516 9.30548 12.0811 9.30548Z" fill="#F5F5F5"/>
              </svg>

              <span class="bg-yellow-100 text-yellow-800 text-xs font-bold ms-0.5 px-1 py-0.5 rounded dark:bg-yellow-800/30 dark:text-yellow-500">Unlock</span>
            </a>
            <send-feedback/>
          </div>
        </div>
        <div class="right">
          <slot name="title"></slot>
        </div>
      </div>
      <div class="flex justify-center screen-capture-content">
        <div :class="{'w-full': wide, 'mr-8': !wide}">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
  </error-boundary>
</div>
</template>

<script>
import {trackEvent} from "@/utils/window";
import { saveAs } from 'file-saver';

import {mapState, mapGetters} from "vuex";
import EventBus from '../../EventBus'
import Debug from '@/components/Debug/Debug.vue'
import ErrorBoundary from "@/components/ErrorBoundary.vue";
import globals from '@/model/globals';
import {DataSource} from "@/model/Diagram/Diagram";
import {getUrlParam} from '@/utils/window';
import SendFeedback from "@/components/SendFeedback.vue";
import * as htmlToImage from "html-to-image";

export default {
  name: "GenericViewer",
  props: ['wide'],
  data: () => {
    return {
      canUserEdit: true,
    }
  },
  components: {
    SendFeedback,
    Debug,
    ErrorBoundary
  },
  computed: {
    // We use {} instead of [] to get type checking
    ...mapState({diagramType: state => state.diagram.diagramType, diagram: state => state.diagram }),
    ...mapGetters({isDisplayMode: 'isDisplayMode'}),
    isLite() {
      return globals.apWrapper.isLite();
    },
    isEmbedded() {
      return getUrlParam('xdm_c')?.includes('channel-com.zenuml.confluence-addon__zenuml-embed');
    },
    showEdit() {
      let isCustomContent = this.diagram.source === DataSource.CustomContent;
      let isNotCopy = !this.diagram.isCopy;
      console.debug('showEdit', this.canUserEdit, isCustomContent, isNotCopy);
      return this.canUserEdit && isCustomContent && isNotCopy;
    }
  },
  async mounted() {
    try {
      this.canUserEdit = await globals.apWrapper.canUserEdit();
      console.debug('canUserEdit', this.canUserEdit);
    } catch (e) {
      console.warn('canUserEdit', this.canUserEdit);
    }
  },
  methods: {
    edit() {
      trackEvent('edit', 'click', 'editing');
      EventBus.$emit('edit');
    },
    fullscreen() {
      trackEvent('fullscreen', 'click', 'viewing');
      EventBus.$emit('fullscreen');
    },
    trackUpgradeEvent() {
      trackEvent('download_png_lite_upgrade', 'click', 'viewing');
    },
    async downloadPng() {
      trackEvent('download_png', 'click', 'viewing');
      let node = null;
      const parent = document.querySelector('.screen-capture-content');

      if (parent) {
        node = parent.querySelector('.zenuml.sequence-diagram');
      }

      if (!node) {
        node = parent;
      }
      const png = await htmlToImage.toBlob(node, {backgroundColor: 'white'});
      saveAs(png, 'zenuml-for-confluence.png');
    },
  },
}
</script>

<style scoped>
.frame {
  display: inline-block;
  border: #E6E6E6 1px solid;
  border-radius: 3px;
}
.header {
  border-bottom: #E6E6E6 1px solid;
  margin-bottom: 4px;
  padding: 4px;
}
</style>
