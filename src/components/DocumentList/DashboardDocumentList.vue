<template>
  <div class="content">
    <div class="workspace h-screen flex flex-col overflow-x-auto">
      <header class="flex flex-shrink-0 border-b h-[72px]">
        <div class="flex items-center justify-between bg-white px-6">
          <div class="flex items-center gap-4">
            <nav
              class="flex items-center text-sm font-medium leading-none text-slate-800 gap-3"
            >
              <Button
                :active="this.docTypeFilter === ''"
                @click="setFilter('')"
              >
                All
              </Button>
              <Button
                :active="this.docTypeFilter === 'sequence'"
                @click="setFilter('sequence')"
              >
                Sequence
              </Button>
              <Button
                :active="this.docTypeFilter === 'mermaid'"
                @click="setFilter('mermaid')"
              >
                Mermaid
              </Button>
              <Button
                :active="this.docTypeFilter === 'graph'"
                @click="setFilter('graph')"
              >
                Graph
              </Button>
              <Button
                :active="this.docTypeFilter === 'OpenApi'"
                @click="setFilter('OpenApi')"
              >
                Open API
              </Button>
            </nav>
            <input
              v-model="filterOnlyMine"
              type="checkbox"
              id="mineOnly"
              class="block ml-3 border-[1px] border-solid border-[#CACBD1] outline-none w-[14px] h-[14px] flex-shrink-0"
            />
            <label id="mineOnlyLbl" for="mineOnly">My Diagrams</label>
            <input
              v-model="filterKeyword"
              type="search"
              placeholder="search in title and content"
              class="block border-none outline-none bg-[#F2F4F7] placeholder:text-[#667085] ring-offset-2 hover:ring-2 focus:ring-2"
            />
          </div>
        </div>
        <div
          class="flex flex-row-reverse items-center flex-1 w-50 flex-shrink-0 px-4 py-3 bg-white"
        >
          <div class="flex items-center gap-6">
            <button
              v-show="!isMigrationEnabled"
              :disabled="isMigrationInProgress"
              @click="migrate"
              class="flex items-center bg-[#004EEB] px-3 py-2 text-white text-sm font-semibold rounded whitespace-nowrap hover:brightness-90"
            >
              {{ migrateButtonText }}
            </button>
            <div class="flex items-center gap-1">
              <div
                @click="changeToTableStyle"
                class="p-1 rounded-[50%] hover:bg-[#EAECF0] cursor-pointer"
                :class="{ 'bg-[#EAECF0]': viewStyle == 'table' }"
                title="List view"
              >
                <IconList />
              </div>
              <div
                @click="changeToGridStyle"
                class="p-1 rounded-[50%] hover:bg-[#EAECF0] cursor-pointer"
                :class="{ 'bg-[#EAECF0]': viewStyle == 'grid' }"
                title="Grid view"
              >
                <IconGrid />
              </div>
              <div
                @click="enterFullScreen"
                class="p-1 rounded-[50%] hover:bg-[#EAECF0] cursor-pointer"
                v-if="!fullScreen"
                title="Full Screen"
              >
                <IconFullscreen />
              </div>
              <div
                @click="exitFullScreen"
                class="p-1 rounded-[50%] hover:bg-[#EAECF0] cursor-pointer"
                v-if="fullScreen"
                title="Exit Full Screen"
              >
                <IconFullscreenOff />
              </div>
            </div>
          </div>
          <button
            class="flex items-center float-right h-8 text-white text-sm font-medium"
          >
            <save-and-go-back-button :save-and-exit="saveAndExit" />
          </button>
        </div>
      </header>
      <div class="flex-1 flex overflow-hidden">
        <main v-if="viewStyle == 'table'" class="tableViewList flex flex-1">
          <div
            class="flex flex-col w-full max-w-md flex-grow border-l border-r"
          >
            <div
              id="tableScrollContainer"
              class="flex-1 px-4 overflow-y-auto"
              @scroll="handleScroll"
            >
              <div
                class="flex flex-shrink-0 items-center py-4 justify-between text-gray-500 font-bold text-xs"
              >
                RECENT DIAGRAMS AND API SPECS
              </div>
              <div
                v-for="customContentItem in filteredCustomContentList"
                :key="customContentItem.id"
              >
                <a
                  @click="picked = customContentItem"
                  href="#"
                  class="relative block p-4 hover:bg-gray-50 rounded-md border-gray-200 border-[1px] border-solid mb-4"
                  :class="{
                    'bg-gray-100 hover:bg-gray-100':
                      customContentItem.id === (picked && picked.id),
                  }"
                >
                  <div class="flex items-center mb-1">
                    <div class="flex-grow font-bold text-gray-800">
                      {{ customContentItem.title }}
                    </div>
                    <a
                      class="p-1 rounded-[50%] hover:bg-[#EAECF0] cursor-pointer flex-shrink-0"
                      title="Edit"
                      @click="
                        (e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          edit(
                            customContentItem.id,
                            customContentItem.value.diagramType
                          );
                        }
                      "
                    >
                      <IconPencil
                        class="hover:text-[#004EEB] w-5 h-5 text-gray-500"
                      />
                    </a>
                  </div>
                  <div class="flex mb-5">
                    <div class="flex-shrink-0 flex justify-center items-center">
                      <img
                        class="contIcon"
                        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' role='presentation'%3E%3Cpath fill='%232684FF' fill-rule='evenodd' d='M3 0h18a3 3 0 013 3v18a3 3 0 01-3 3H3a3 3 0 01-3-3V3a3 3 0 013-3zm1 18c0 .556.446 1 .995 1h8.01c.54 0 .995-.448.995-1 0-.556-.446-1-.995-1h-8.01c-.54 0-.995.448-.995 1zm0-4c0 .556.448 1 1 1h14c.555 0 1-.448 1-1 0-.556-.448-1-1-1H5c-.555 0-1 .448-1 1zm0-4c0 .556.448 1 1 1h14c.555 0 1-.448 1-1 0-.556-.448-1-1-1H5c-.555 0-1 .448-1 1zm0-4c0 .556.448 1 1 1h14c.555 0 1-.448 1-1 0-.556-.448-1-1-1H5c-.555 0-1 .448-1 1z'%3E%3C/path%3E%3C/svg%3E"
                      />
                    </div>
                    <a
                      :href="customContentItem.container.link"
                      target="_blank"
                      class="text-gray-500 hover:text-[#004EEB] hover:underline"
                      >{{ customContentItem.container.title }}</a
                    >
                  </div>
                  <div class="flex items-center justify-between">
                    <DocType
                      class="flex-shrink-0"
                      :type="customContentItem.value.diagramType"
                    />
                    <Contributors
                      class="flex-shrink-0"
                      :contributors="customContentItem.contributors"
                    />
                  </div>
                </a>
              </div>
            </div>
          </div>
          <div id="workspace-right" class="flex-grow h-full bg-white border-t">
            <iframe
              id="embedded-viewer"
              :src="previewSrc"
              width="100%"
              height="100%"
            >
            </iframe>
          </div>
        </main>
        <main
          id="gridScrollContainer"
          v-if="viewStyle == 'grid'"
          class="gridViewList h-full w-full overflow-auto p-5"
          @scroll="handleScroll"
        >
          <div
            class="border-solid grid gap-y-8 justify-evenly"
            style="grid-template-columns: repeat(auto-fit, minmax(360px, 1fr))"
          >
            <div
              v-for="customContentItem in filteredCustomContentList"
              :key="customContentItem.id"
              class="relative"
            >
              <div
                class="relative border-box rounded-sm overflow-hidden border-gray-200 border-[1px] mx-4 group hover:shadow-[8px_8px_8px_0px_#0000000A]"
              >
                <div
                  class="w-full pt-[55.55%] relative bg-white border-gray-200 border-b-[1px] group-hover:brightness-95"
                >
                  <img
                    class="absolute top-0 left-0 w-full h-full object-cover object-top"
                    v-if="customContentItem.imageLink"
                    :src="customContentItem.imageLink"
                    @error="loadDefaultDiagram"
                  />
                  <img
                    class="absolute top-0 left-0 w-full h-full object-cover object-top"
                    v-if="!customContentItem.imageLink"
                    :src="defaultDiagramImageUrl"
                  />
                </div>
                <div class="p-4">
                  <div class="flex items-center mb-1">
                    <div class="flex-grow font-bold text-gray-800">
                      {{ customContentItem.title }}
                    </div>
                  </div>
                  <div class="flex mb-5">
                    <div class="flex-shrink-0 flex justify-center items-center">
                      <img
                        class="contIcon"
                        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' role='presentation'%3E%3Cpath fill='%232684FF' fill-rule='evenodd' d='M3 0h18a3 3 0 013 3v18a3 3 0 01-3 3H3a3 3 0 01-3-3V3a3 3 0 013-3zm1 18c0 .556.446 1 .995 1h8.01c.54 0 .995-.448.995-1 0-.556-.446-1-.995-1h-8.01c-.54 0-.995.448-.995 1zm0-4c0 .556.448 1 1 1h14c.555 0 1-.448 1-1 0-.556-.448-1-1-1H5c-.555 0-1 .448-1 1zm0-4c0 .556.448 1 1 1h14c.555 0 1-.448 1-1 0-.556-.448-1-1-1H5c-.555 0-1 .448-1 1zm0-4c0 .556.448 1 1 1h14c.555 0 1-.448 1-1 0-.556-.448-1-1-1H5c-.555 0-1 .448-1 1z'%3E%3C/path%3E%3C/svg%3E"
                      />
                    </div>
                    <a
                      :href="customContentItem.container.link"
                      target="_blank"
                      class="text-gray-500 hover:text-[#004EEB] hover:underline"
                      >{{ customContentItem.container.title }}</a
                    >
                  </div>
                  <div class="flex items-center justify-between">
                    <DocType
                      class="flex-shrink-0"
                      :type="customContentItem.value.diagramType"
                    />
                    <Contributors
                      class="flex-shrink-0"
                      :contributors="customContentItem.contributors"
                    />
                  </div>
                </div>

                <a
                  class="p-1 rounded-[50%] bg-white hover:bg-[#EAECF0] cursor-pointer absolute top-4 right-4 opacity-0 group-hover:opacity-100"
                  title="Edit"
                  @click="
                    (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      edit(
                        customContentItem.id,
                        customContentItem.value.diagramType
                      );
                    }
                  "
                >
                  <IconPencil
                    class="hover:text-[#004EEB] w-7 h-7 text-gray-500"
                  />
                </a>
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
import { DiagramType } from "@/model/Diagram/Diagram";
import EventBus from "@/EventBus";
import AP from "@/model/AP";
import { CustomContentStorageProvider } from "@/model/ContentProvider/CustomContentStorageProvider";
import { ConfluencePage } from "@/model/page/ConfluencePage";
import { getAttachmentDownloadLink } from "@/model/Attachment";
import upgrade from "@/utils/upgrade";
import { trackEvent } from "@/utils/window";
import globals from "@/model/globals";
import Button from "./components/Button.vue";
import IconList from "@/components/icons/IconList.vue";
import IconGrid from "@/components/icons/IconGrid.vue";
import IconFullscreen from "@/components/icons/IconFullscreen.vue";
import IconFullscreenOff from "@/components/icons/IconFullscreenOff.vue";
import IconPencil from "@/components/icons/IconPencil.vue";
import DocType from "./components/DocType.vue";
import Contributors from "./components/Contributors.vue";

export default {
  name: "DashboardDocumentList",
  data() {
    return {
      fullScreen: false,
      customContentList: [],
      hasData: false,
      picked: "",
      docTypeFilter: "",
      baseUrl: "",
      filterKeyword: "",
      filterOnlyMine: false,
      viewStyle: "table",
      customContentStorageProvider: null,
      filterTimeout: null,
      nextPagePrevScrollTop: 0,
      needTryLoadNextPage: true,
      nextPageUrl: "",
      pageSize: 15,
      defaultDiagramImageUrl: "/image/default_diagram.png",
      isMigrationEnabled: false,
      isMigrationInProgress: false,
      migratedCount: 0,
      migrationTotal: 0,
    };
  },
  watch: {
    async filterKeyword(newValue, oldValue) {
      console.log("filterKeyword changed:", newValue, oldValue);
      if (this.filterTimeout) clearTimeout(this.filterTimeout);
      this.filterTimeout = setTimeout(async () => {
        await this.search();
      }, 500);
    },
    async filterOnlyMine(newValue, oldValue) {
      console.log("filterOnlyMine changed:", newValue, oldValue);
      await this.search();
    },
    async customContentList(newValue, oldValue) {
      console.log("customContentList changed:", newValue, oldValue);
      if (this.filteredCustomContentList.length > 0) this.hasData = true;
    },
  },
  computed: {
    filteredCustomContentList() {
      const results = this.customContentList.filter((item) => {
        if (!item?.id) {
          return false;
        }
        if (
          this.docTypeFilter &&
          item?.value?.diagramType?.toLowerCase() !==
            this.docTypeFilter?.toLowerCase()
        ) {
          return false;
        }
        return true;
      });
      return results;
    },
    previewSrc() {
      if (!this.picked) return;
      if (!this.picked.value?.diagramType) {
        console.warn(`Unknown diagramType:`, this.picked.value);
        return "";
      }

      function getViewerUrl(diagramType) {
        if (
          diagramType === DiagramType.Sequence ||
          diagramType === DiagramType.Mermaid
        ) {
          return "/sequence-viewer.html";
        }
        if (diagramType === DiagramType.Graph) {
          return "/drawio/viewer.html";
        }
        if (diagramType === DiagramType.OpenApi) {
          return "/swagger-ui.html";
        }

        console.warn(`Unknown diagramType: ${diagramType}`);
      }
      return `${getViewerUrl(this.picked.value.diagramType)}${
        window.location.search || "?"
      }&rendered.for=custom-content-native&content.id=${
        this.picked.id
      }&embedded=true`;
    },
    saveAndExit: function () {
      const that = this;
      return function () {
        window.picked = that.picked;
        EventBus.$emit("save");
      };
    },
    migrateButtonText: function () {
      const progress = () =>
        this.migrationTotal
          ? ` - ${this.migratedCount} migrated out of ${this.migrationTotal}`
          : "";
      return this.isMigrationInProgress
        ? `Migrating${progress()} ...`
        : "Migrate to Full";
    },
  },
  async mounted() {
    const apWrapper = globals.apWrapper;
    await apWrapper.initializeContext();
    this.loadInitCustomData(await apWrapper.getDialogCustomData());
    this.customContentStorageProvider = new CustomContentStorageProvider(
      apWrapper
    );
    await this.search();
    this.checkIfHasData();
    this.initTheRightSideContent();

    const hasFull = await apWrapper.hasFullAddon();
    this.isMigrationEnabled =
      apWrapper.isLite() && hasFull && upgrade.isEnabled();
  },
  methods: {
    checkIfHasData() {
      if (this.fullScreen == false && this.customContentList.length > 0) {
        this.hasData = true;
      }
    },
    loadInitCustomData(customData) {
      console.debug({ action: "loadInitCustomData", customData: customData });
      if (customData) {
        Object.keys(customData).forEach((key) => {
          this[key] = customData[key];
        });
      }
    },
    buildInitCustomData() {
      return {
        fullScreen: this.fullScreen,
        docTypeFilter: this.docTypeFilter,
        filterKeyword: this.filterKeyword,
        filterOnlyMine: this.filterOnlyMine,
        viewStyle: this.viewStyle,
        hasData: this.hasData,
      };
    },
    enterFullScreen() {
      this.fullScreen = true;
      AP.dialog
        .create({
          key: `zenuml-content-dashboard`,
          chrome: false,
          width: "100%",
          height: "100%",
          customData: this.buildInitCustomData(),
        })
        .on("close", async (customData) => {
          console.debug({
            action: "enterFullScreen on close",
            customData: customData,
          });
          this.loadInitCustomData(customData);
          await this.search();
        });
      this.trackFullScreenEvent("enter");
    },
    tryRefreshEmbeddedViewer() {
      const iframe = document.getElementById("embedded-viewer");
      if (iframe) iframe.contentWindow.location.reload();
    },
    exitFullScreen() {
      this.fullScreen = false;
      AP.dialog.close(this.buildInitCustomData());
      this.trackFullScreenEvent("exit");
    },
    trackFullScreenEvent(category) {
      trackEvent("", "dashboard_full_screen", category);
    },
    setFilter(docType) {
      this.docTypeFilter = docType;
    },
    gotoPage(pageId) {
      AP.navigator.go("contentview", { contentId: pageId });
    },
    async changeToTableStyle() {
      this.viewStyle = "table";
      setTimeout(() => {
        this.initTheRightSideContent();
      }, 500);
      await this.checkAutoLoadNextPageData();
    },
    async changeToGridStyle() {
      this.viewStyle = "grid";
      await this.checkAutoLoadNextPageData();
    },
    initTheRightSideContent() {
      //init the right side content
      const iframe = document.getElementById("embedded-viewer");
      const iframeDocument =
        iframe.contentDocument || iframe.contentWindow.document;
      const initContentClassName = "init-content";
      const hasInitContent =
        iframeDocument.querySelectorAll(`.${initContentClassName}`).length != 0;
      if (iframe.src != "" || hasInitContent) return;
      const div = iframeDocument.createElement("div");
      div.classList.add(initContentClassName);
      div.innerHTML = this.hasData
        ? "Select a diagram from the left side panel"
        : `<div style="margin-bottom: 10px;">
              <button onclick="parent.getStarted()" style="height: 50px; width: 150px; font-size: medium;">Get Started</button>
             </div>
            <a href="https://zenuml.atlassian.net/wiki/spaces/Doc/pages/504659970/Get+started" target="_blank">Learn how to create diagrams and API specs</a>`;
      div.style.position = "absolute";
      div.style.top = "50%";
      div.style.left = "50%";
      div.style.transform = "translate(-50%, -50%)";
      div.style.textAlign = "center";
      div.style.fontFamily = "Arial, sans-serif";
      div.style.fontSize = "18px";
      iframeDocument.body.appendChild(div);
    },
    edit(customContentId, diagramType) {
      //Mermaid diagram uses sequence editor
      const type = (
        diagramType === DiagramType.Mermaid ? DiagramType.Sequence : diagramType
      ).toLowerCase();
      AP.dialog
        .create({
          key: `zenuml-content-dashboard-${type}-editor-dialog`,
          chrome: false,
          width: "100%",
          height: "100%",
          customData: {
            "content.id": customContentId,
            contentId: customContentId,
          },
        })
        .on("close", async () => {
          this.tryRefreshEmbeddedViewer();
        });
    },
    async handleScroll(event) {
      const scrollContainer = event.target;
      const scrollThreshold = 100;

      const isScrolledToBottom =
        scrollContainer.scrollHeight - scrollContainer.scrollTop <=
        scrollContainer.clientHeight + scrollThreshold;

      if (
        isScrolledToBottom &&
        scrollContainer.scrollTop > this.prevScrollTop + scrollThreshold
      ) {
        this.prevScrollTop = scrollContainer.scrollTop;
        console.debug("need load next page");
        await this.loadNextPageData();
      }
    },
    resetNextPageScorll() {
      this.prevScrollTop = 0;
      this.needTryLoadNextPage = true;
      this.nextPageUrl = "";
    },
    async loadCustomContentImage(customContent) {
      const c = customContent;
      try {
        const page = new ConfluencePage(c.container.id, AP);
        const macro = await page.macroByCustomContentId(c.id); //todo: move to apwrapper2
        console.debug(
          `macro found for custom content ${c.id} in page ${c.container.id}:`,
          macro
        );
        const uuid = macro?.attrs?.parameters?.macroParams?.uuid?.value;
        if (uuid) {
          const link = await getAttachmentDownloadLink(c.container.id, uuid);
          console.debug(
            `image link of custom content ${c.id} in page ${c.container.id}:`,
            link
          );
          c.imageLink = link;
        }
      } catch (e) {
        console.error(
          `Error on getting the attachment image of custom content ${c}`,
          e
        );
      }
      this.$forceUpdate();
    },
    async loadCustomContentImages(customContentList) {
      await Promise.all(
        customContentList
          .filter((c) => c.container?.id)
          .map((c) => this.loadCustomContentImage(c))
      );
    },
    async search() {
      this.resetNextPageScorll();
      try {
        let searchResult =
          await this.customContentStorageProvider.searchPagedCustomContent(
            this.pageSize,
            this.filterKeyword,
            this.filterOnlyMine,
            this.docTypeFilter
          );
        console.debug({ actiion: "search", searchResult: searchResult });
        let searchedCustomContentList = searchResult.results;
        //Reasons not to use 'await this.loadCustomContentImages':Synchronization will cause the page to remain motionless, so asynchronous is used. After each image link is retrieved, 'this.$forceUpdate();' is called to force a refresh.
        this.loadCustomContentImages(searchedCustomContentList);
        this.updateNexPageUrl(searchResult);
        this.customContentList = searchedCustomContentList;
        await this.checkAutoLoadNextPageData();
      } catch (e) {
        console.error(`Error search`, e);
      }
    },
    updateNexPageUrl(searchResult) {
      this.nextPageUrl = searchResult?._links?.next || "";
      if (this.nextPageUrl == "") {
        this.needTryLoadNextPage = false;
      }
    },
    async checkAutoLoadNextPageData() {
      setTimeout(async () => {
        const scrollContainerElement = document.getElementById(
          `${this.viewStyle}ScrollContainer`
        );
        const hasScroll =
          scrollContainerElement.scrollHeight >
          scrollContainerElement.clientHeight;
        console.debug({
          action: "checkAutoLoadNextPageData",
          hasScroll: hasScroll,
        });
        if (this.needTryLoadNextPage && !hasScroll) {
          console.debug({
            action: "checkAutoLoadNextPageData",
            msg: "need auto load",
          });
          await this.loadNextPageData();
        }
      }, 200);
    },
    async loadNextPageData() {
      if (!this.needTryLoadNextPage) return;
      let searchResult =
        await this.customContentStorageProvider.searchNextPageCustomContent(
          this.nextPageUrl
        );
      this.updateNexPageUrl(searchResult);
      let nextPageDataList = searchResult.results;
      console.debug(
        `loadNextPageData load data count:${nextPageDataList.length}`
      );
      if (nextPageDataList.length > 0) {
        this.loadCustomContentImages(nextPageDataList);
        this.customContentList =
          this.customContentList.concat(nextPageDataList);
        await this.checkAutoLoadNextPageData();
      }
      console.debug(
        `customContentList data count:${this.customContentList.length}`
      );
    },
    loadDefaultAvatar(e) {
      console.debug({ action: "loadDefaultAvatar", url: e.target.src });
      e.target.src = "/image/default_avatar.png";
    },
    loadDefaultDiagram(e) {
      console.debug({ action: "loadDefaultDiagram", url: e.target.src });
      e.target.src = this.defaultDiagramImageUrl;
    },
    migrate() {
      this.migratedCount = 0;
      this.migrationTotal = 0;
      this.isMigrationInProgress = true;

      upgrade.run(({ migrated, total, completed }) => {
        this.isMigrationInProgress = !completed;
        this.migratedCount = migrated;
        this.migrationTotal = total;
      });
    },
  },
  components: {
    SaveAndGoBackButton,
    Button,
    IconList,
    IconGrid,
    IconFullscreen,
    IconFullscreenOff,
    IconPencil,
    DocType,
    Contributors,
  },
};
</script>
