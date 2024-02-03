<template>
  <header
    class="toolbar header border-b border-gray-800 p-2 flex items-center justify-between relative z-10"
  >
    <div class="flex shrink-1 min-w-0">
      <div class="group ml-2 p-0.5 rounded flex bg-gray-100 hover:bg-gray-200">
        <button
          type="button"
          ref="btn-sequence"
          class="flex focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 rounded focus:outline-none focus-visible:ring-offset-gray-100"
          :class="
            diagramType === 'sequence'
              ? 'bg-white shadow-sm ring-1 ring-black ring-opacity-5'
              : ''
          "
          @click="setActiveTab('sequence')"
          :tabindex="diagramType === 'sequence' ? '0' : '-1'"
        >
          <span
            class="p-1 lg:pl-2.5 lg:pr-3.5 rounded flex items-center text-sm font-medium"
            :class="
              diagramType === 'sequence'
                ? 'bg-white shadow-sm ring-1 ring-black ring-opacity-5'
                : ''
            "
          >
            <span
              class="sr-only lg:not-sr-only text-gray-600 group-hover:text-gray-900"
              :class="
                diagramType === 'sequence'
                  ? 'text-gray-900'
                  : 'text-gray-600 group-hover:text-gray-900'
              "
              >Sequence</span
            >
          </span>
        </button>
        <button
          type="button"
          ref="btn-mermaid"
          class="ml-0.5 p-1 lg:pl-2.5 lg:pr-3.5 rounded flex items-center text-sm text-gray-600 font-medium focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus:outline-none focus-visible:ring-offset-gray-100"
          :class="
            diagramType === 'mermaid'
              ? 'bg-white shadow-sm ring-1 ring-black ring-opacity-5'
              : ''
          "
          @click="setActiveTab('mermaid')"
        >
          <span
            class="sr-only lg:not-sr-only text-gray-900"
            :class="
              diagramType === 'mermaid'
                ? 'text-gray-900'
                : 'text-gray-600 group-hover:text-gray-900'
            "
            >Mermaid</span
          >
        </button>
      </div>
      <a class="inline-block help mx-2" target="_blank" :href="templateUrl">
        <button
          class="flex items-center bg-gray-100 px-2 py-1 text-sm font-semibold rounded h-[100%] hover:bg-gray-200"
          @click="templateClick"
        >
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-4 h-4"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
              />
            </svg>
          </span>
          <span>Examples</span>
        </button>
      </a>
      <input
        v-if="diagramType === 'sequence'"
        type="text"
        placeholder="Title"
        :value="seqTitle"
        @input="handleTitleChange"
        class="px-1 border-2 border-solid border-[#091e4224] rounded-[3px] focus:border-[#388bff] hover:border-[#388bff] outline-none transition-[border-color]"
        :class="{ 'border-[#c9372c]': titleError }"
      />
      <input
        v-if="diagramType === 'mermaid'"
        type="text"
        placeholder="Title"
        :value="mermaidTitle"
        @input="handleTitleChange"
        class="px-1 border-2 border-solid border-[#091e4224] rounded-[3px] focus:border-[#388bff] hover:border-[#388bff] outline-none transition-[border-color]"
        :class="{ 'border-[#c9372c]': titleError }"
      />
    </div>
    <div class="flex items-center shrink-0">
      <a class="inline-block help mx-1 ml-2" target="_blank" :href="helpUrl">
        <button
          class="flex items-center bg-gray-100 px-2 py-1 text-gray-600 text-sm font-semibold rounded"
          @click="helpClick"
        >
          <span>
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </span>
          <span>Help</span>
        </button>
      </a>
      <div class="inline-block ml-2 relative group/save">
        <save-and-go-back-button
          class="ml-2"
          :saveAndExit="saveAndExit"
          :disabled="titleError"
        />
        <div
          class="absolute top-full right-0 pt-1 hidden"
          :class="titleError ? 'group-hover/save:block' : ''"
        >
          <div
            class="shadow-md p-2 bg-white text-gray-700 text-sm rounded-sm ring-1 ring-slate-900/5 w-[420px]"
          >
            Please provide a clear and descriptive title to improve clarity,
            facilitate navigation and search on the dashboard, and enhance team
            communication.
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import SaveAndGoBackButton from "@/components/SaveAndGoBackButton.vue";
import { DiagramType } from "@/model/Diagram/Diagram";
import EventBus from "@/EventBus";
import { trackEvent } from "@/utils/window";

export default {
  name: "Header",
  components: {
    SaveAndGoBackButton
  },
  data() {
    return {
      helpUrl: "https://zenuml.atlassian.net/wiki/spaces/Doc/overview",
      seqTitle: "",
      mermaidTitle: "",
      titleError: false
    };
  },
  computed: {
    ...mapState({
      diagramType: state => state.diagram.diagramType,
      seqCode: state => state.diagram.code,
      templateUrl: state =>
        state.diagram.diagramType === "sequence"
          ? `https://github.com/ZenUml/confluence-plugin-cloud/discussions/489`
          : 'https://mermaid.js.org/ecosystem/tutorials.html',
      title: state => state.diagram.title
    }),
    saveAndExit: function() {
      return () => {
        if (this.diagramType === "sequence" && !this.seqTitle) {
          return (this.titleError = true);
        }
        if (this.diagramType === "mermaid" && !this.mermaidTitle) {
          return (this.titleError = true);
        }
        EventBus.$emit("save");
      };
    }
  },
  watch: {
    diagramType: function(newVal) {
      this.$store.dispatch(
        "updateTitle",
        newVal === "mermaid" ? this.mermaidTitle : this.seqTitle
      );
    },
    title: function(newVal) {
      if (this.diagramType === "mermaid") {
        this.mermaidTitle = newVal;
      } else {
        this.seqTitle = newVal;
      }
    }
  },
  methods: {
    ...mapMutations(["updateDiagramType"]),
    setActiveTab(tab) {
      this.updateDiagramType(
        tab === "sequence" ? DiagramType.Sequence : DiagramType.Mermaid
      );
    },
    templateClick() {
      trackEvent("template", "click", this.diagramType);
    },
    helpClick() {
      trackEvent("help", "click", this.diagramType);
    },
    handleTitleChange(value) {
      if (value) {
        this.titleError = false;
      }
      if (this.diagramType === "mermaid") {
        this.mermaidTitle = value.target.value;
      } else {
        this.seqTitle = value.target.value;
      }
      this.$store.dispatch("updateTitle", value.target.value);
    }
  },
  mounted() {
    if (this.diagramType === "mermaid") {
      this.mermaidTitle = this.title;

      const firstLine = this.seqCode?.split("\n")[0];
      if (firstLine?.trimStart().startsWith("title ")) {
        this.seqTitle = firstLine
          .trimStart()
          .substring(6)
          .trim();
      }
    } else {
      this.seqTitle = this.title;
    }
  }
};
</script>
