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
            <div v-show="isLite" class="flex justify-center items-center">
              <span class="p-2 text-xs font-bold leading-none text-gray-300 bg-gray-100 rounded">Lite</span>
            </div>
            <div v-show="isEmbedded" class="flex justify-center items-center">
              <span class="p-2 text-xs font-bold leading-none text-gray-300 bg-gray-100 rounded cursor-help" title="content is embedded from another page">Embedded</span>
            </div>
            <button @click="edit" v-show="showEdit" class="flex justify-center items-center p-2 rounded hover:bg-gray-300">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_2722_3607)">
                  <path d="M1.875 16.1243L6.03695 14.5235C6.30316 14.4211 6.43626 14.3699 6.56079 14.3031C6.6714 14.2437 6.77685 14.1752 6.87603 14.0982C6.98769 14.0116 7.08853 13.9107 7.29021 13.709L15.75 5.24925C16.5784 4.42082 16.5784 3.07768 15.75 2.24925C14.9216 1.42082 13.5784 1.42082 12.75 2.24925L4.29021 10.709C4.08853 10.9107 3.98769 11.0116 3.90104 11.1232C3.82408 11.2224 3.75555 11.3279 3.69618 11.4385C3.62933 11.563 3.57814 11.6961 3.47575 11.9623L1.875 16.1243ZM1.875 16.1243L3.41859 12.111C3.52905 11.8238 3.58428 11.6802 3.67901 11.6144C3.76179 11.5569 3.86423 11.5352 3.96322 11.5541C4.0765 11.5757 4.18529 11.6845 4.40286 11.9021L6.09718 13.5964C6.31475 13.814 6.42354 13.9228 6.44517 14.036C6.46408 14.135 6.44234 14.2375 6.38486 14.3203C6.31908 14.415 6.17549 14.4702 5.8883 14.5807L1.875 16.1243Z" stroke="#475467" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </g>
                <defs>
                  <clipPath id="clip0_2722_3607">
                    <rect width="18" height="18" fill="white"/>
                  </clipPath>
                </defs>
              </svg>

            </button>
            <button @click="fullscreen" class="p-2 rounded hover:bg-gray-300">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M5.82 1.50098L6.00098 1.50098C6.41519 1.50098 6.75098 1.83676 6.75098 2.25098C6.75098 2.66519 6.41519 3.00098 6.00098 3.00098H5.85098C5.20854 3.00098 4.77182 3.00156 4.43426 3.02914C4.10544 3.05601 3.93729 3.1047 3.81999 3.16447C3.53775 3.30828 3.30828 3.53775 3.16447 3.81999C3.1047 3.93729 3.05601 4.10544 3.02914 4.43426C3.00156 4.77182 3.00098 5.20854 3.00098 5.85098V6.00098C3.00098 6.41519 2.66519 6.75098 2.25098 6.75098C1.83676 6.75098 1.50098 6.41519 1.50098 6.00098L1.50098 5.82C1.50097 5.21628 1.50096 4.718 1.53412 4.31211C1.56857 3.89053 1.64249 3.50301 1.82796 3.13901C2.11558 2.57452 2.57452 2.11558 3.13901 1.82796C3.50301 1.64249 3.89053 1.56857 4.31211 1.53412C4.718 1.50096 5.21628 1.50097 5.82 1.50098ZM13.5677 3.02914C13.2301 3.00156 12.7934 3.00098 12.151 3.00098H12.001C11.5868 3.00098 11.251 2.66519 11.251 2.25098C11.251 1.83676 11.5868 1.50098 12.001 1.50098L12.182 1.50098C12.7857 1.50097 13.2839 1.50096 13.6898 1.53412C14.1114 1.56857 14.4989 1.64249 14.8629 1.82796C15.4274 2.11558 15.8864 2.57452 16.174 3.13901C16.3595 3.50301 16.4334 3.89053 16.4678 4.31211C16.501 4.718 16.501 5.21626 16.501 5.81998V6.00098C16.501 6.41519 16.1652 6.75098 15.751 6.75098C15.3368 6.75098 15.001 6.41519 15.001 6.00098V5.85098C15.001 5.20854 15.0004 4.77182 14.9728 4.43426C14.9459 4.10544 14.8973 3.93729 14.8375 3.81999C14.6937 3.53775 14.4642 3.30828 14.182 3.16447C14.0647 3.1047 13.8965 3.05601 13.5677 3.02914ZM2.25098 11.251C2.66519 11.251 3.00098 11.5868 3.00098 12.001V12.151C3.00098 12.7934 3.00156 13.2301 3.02914 13.5677C3.05601 13.8965 3.1047 14.0647 3.16447 14.182C3.30828 14.4642 3.53775 14.6937 3.81999 14.8375C3.93729 14.8973 4.10544 14.9459 4.43426 14.9728C4.77182 15.0004 5.20854 15.001 5.85098 15.001H6.00098C6.41519 15.001 6.75098 15.3368 6.75098 15.751C6.75098 16.1652 6.41519 16.501 6.00098 16.501H5.81998C5.21626 16.501 4.718 16.501 4.31211 16.4678C3.89053 16.4334 3.50301 16.3595 3.13901 16.174C2.57452 15.8864 2.11558 15.4274 1.82796 14.8629C1.64249 14.4989 1.56857 14.1114 1.53412 13.6898C1.50096 13.2839 1.50097 12.7857 1.50098 12.182L1.50098 12.001C1.50098 11.5868 1.83676 11.251 2.25098 11.251ZM15.751 11.251C16.1652 11.251 16.501 11.5868 16.501 12.001V12.182C16.501 12.7857 16.501 13.284 16.4678 13.6898C16.4334 14.1114 16.3595 14.4989 16.174 14.8629C15.8864 15.4274 15.4274 15.8864 14.8629 16.174C14.4989 16.3595 14.1114 16.4334 13.6898 16.4678C13.284 16.501 12.7857 16.501 12.182 16.501H12.001C11.5868 16.501 11.251 16.1652 11.251 15.751C11.251 15.3368 11.5868 15.001 12.001 15.001H12.151C12.7934 15.001 13.2301 15.0004 13.5677 14.9728C13.8965 14.9459 14.0647 14.8973 14.182 14.8375C14.4642 14.6937 14.6937 14.4642 14.8375 14.182C14.8973 14.0647 14.9459 13.8965 14.9728 13.5677C15.0004 13.2301 15.001 12.7934 15.001 12.151V12.001C15.001 11.5868 15.3368 11.251 15.751 11.251Z" fill="#475467"/>
              </svg>

            </button>
            <button v-show="!isLite" @click="downloadPng" class="flex justify-center items-center p-2 rounded hover:bg-gray-300" title="Download PNG">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="0.5625" y="1.62012" width="16.875" height="14.7656" rx="2.10938" fill="#42526E"/>
                <path d="M2.96934 10.1689V9.30986H4.03366C4.27153 9.30986 4.45654 9.24909 4.5887 9.12756C4.72288 9.00602 4.78997 8.8299 4.78997 8.59918V8.593C4.78997 8.36023 4.72288 8.1841 4.5887 8.06463C4.45654 7.94515 4.27153 7.88541 4.03366 7.88541H2.96934V7.01406H4.30508C4.63241 7.01406 4.91704 7.07998 5.15898 7.21181C5.40092 7.34159 5.58796 7.52493 5.72011 7.76182C5.8543 7.99665 5.92139 8.27371 5.92139 8.593V8.59918C5.92139 8.91641 5.8543 9.19347 5.72011 9.43037C5.58796 9.6652 5.40092 9.8475 5.15898 9.97728C4.91704 10.105 4.63241 10.1689 4.30508 10.1689H2.96934ZM2.4082 11.4728V7.01406H3.52742V11.4728H2.4082Z" fill="#E5E5E5"/>
                <path d="M6.74479 11.4728V7.01406H7.63834L9.76698 9.92166L8.97408 9.51997H9.52911V7.01406H10.5904V11.4728H9.70294L7.56819 8.54047L8.3611 8.94525H7.80607V11.4728H6.74479Z" fill="#E5E5E5"/>
                <path d="M13.5912 11.5933C13.1399 11.5933 12.7526 11.4996 12.4293 11.3121C12.1061 11.1226 11.857 10.8528 11.6822 10.5026C11.5093 10.1503 11.4229 9.73009 11.4229 9.24188V9.2357C11.4229 8.75368 11.5093 8.33757 11.6822 7.98738C11.855 7.63719 12.101 7.36734 12.4202 7.17783C12.7414 6.98831 13.1216 6.89355 13.5607 6.89355C13.9206 6.89355 14.2428 6.95947 14.5275 7.09131C14.8121 7.22314 15.0429 7.40545 15.2197 7.63822C15.3987 7.86893 15.5064 8.1357 15.543 8.43851L15.5461 8.46941H14.4421L14.436 8.4416C14.3892 8.25414 14.2866 8.10583 14.128 7.99665C13.9714 7.88747 13.7823 7.83289 13.5607 7.83289C13.3534 7.83289 13.1744 7.88953 13.024 8.00283C12.8756 8.11407 12.7617 8.27371 12.6824 8.48177C12.6031 8.68776 12.5635 8.93495 12.5635 9.22334V9.22952C12.5635 9.52203 12.6062 9.77541 12.6916 9.98964C12.779 10.2018 12.901 10.3656 13.0575 10.4809C13.2161 10.5963 13.4022 10.654 13.6156 10.654C13.7844 10.654 13.9338 10.6231 14.0639 10.5613C14.1961 10.4974 14.2998 10.4088 14.375 10.2955C14.4522 10.1802 14.4949 10.0463 14.5031 9.89385L14.5092 9.81969H13.7071V9.03795H15.5918V9.61576C15.5918 10.0257 15.5115 10.3779 15.3509 10.6725C15.1903 10.9671 14.9605 11.1947 14.6617 11.3554C14.3648 11.514 14.008 11.5933 13.5912 11.5933Z" fill="#E5E5E5"/>
              </svg>
              <span class="px-1 py-0.5 text-gray-500">Export PNG</span>
              <span class="bg-blue-100 text-blue-800 text-xs font-bold ms-0.5 px-1 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">New</span>
            </button>
<!--            https://zenuml.com/confluence-migration-instructions/-->
            <a v-show="isLite" @click="trackUpgradeEvent"
               target="_blank" href="https://zenuml.com/confluence-migration-instructions/"
               class="flex justify-center items-center p-2 rounded hover:bg-gray-300" title="Download PNG">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="0.5625" y="1.62012" width="16.875" height="14.7656" rx="2.10938" fill="#42526E"/>
                <path d="M2.96934 10.1689V9.30986H4.03366C4.27153 9.30986 4.45654 9.24909 4.5887 9.12756C4.72288 9.00602 4.78997 8.8299 4.78997 8.59918V8.593C4.78997 8.36023 4.72288 8.1841 4.5887 8.06463C4.45654 7.94515 4.27153 7.88541 4.03366 7.88541H2.96934V7.01406H4.30508C4.63241 7.01406 4.91704 7.07998 5.15898 7.21181C5.40092 7.34159 5.58796 7.52493 5.72011 7.76182C5.8543 7.99665 5.92139 8.27371 5.92139 8.593V8.59918C5.92139 8.91641 5.8543 9.19347 5.72011 9.43037C5.58796 9.6652 5.40092 9.8475 5.15898 9.97728C4.91704 10.105 4.63241 10.1689 4.30508 10.1689H2.96934ZM2.4082 11.4728V7.01406H3.52742V11.4728H2.4082Z" fill="#E5E5E5"/>
                <path d="M6.74479 11.4728V7.01406H7.63834L9.76698 9.92166L8.97408 9.51997H9.52911V7.01406H10.5904V11.4728H9.70294L7.56819 8.54047L8.3611 8.94525H7.80607V11.4728H6.74479Z" fill="#E5E5E5"/>
                <path d="M13.5912 11.5933C13.1399 11.5933 12.7526 11.4996 12.4293 11.3121C12.1061 11.1226 11.857 10.8528 11.6822 10.5026C11.5093 10.1503 11.4229 9.73009 11.4229 9.24188V9.2357C11.4229 8.75368 11.5093 8.33757 11.6822 7.98738C11.855 7.63719 12.101 7.36734 12.4202 7.17783C12.7414 6.98831 13.1216 6.89355 13.5607 6.89355C13.9206 6.89355 14.2428 6.95947 14.5275 7.09131C14.8121 7.22314 15.0429 7.40545 15.2197 7.63822C15.3987 7.86893 15.5064 8.1357 15.543 8.43851L15.5461 8.46941H14.4421L14.436 8.4416C14.3892 8.25414 14.2866 8.10583 14.128 7.99665C13.9714 7.88747 13.7823 7.83289 13.5607 7.83289C13.3534 7.83289 13.1744 7.88953 13.024 8.00283C12.8756 8.11407 12.7617 8.27371 12.6824 8.48177C12.6031 8.68776 12.5635 8.93495 12.5635 9.22334V9.22952C12.5635 9.52203 12.6062 9.77541 12.6916 9.98964C12.779 10.2018 12.901 10.3656 13.0575 10.4809C13.2161 10.5963 13.4022 10.654 13.6156 10.654C13.7844 10.654 13.9338 10.6231 14.0639 10.5613C14.1961 10.4974 14.2998 10.4088 14.375 10.2955C14.4522 10.1802 14.4949 10.0463 14.5031 9.89385L14.5092 9.81969H13.7071V9.03795H15.5918V9.61576C15.5918 10.0257 15.5115 10.3779 15.3509 10.6725C15.1903 10.9671 14.9605 11.1947 14.6617 11.3554C14.3648 11.514 14.008 11.5933 13.5912 11.5933Z" fill="#E5E5E5"/>
              </svg>
              <span class="ms-0.5 px-1 py-0.5 text-gray-500">Export PNG</span>
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
