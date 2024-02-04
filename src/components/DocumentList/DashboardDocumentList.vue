<template>
  <div class="content">
    <div class="workspace h-screen flex flex-col">
      <header class="flex flex-shrink-0 border-b">
        <div class="flex items-center justify-between bg-white px-6">
          <div class="flex items-center">
              <input v-model="filterKeyword" type="search" placeholder="search in title and content" class="block p-2 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <input v-model="filterOnlyMine" type="checkbox" id="mineOnly" class="block ml-3"/>
              <label id="mineOnlyLbl" for="mineOnly">My Diagrams</label>
              <nav class="flex text-sm font-medium leading-none text-slate-800">
                <a href="#" class="inline-block ml-2 px-3 py-2 hover:bg-gray-200 rounded-lg" :class="{'bg-gray-200': this.docTypeFilter === ''}" @click="setFilter('')">All</a>
                <a href="#" class="inline-block ml-2 px-3 py-2 hover:bg-gray-200 rounded-lg" :class="{'bg-gray-200': this.docTypeFilter === 'sequence'}" @click="setFilter('sequence')">Sequence</a>
                <a href="#" class="inline-block ml-2 px-3 py-2 hover:bg-gray-200 rounded-lg" :class="{'bg-gray-200': this.docTypeFilter === 'mermaid'}" @click="setFilter('mermaid')">Mermaid</a>
                <a href="#" class="inline-block ml-2 px-3 py-2 hover:bg-gray-200 rounded-lg" :class="{'bg-gray-200': this.docTypeFilter === 'graph'}" @click="setFilter('graph')">Graph</a>
                <a href="#" class="inline-block ml-2 px-3 py-2 hover:bg-gray-200 rounded-lg" :class="{'bg-gray-200': this.docTypeFilter === 'OpenApi'}" @click="setFilter('OpenApi')">Open API</a>
              </nav>
          </div>
        </div>
        <div class="flex-1 w-50 flex-shrink-0 px-4 py-3 bg-white">
          <div class="flex items-center float-right">
            <button v-show="isMigrationEnabled" :disabled="isMigrationInProgress" @click="migrate" class="flex items-center bg-blue-700 px-2 py-1 text-white text-sm font-semibold rounded">{{ migrateButtonText }}</button>
            <button class="imgInput tableList"  :class="{ 'selected': viewStyle=='table' }" title="List view" @click="changeToTableStyle"></button>
            <button class="imgInput gridList" :class="{ 'selected': viewStyle=='grid' }" title="Grid view" @click="changeToGridStyle"></button>
            <button class="imgInput fullScreen" v-if="!fullScreen"  title="Full Screen" @click="enterFullScreen"></button>
            <button class="imgInput exitFullScreen" v-if="fullScreen"  title="Exit Full Screen" @click="exitFullScreen"></button>
          </div>
          <button class="flex items-center float-right h-8 text-white text-sm font-medium">
            <save-and-go-back-button :save-and-exit="saveAndExit" />
          </button>
        </div>
      </header>
      <div class="flex-1 flex overflow-hidden">
        <main v-if="viewStyle=='table'" class="tableViewList bg-gray-200 flex flex-1">
          <div class="flex flex-col w-full max-w-md flex-grow border-l border-r">
            <div class="flex flex-shrink-0 items-center px-4 py-2 justify-between border-b">
              <button class="flex items-center text-xs font-semibold text-gray-600">
                Recent diagrams and API specs
              </button>
            </div>
            <div id="tableScrollContainer" class="flex-1 overflow-y-auto" @scroll="handleScroll">
              <div v-for="(customContentItem,index) in filteredCustomContentList" :key="customContentItem.id" class="relative block px-4 py-2 bg-white border-t hover:bg-gray-50">
                <div class="absolute left-0 top-0 w-6 min-w-6 max-w-10 h-6 text-xs bg-gray-400 text-white py-1 px-1 items-center justify-center">
                  <span class="flex font-bold items-center justify-center">{{index+1}}</span>
                </div>
                <a @click="picked = customContentItem" href="#"
                :class="{'bg-gray-100': customContentItem.id === (picked && picked.id), 'bg-white': customContentItem.id !== (picked && picked.id)}"
                class="block hover:bg-gray-50">
                  <div class="flex">
                    <div style="width: 75px; height: 75px; ">
                      <img v-if="customContentItem.imageLink" style="max-width: 75px; max-height: 75px;" :src="customContentItem.imageLink" @error="loadDefaultDiagram">
                      <img v-if="!customContentItem.imageLink" style="max-width: 75px; max-height: 75px;" :src="defaultDiagramImageUrl">
                    </div>
                    <div class="px-2 py-2">
                      <div>
                        <span class="text-sm font-semibold text-gray-900">{{ customContentItem.title }}</span>
                      </div>
                      <span class="diagramType text-sm px-1 py-1 rounded-md bg-gray-200">{{ customContentItem.value.diagramType }}</span>
                    </div>
                    <div class="gridEditBtnCont">
                      <button class="iconEditBtn" title="Edit" @click="edit(customContentItem.id, customContentItem.value.diagramType)"><img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMThweCIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMThweCIgZmlsbD0iIzAwMDAwMCI+PHBhdGggZD0iTTAgMGgyNHYyNEgwVjB6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTE0LjA2IDkuMDJsLjkyLjkyTDUuOTIgMTlINXYtLjkybDkuMDYtOS4wNk0xNy42NiAzYy0uMjUgMC0uNTEuMS0uNy4yOWwtMS44MyAxLjgzIDMuNzUgMy43NSAxLjgzLTEuODNjLjM5LS4zOS4zOS0xLjAyIDAtMS40MWwtMi4zNC0yLjM0Yy0uMi0uMi0uNDUtLjI5LS43MS0uMjl6bS0zLjYgMy4xOUwzIDE3LjI1VjIxaDMuNzVMMTcuODEgOS45NGwtMy43NS0zLjc1eiIvPjwvc3ZnPg==" /></button>
                    </div>
                  </div>
                </a>
                <div class="flex items-center">
                  <span class="flex flex-1 items-center px-2 py-2">
                    <img class="contIcon" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' role='presentation'%3E%3Cpath fill='%232684FF' fill-rule='evenodd' d='M3 0h18a3 3 0 013 3v18a3 3 0 01-3 3H3a3 3 0 01-3-3V3a3 3 0 013-3zm1 18c0 .556.446 1 .995 1h8.01c.54 0 .995-.448.995-1 0-.556-.446-1-.995-1h-8.01c-.54 0-.995.448-.995 1zm0-4c0 .556.448 1 1 1h14c.555 0 1-.448 1-1 0-.556-.448-1-1-1H5c-.555 0-1 .448-1 1zm0-4c0 .556.448 1 1 1h14c.555 0 1-.448 1-1 0-.556-.448-1-1-1H5c-.555 0-1 .448-1 1zm0-4c0 .556.448 1 1 1h14c.555 0 1-.448 1-1 0-.556-.448-1-1-1H5c-.555 0-1 .448-1 1z'%3E%3C/path%3E%3C/svg%3E"  />
                    <a :title="customContentItem.container.title" :href="customContentItem.container.link" target="_blank">{{customContentItem.container.title}}</a>
                  </span>
                  <span class="flex avatar-inner justify-end items-center px-2 py-2">
                    <a v-for="contributor in customContentItem.contributors" :key="contributor.id"  :href="contributor.link" target="_blank" :title="contributor.name">
                      <span class="avatar">
                        <span class="avatar-inner">
                          <img :src="contributor.avatar" @error="loadDefaultAvatar" class="rounded-full border-2 border-gray-300" />
                        </span>
                      </span>
                    </a>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div id="workspace-right" class="flex-grow h-full bg-white border-t">
            <iframe id='embedded-viewer' :src='previewSrc' width='100%' height='100%'>
            </iframe>
          </div>
        </main>
        <main id="gridScrollContainer" v-if="viewStyle=='grid'" class="gridViewList h-full w-full overflow-auto p-5" @scroll="handleScroll">
          <div  v-for="customContentItem in filteredCustomContentList" :key="customContentItem.id" class="gridDiagram">
            <div class="gridTitle" :title="customContentItem.title">
              {{ customContentItem.title }}
            </div>
            <div class="gridEditBtnCont">
              <button class="iconEditBtn" title="Edit" @click="edit(customContentItem.id, customContentItem.value.diagramType)"><img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMThweCIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMThweCIgZmlsbD0iIzAwMDAwMCI+PHBhdGggZD0iTTAgMGgyNHYyNEgwVjB6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTE0LjA2IDkuMDJsLjkyLjkyTDUuOTIgMTlINXYtLjkybDkuMDYtOS4wNk0xNy42NiAzYy0uMjUgMC0uNTEuMS0uNy4yOWwtMS44MyAxLjgzIDMuNzUgMy43NSAxLjgzLTEuODNjLjM5LS4zOS4zOS0xLjAyIDAtMS40MWwtMi4zNC0yLjM0Yy0uMi0uMi0uNDUtLjI5LS43MS0uMjl6bS0zLjYgMy4xOUwzIDE3LjI1VjIxaDMuNzVMMTcuODEgOS45NGwtMy43NS0zLjc1eiIvPjwvc3ZnPg==" /></button>
            </div>
            <div class="gridImgCont">
              <img v-if="customContentItem.imageLink" :src="customContentItem.imageLink" class="gridDiagramImg" @error="loadDefaultDiagram" />
              <img v-if="!customContentItem.imageLink" :src="defaultDiagramImageUrl" class="gridDiagramImg" />
            </div>
            <div class="gridBottom flex">
              <div class="gridContainer">
                <span class="flex items-center">
                  <img class="contIcon" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' role='presentation'%3E%3Cpath fill='%232684FF' fill-rule='evenodd' d='M3 0h18a3 3 0 013 3v18a3 3 0 01-3 3H3a3 3 0 01-3-3V3a3 3 0 013-3zm1 18c0 .556.446 1 .995 1h8.01c.54 0 .995-.448.995-1 0-.556-.446-1-.995-1h-8.01c-.54 0-.995.448-.995 1zm0-4c0 .556.448 1 1 1h14c.555 0 1-.448 1-1 0-.556-.448-1-1-1H5c-.555 0-1 .448-1 1zm0-4c0 .556.448 1 1 1h14c.555 0 1-.448 1-1 0-.556-.448-1-1-1H5c-.555 0-1 .448-1 1zm0-4c0 .556.448 1 1 1h14c.555 0 1-.448 1-1 0-.556-.448-1-1-1H5c-.555 0-1 .448-1 1z'%3E%3C/path%3E%3C/svg%3E"  />
                  <a :title="customContentItem.container.title" :href="customContentItem.container.link" target="_blank">{{customContentItem.container.title}}</a>
                </span>
              </div>
              <div class="gridContributors">
                <span  class="flex justify-end">
                  <a v-for="contributor in customContentItem.contributors" :key="contributor.id"  :href="contributor.link" target="_blank" :title="contributor.name">
                    <span class="avatar">
                      <span class="avatar-inner">
                        <img :src="contributor.avatar" @error="loadDefaultAvatar" class="rounded-full border-2 border-gray-300" />
                      </span>
                    </span>
                  </a>
                </span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
  import SaveAndGoBackButton from "@/components/SaveAndGoBackButton.vue";
  import {DiagramType} from "@/model/Diagram/Diagram";
  import EventBus from "@/EventBus";
  import AP from "@/model/AP";
  import {CustomContentStorageProvider} from "@/model/ContentProvider/CustomContentStorageProvider";
  import ApWrapper2 from "@/model/ApWrapper2";
  import { ConfluencePage } from "@/model/page/ConfluencePage";
  import { getAttachmentDownloadLink } from "@/model/Attachment";
  import upgrade from "@/utils/upgrade";

  export default {
    name: 'DashboardDocumentList',
    data() {
      return {
        fullScreen: false,
        customContentList: [],
        hasData: false,
        picked: '',
        docTypeFilter: '',
        baseUrl: '',
        filterKeyword: '',
        filterOnlyMine: false,
        viewStyle:'table',
        customContentStorageProvider:null,
        filterTimeout:null,
        nextPagePrevScrollTop: 0,
        needTryLoadNextPage: true,
        nextPageUrl:'',
        pageSize:15,
        defaultDiagramImageUrl:'/image/default_diagram.png',
        isMigrationEnabled: false,
        isMigrationInProgress: false,
        migratedCount: 0,
        migrationTotal: 0,
      };
    },
    watch: {
      async filterKeyword(newValue, oldValue) {
        console.log('filterKeyword changed:', newValue, oldValue);
        if (this.filterTimeout)clearTimeout(this.filterTimeout);
        this.filterTimeout = setTimeout(async () => {await this.search();}, 500);
      },
      async filterOnlyMine(newValue, oldValue) {
        console.log('filterOnlyMine changed:', newValue, oldValue);
        await this.search();
      },
      async customContentList(newValue, oldValue) {
        console.log('customContentList changed:', newValue, oldValue);
        if(this.filteredCustomContentList.length>0) this.hasData = true;
      }
    },
    computed: {
       filteredCustomContentList() {
        const results = this.customContentList.filter(item => {
          if(!item?.id) {
            return false;
          }
          if(this.docTypeFilter && item?.value?.diagramType?.toLowerCase() !== this.docTypeFilter?.toLowerCase()) {
            return false;
          }
          return true;
        });
        return results;
      },
      previewSrc() {
        if (!this.picked) return;
        if(!this.picked.value?.diagramType) {
          console.warn(`Unknown diagramType:`, this.picked.value);
          return '';
        }

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
      },
      migrateButtonText: function() {
        const progress = () => this.migrationTotal ? ` - ${this.migratedCount} migrated out of ${this.migrationTotal}` : '';
        return this.isMigrationInProgress ? `Migrating${progress()} ...` : 'Migrate to Full';
      }
    },
    async mounted() {
      const apWrapper = new ApWrapper2(AP);
      await apWrapper.initializeContext();
      this.loadInitCustomData(await apWrapper.getDialogCustomData());
      this.customContentStorageProvider = new CustomContentStorageProvider(apWrapper);
      await this.search();
      this.checkIfHasData();
      this.initTheRightSideContent();

      const hasFull = await apWrapper.hasFullAddon();
      this.isMigrationEnabled = apWrapper.isLite() && hasFull && upgrade.isEnabled();
    },
    methods: {
      checkIfHasData(){
        if(this.fullScreen==false && this.customContentList.length>0){
          this.hasData = true;
        }
      },
      loadInitCustomData(customData){
        console.debug({action:"loadInitCustomData",customData:customData});
        if(customData){
          Object.keys(customData).forEach(key => {
            this[key] = customData[key];
          });
        } 
      },
      buildInitCustomData(){
       return {
        fullScreen:this.fullScreen,
        docTypeFilter:this.docTypeFilter,
        filterKeyword:this.filterKeyword,
        filterOnlyMine:this.filterOnlyMine,
        viewStyle:this.viewStyle,
        hasData:this.hasData
       }
      },
      enterFullScreen() {
        this.fullScreen=true;
        AP.dialog.create({
          key: `zenuml-content-dashboard`,
          chrome: false,
          width: "100%",
          height: "100%",
          customData: this.buildInitCustomData()
        }).on('close', async (customData) => {
          console.debug({action:"enterFullScreen on close",customData:customData});
          this.loadInitCustomData(customData);
          await this.search();
        });
      },
      tryRefreshEmbeddedViewer(){
        const iframe = document.getElementById('embedded-viewer');
        if(iframe)iframe.contentWindow.location.reload();
      },
      exitFullScreen() {
        this.fullScreen=false;
        AP.dialog.close(this.buildInitCustomData());
      },
      setFilter(docType) {
        this.docTypeFilter = docType;
      },
      gotoPage(pageId) {
        AP.navigator.go('contentview', {contentId: pageId});
      },
      async changeToTableStyle() {
        this.viewStyle='table';
        setTimeout(() => {
          this.initTheRightSideContent();
        }, 500);
        await this.checkAutoLoadNextPageData();
      },
      async changeToGridStyle() {
        this.viewStyle='grid';
        await this.checkAutoLoadNextPageData();
      },
      initTheRightSideContent(){
        //init the right side content
        const iframe = document.getElementById('embedded-viewer');
        const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
        const initContentClassName = "init-content";
        const hasInitContent = iframeDocument.querySelectorAll(`.${initContentClassName}`).length!=0;
        if(iframe.src!='' || hasInitContent) return;
        const div = iframeDocument.createElement('div');
        div.classList.add(initContentClassName);
        div.innerHTML = this.hasData
          ? 'Select a diagram from the left side panel'
          : `<div style="margin-bottom: 10px;">
              <button onclick="parent.getStarted()" style="height: 50px; width: 150px; font-size: medium;">Get Started</button>
             </div>
            <a href="https://zenuml.atlassian.net/wiki/spaces/Doc/pages/504659970/Get+started" target="_blank">Learn how to create diagrams and API specs</a>`;
        div.style.position = 'absolute';
        div.style.top = '50%';
        div.style.left = '50%';
        div.style.transform = 'translate(-50%, -50%)';
        div.style.textAlign = 'center';
        div.style.fontFamily = 'Arial, sans-serif';
        div.style.fontSize = '18px';
        iframeDocument.body.appendChild(div);
      },
      edit(customContentId, diagramType) {
        //Mermaid diagram uses sequence editor
        const type = (diagramType === DiagramType.Mermaid ? DiagramType.Sequence : diagramType).toLowerCase();
        AP.dialog.create({
          key: `zenuml-content-dashboard-${type}-editor-dialog`,
          chrome: false,
          width: "100%",
          height: "100%",
          customData: { 'content.id': customContentId, contentId: customContentId }
        }).on('close', async () => {
          this.tryRefreshEmbeddedViewer();
        });
      },
      async handleScroll(event) {
        const scrollContainer = event.target;
        const scrollThreshold = 100;

        const isScrolledToBottom =
          scrollContainer.scrollHeight - scrollContainer.scrollTop <=
          scrollContainer.clientHeight + scrollThreshold;

        if (isScrolledToBottom && scrollContainer.scrollTop>(this.prevScrollTop+scrollThreshold)) {
          this.prevScrollTop = scrollContainer.scrollTop;
          console.debug('need load next page');
          await this.loadNextPageData();
        }
      },
      resetNextPageScorll(){
        this.prevScrollTop=0;
        this.needTryLoadNextPage=true;
        this.nextPageUrl='';
      },
      async loadCustomContentImage(customContent){
        const c=customContent;
        try {
          const page = new ConfluencePage(c.container.id, AP);
          const macro = await page.macroByCustomContentId(c.id); //todo: move to apwrapper2
          console.debug(`macro found for custom content ${c.id} in page ${c.container.id}:`, macro)
          const uuid = macro?.attrs?.parameters?.macroParams?.uuid?.value;
          if(uuid) {
            const link = await getAttachmentDownloadLink(c.container.id, uuid);
            console.debug(`image link of custom content ${c.id} in page ${c.container.id}:`, link);
            c.imageLink = link;
          }
        } catch(e) {
          console.error(`Error on getting the attachment image of custom content ${c}`, e);
        }
        this.$forceUpdate();
      },
      async loadCustomContentImages(customContentList) {
        await Promise.all(customContentList.filter(c => c.container?.id).map(c => this.loadCustomContentImage(c)));
      },
      async search(){
        this.resetNextPageScorll();
        try{
          let searchResult=await this.customContentStorageProvider.searchPagedCustomContent(this.pageSize,this.filterKeyword,this.filterOnlyMine,this.docTypeFilter);
          console.debug({actiion:'search',searchResult:searchResult});
          let searchedCustomContentList=searchResult.results;
          //Reasons not to use 'await this.loadCustomContentImages':Synchronization will cause the page to remain motionless, so asynchronous is used. After each image link is retrieved, 'this.$forceUpdate();' is called to force a refresh.
          this.loadCustomContentImages(searchedCustomContentList);
          this.updateNexPageUrl(searchResult);
          this.customContentList=searchedCustomContentList;
          await this.checkAutoLoadNextPageData();
        } catch(e) {
          console.error(`Error search`, e);
        }
      },
      updateNexPageUrl(searchResult){
        this.nextPageUrl=searchResult?._links?.next||'';
        if(this.nextPageUrl==''){
          this.needTryLoadNextPage=false;
        }
      },
      async checkAutoLoadNextPageData(){
        setTimeout(async()=>{
          const scrollContainerElement = document.getElementById(`${this.viewStyle}ScrollContainer`);
          const hasScroll = scrollContainerElement.scrollHeight > scrollContainerElement.clientHeight;
          console.debug({action:"checkAutoLoadNextPageData",hasScroll:hasScroll});
          if(this.needTryLoadNextPage && !hasScroll){
            console.debug({action:"checkAutoLoadNextPageData",msg:'need auto load'});
            await this.loadNextPageData();
          }
        },200);
      },
      async loadNextPageData(){
        if(!this.needTryLoadNextPage)return;
        let searchResult=await this.customContentStorageProvider.searchNextPageCustomContent(this.nextPageUrl);
        this.updateNexPageUrl(searchResult);
        let nextPageDataList=searchResult.results;
        console.debug(`loadNextPageData load data count:${nextPageDataList.length}`);
        if(nextPageDataList.length>0){
          this.loadCustomContentImages(nextPageDataList);
          this.customContentList=this.customContentList.concat(nextPageDataList);
          await this.checkAutoLoadNextPageData();
        }
        console.debug(`customContentList data count:${this.customContentList.length}`);
      },
      loadDefaultAvatar(e){
        console.debug({action:'loadDefaultAvatar',url:e.target.src});
        e.target.src='/image/default_avatar.png';
      },
      loadDefaultDiagram(e){
        console.debug({action:'loadDefaultDiagram',url:e.target.src});
        e.target.src=this.defaultDiagramImageUrl;
      },
      migrate() {
        this.migratedCount = 0;
        this.migrationTotal = 0;
        this.isMigrationInProgress = true;

        upgrade.run(({migrated, total, completed}) => {
          this.isMigrationInProgress = !completed;
          this.migratedCount = migrated;
          this.migrationTotal = total;
        });
      }
    },
    components: {
      SaveAndGoBackButton,
    }
  }
</script>