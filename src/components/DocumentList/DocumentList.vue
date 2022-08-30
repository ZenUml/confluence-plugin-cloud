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
          <div class="flex flex-col w-full max-w-xs flex-grow border-l border-r">
            <div class="flex flex-shrink-0 items-center px-4 py-2 justify-between border-b">
              <button class="flex items-center text-xs font-semibold text-gray-600">
                Recent diagrams and API specs
              </button>
            </div>
            <div class="flex-1 overflow-y-auto">
              <a @click="picked = customContentItem" href="#" v-for="customContentItem in filteredCustomContentList" :key="customContentItem.id"
                 :class="{'bg-gray-100': customContentItem.id === (picked && picked.id)}"
                 class="block px-6 py-3 bg-white border-t hover:bg-gray-50">
                <span class="text-sm font-semibold text-gray-900">{{ customContentItem.title }}</span>
                <div class="flex justify-between">
                  <span class="text-sm font-semibold text-gray-500">{{ customContentItem.value.diagramType }}</span>
<!--                  <span class="text-sm text-gray-600">2 days ago</span>-->
                </div>
                <div class="mt-2 text-sm text-gray-600">
                  <a :href="`${baseUrl}${ customContentItem.container.id }`" target="_blank" class="flex items-center justify-between hover:underline group">
                    <span class="inline-block truncate">Page: {{ customContentItem.container.title }}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="inline-block h-5 w-5 flex-shrink-0 invisible group-hover:visible" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </a>
            </div>
          </div>
          <div id="workspace-right" class="flex-grow h-full bg-white border-t">
            <iframe id='embedded-viewer' :src='previewSrc' width='100%' height='100%'></iframe>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
  import SaveAndGoBackButton from "@/components/SaveAndGoBackButton";
  import {DiagramType} from "@/model/Diagram/Diagram";
  import EventBus from "@/EventBus";
  import {AtlasPage} from "@/model/page/AtlasPage";
  import AP from "@/model/AP";
  import {MacroIdProvider} from "@/model/ContentProvider/MacroIdProvider";
  import {CustomContentStorageProvider} from "@/model/ContentProvider/CustomContentStorageProvider";
  import ApWrapper2 from "@/model/ApWrapper2";

  export default {
    name: 'DocumentList',
    data() {
      return {
        customContentList: [],
        picked: '',
        docTypeFilter: '',
        baseUrl: ''
      };
    },
    computed: {

      filteredCustomContentList() {
        if (this.docTypeFilter === '') {
          return this.customContentList.filter(item => item?.id);
        }
        return this.customContentList.filter(customContentItem => customContentItem?.value?.diagramType?.toLowerCase() === this.docTypeFilter?.toLowerCase());
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
    async created() {
      const apWrapper = new ApWrapper2(AP);
      const idProvider = new MacroIdProvider(apWrapper);
      const customContentStorageProvider = new CustomContentStorageProvider(apWrapper);
      const customContentId = idProvider.getId();
      this.customContentList = await customContentStorageProvider.getCustomContentList();
      this.picked = this.customContentList.filter(customContentItem => customContentItem?.id === customContentId)[0];
      try {
        const atlasPage = new AtlasPage(AP);
        const pages = 'pages/';
        const currentPageUrl = await atlasPage.getHref();
        const pagesIndex = currentPageUrl.indexOf(pages);
        if (pagesIndex < 0) {
          console.warn(`Invalid currentPageUrl: ${currentPageUrl}. It should contain ${pages}`);
        } else {
          this.baseUrl = currentPageUrl.substring(0, pagesIndex + pages.length);
        }
      } catch (e) {
        console.error(e);
      }
    },
    methods: {
      setFilter(docType) {
        this.docTypeFilter = docType;
      }
    },
    components: {
      SaveAndGoBackButton,
    }
  }
</script>
