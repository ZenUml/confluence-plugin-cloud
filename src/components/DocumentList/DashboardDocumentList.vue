<template>
  <div class="content">
    <div class="workspace h-screen flex flex-col">
      <header class="flex flex-shrink-0">
        <div class="flex-1 flex items-center justify-between bg-white px-6">
          <nav class="flex text-sm font-medium leading-none text-slate-800">
            <a href="#" class="inline-block ml-2 px-3 py-2 hover:bg-gray-200 rounded-lg" :class="{'bg-gray-200': this.docTypeFilter === ''}" @click="setFilter('')">All</a>
            <a href="#" class="inline-block ml-2 px-3 py-2 hover:bg-gray-200 rounded-lg" :class="{'bg-gray-200': this.docTypeFilter === 'sequence'}" @click="setFilter('sequence')">Sequence</a>
            <a href="#" class="inline-block ml-2 px-3 py-2 hover:bg-gray-200 rounded-lg" :class="{'bg-gray-200': this.docTypeFilter === 'mermaid'}" @click="setFilter('mermaid')">Mermaid</a>
            <a href="#" class="inline-block ml-2 px-3 py-2 hover:bg-gray-200 rounded-lg" :class="{'bg-gray-200': this.docTypeFilter === 'graph'}" @click="setFilter('graph')">Graph</a>
            <a href="#" class="inline-block ml-2 px-3 py-2 hover:bg-gray-200 rounded-lg" :class="{'bg-gray-200': this.docTypeFilter === 'OpenApi'}" @click="setFilter('OpenApi')">Open API</a>
          </nav>
        </div>
        <div class="w-80 flex-shrink-0 px-4 py-3 bg-white">
          <button class="flex items-center float-right h-8 text-white text-sm font-medium">
            <save-and-go-back-button :save-and-exit="saveAndExit" />
          </button>
        </div>

      </header>
      <div class="flex-1 flex overflow-hidden">

        <main class="flex bg-gray-200 flex-1">
          <div class="flex flex-col w-full max-w-md flex-grow border-l border-r">
            <div class="flex flex-shrink-0 items-center px-4 py-2 justify-between border-b">
              <button class="flex items-center text-xs font-semibold text-gray-600">
                Recent diagrams and API specs
              </button>
            </div>
            <div class="flex flex-shrink-0 items-center px-4 py-2 justify-between border-b">
              <input v-model="filterKeyword" placeholder="search in title and content" class="block p-2 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            </div>
            <div class="flex-1 overflow-y-auto">
              <div v-for="containerPage in filteredPageList" :key="containerPage.id" class="block px-6 py-3 bg-white border-t hover:bg-gray-50">
                <div class="mt-2 text-sm text-gray-600">
                  <a href="#" class="flex items-center justify-between hover:underline group" @click="gotoPage(containerPage.id)">

                    <span class="inline-block truncate">Page: {{ containerPage.title }}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="inline-block h-5 w-5 flex-shrink-0 invisible group-hover:visible" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>

                <a @click="picked = item" href="#" v-for="item in containerPage.customContents" :key="item.id"
                 :class="{'bg-gray-100': item.id === (picked && picked.id), 'bg-white': item.id !== (picked && picked.id)}"
                 class="block px-6 py-3 border-t hover:bg-gray-50">
                  <div style="width: 64px; height: 64px; " v-show="item.imageLink">
                    <img style="max-width: 64px; max-height: 64px;" :src="item.imageLink">
                  </div>
                  <span class="text-sm font-semibold text-gray-900">{{ item.title }}</span>
                  <div class="flex justify-between">
                    <span class="text-sm font-semibold text-gray-500">{{ item.value.diagramType }}</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
          <div id="workspace-right" class="flex-grow h-full bg-white border-t">
            <iframe id='embedded-viewer' :src='previewSrc' width='100%' height='100%'>
            </iframe>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
  import SaveAndGoBackButton from "@/components/SaveAndGoBackButton";
  import {DiagramType, getDiagramData} from "@/model/Diagram/Diagram";
  import EventBus from "@/EventBus";
  import AP from "@/model/AP";
  import {CustomContentStorageProvider} from "@/model/ContentProvider/CustomContentStorageProvider";
  import ApWrapper2 from "@/model/ApWrapper2";
  import _ from 'lodash';
  import { ConfluencePage } from "@/model/page/ConfluencePage";
  import { getAttachmentDownloadLink } from "@/model/Attachment";

  export default {
    name: 'DashboardDocumentList',
    data() {
      return {
        customContentList: [],
        docTypeFilter: '',
        filterKeyword: ''
      };
    },
    computed: {
      filteredCustomContentList() {
        console.debug(`current filterKeyword: ${this.filterKeyword}`);

        const results = this.customContentList.filter(item => {
          if(!item?.id) {
            return false;
          }
          if(this.docTypeFilter && item?.value?.diagramType?.toLowerCase() !== this.docTypeFilter?.toLowerCase()) {
            return false;
          }
          if(!this.filterKeyword || this.filterKeyword && (
            item.container?.title && item.container?.title.toLowerCase().includes(this.filterKeyword.toLowerCase()) ||
            item.title && item.title.toLowerCase().includes(this.filterKeyword.toLowerCase()) ||
            item.value?.title && item.value?.title.toLowerCase().includes(this.filterKeyword.toLowerCase()) ||
            item.value && getDiagramData(item.value).toLowerCase().includes(this.filterKeyword.toLowerCase())
            )) {
              return true;
          }
          return false;
        });
        console.debug(`filteredCustomContentList:`, results);
        return results;
      },
      filteredPageList() {
        const map = _.groupBy(this.filteredCustomContentList, c => c.container?.id || '0');
        const emptyContainer = {id: '', title: ''};
        const pages = Object.keys(map).map(k => Object.assign({}, map[k][0].container || emptyContainer, {customContents: map[k]}));
        const sorted = _.sortBy(pages, [p => p.title?.toLowerCase()]);
        console.debug(`filteredPageList:`, sorted);
        return sorted;
      },
      previewSrc() {
        if (!this.picked) return;
        function getViewerUrl(diagramType) {
          if(diagramType === DiagramType.Sequence || diagramType === DiagramType.Mermaid) {
            return '/sequence-viewer.html';
        }
          if(diagramType === DiagramType.Graph) {
            return '/drawio/viewer.html';
          }
          if(diagramType === DiagramType.OpenApi) {
            return '/swagger-ui.html';
          }

          console.warn(`Unknown diagramType: ${diagramType}`);
        }
        return `${getViewerUrl(this.picked.value.diagramType)}${window.location.search || '?'}&rendered.for=custom-content-native&content.id=${this.picked.id}&embedded=true`;

      },
      saveAndExit: function () {
        const that = this;
        return function () {
          window.picked = that.picked;
          EventBus.$emit('save')
        }
      }
    },
    async mounted() {
      await this.loadCustomContents();
      this.initRightSideContent();
      await this.loadAttachmentImages();
    },
    methods: {
      setFilter(docType) {
        this.docTypeFilter = docType;
      },
      gotoPage(pageId) {
        AP.navigator.go('contentview', {contentId: pageId});
      },
      async loadCustomContents() {
        const apWrapper = new ApWrapper2(AP);
        const customContentStorageProvider = new CustomContentStorageProvider(apWrapper);
        this.customContentList = await customContentStorageProvider.getCustomContentList(25);
      },
      async loadAttachmentImages() {
        const getImageLink = async (customContent) => {
          try {
            const page = new ConfluencePage(customContent.container.id, AP);
            const macro = await page.macroByCustomContentId(customContent.id); //todo: move to apwrapper2
            console.debug(`macro found for custom content ${customContent.id} in page ${customContent.container.id}:`, macro)
            const uuid = macro?.attrs?.parameters?.macroParams?.uuid?.value;
            if(uuid) {
              const link = await getAttachmentDownloadLink(customContent.container.id, uuid);
              console.debug(`image link of custom content ${customContent.id} in page ${customContent.container.id}:`, link);
              customContent.imageLink = link;
            }
          } catch(e) {
            console.error(`Error on getting the attachment image of custom content ${customContent}`, e);
          }
        };

        await Promise.all(this.customContentList.map(getImageLink));
      },
      initRightSideContent() {
        const iframe = document.getElementById('embedded-viewer');
        const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
        const div = iframeDocument.createElement('div');
        div.innerHTML = this.customContentList.length 
          ? 'Select a diagram from the left side panel' 
          : '<a href="https://zenuml.atlassian.net/wiki/spaces/Doc/pages/504659970/Get+started" target="_blank">Learn how to create diagrams and API specs</a>';
        div.style.position = 'absolute';
        div.style.top = '50%';
        div.style.left = '50%';
        div.style.transform = 'translate(-50%, -50%)';
        div.style.textAlign = 'center';
        div.style.fontFamily = 'Arial, sans-serif';
        div.style.fontSize = '18px';
        iframeDocument.body.appendChild(div);
      }
    },
    components: {
      SaveAndGoBackButton,
    }
  }
</script>
