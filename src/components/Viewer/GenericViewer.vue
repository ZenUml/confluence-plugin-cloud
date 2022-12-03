<template>
<!-- screen-capture-content class is used in Attachment.js to select the node. -->
<div class="generic viewer mx-1 pr-2">
  <Debug />
  <error-boundary>

  <div class="flex justify-center">
    <div class="frame relative pb-8 m-1" :class="{'w-full': wide, 'min-w-[300px]': !width}">
      <div class="header flex" :class="{flex: isDisplayMode, hidden: !isDisplayMode}">
        <div class="left">
          <div class="actions flex" :class="{flex: isDisplayMode, hidden: !isDisplayMode}">
            <div v-show="isLite">
              <div class="p-1 text-xs font-bold leading-none text-gray-300 bg-gray-100 rounded">Lite</div>
            </div>
            <button @click="edit" v-show="this.canUserEdit" class="p-1">
              <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M0.0200123 15.23C-0.0130986 15.392 -0.00552525 15.5597 0.0420541 15.718C0.0896335 15.8764 0.175734 16.0205 0.292649 16.1374C0.409564 16.2543 0.553645 16.3404 0.711994 16.388C0.870343 16.4355 1.03802 16.4431 1.20001 16.41L5.01001 15.63L0.800013 11.42L0.0200123 15.23ZM5.94101 12.61L3.82101 10.49L12.306 2H12.308L14.429 4.121L5.94001 12.611L5.94101 12.61ZM15.844 2.707L13.724 0.585004C13.5381 0.399083 13.3173 0.251699 13.0743 0.15131C12.8314 0.0509205 12.5709 -0.000498213 12.308 3.63842e-06C11.796 3.63842e-06 11.284 0.195004 10.893 0.585004L1.13601 10.343L6.08601 15.293L15.843 5.535C16.218 5.15995 16.4286 4.65133 16.4286 4.121C16.4286 3.59068 16.218 3.08206 15.843 2.707H15.844Z" fill="#47566F"/>
              </svg>
            </button>
            <button @click="fullscreen" class="p-1">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M2 14H5C5.26522 14 5.51957 14.1054 5.70711 14.2929C5.89464 14.4804 6 14.7348 6 15C6 15.2652 5.89464 15.5196 5.70711 15.7071C5.51957 15.8946 5.26522 16 5 16H2C1.46957 16 0.960859 15.7893 0.585786 15.4142C0.210714 15.0391 0 14.5304 0 14V11C0 10.7348 0.105357 10.4804 0.292893 10.2929C0.48043 10.1054 0.734784 10 1 10C1.26522 10 1.51957 10.1054 1.70711 10.2929C1.89464 10.4804 2 10.7348 2 11V14ZM14 16H11C10.7348 16 10.4804 15.8946 10.2929 15.7071C10.1054 15.5196 10 15.2652 10 15C10 14.7348 10.1054 14.4804 10.2929 14.2929C10.4804 14.1054 10.7348 14 11 14H14V11C14 10.7348 14.1054 10.4804 14.2929 10.2929C14.4804 10.1054 14.7348 10 15 10C15.2652 10 15.5196 10.1054 15.7071 10.2929C15.8946 10.4804 16 10.7348 16 11V14C16 14.5304 15.7893 15.0391 15.4142 15.4142C15.0391 15.7893 14.5304 16 14 16ZM2 0H5C5.26522 0 5.51957 0.105357 5.70711 0.292893C5.89464 0.48043 6 0.734784 6 1C6 1.26522 5.89464 1.51957 5.70711 1.70711C5.51957 1.89464 5.26522 2 5 2H2V5C2 5.26522 1.89464 5.51957 1.70711 5.70711C1.51957 5.89464 1.26522 6 1 6C0.734784 6 0.48043 5.89464 0.292893 5.70711C0.105357 5.51957 0 5.26522 0 5V2C0 1.46957 0.210714 0.960859 0.585786 0.585786C0.960859 0.210714 1.46957 0 2 0ZM14 2H11C10.7348 2 10.4804 1.89464 10.2929 1.70711C10.1054 1.51957 10 1.26522 10 1C10 0.734784 10.1054 0.48043 10.2929 0.292893C10.4804 0.105357 10.7348 0 11 0H14C14.5304 0 15.0391 0.210714 15.4142 0.585786C15.7893 0.960859 16 1.46957 16 2V5C16 5.26522 15.8946 5.51957 15.7071 5.70711C15.5196 5.89464 15.2652 6 15 6C14.7348 6 14.4804 5.89464 14.2929 5.70711C14.1054 5.51957 14 5.26522 14 5V2Z" fill="#47566F"/>
              </svg>
            </button>
          </div>
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
import {DataSource, DiagramType, NULL_DIAGRAM} from "@/model/Diagram/Diagram";
import defaultContentProvider from "@/model/ContentProvider/CompositeContentProvider";
import AP from "@/model/AP";
import Example from "@/utils/sequence/Example";
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
    ...mapState({diagramType: 'diagramType', diagram: 'diagram' }),
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
    this.$store.state.diagram = doc;
    this.doc = doc;
    await globals.apWrapper.initializeContext();
    const canUserEditPage = await globals.apWrapper.canUserEdit();
    const storedWithCustomContent = this.doc?.source === DataSource.CustomContent;
    const notCopy = !this.doc?.isCopy;
    this.canUserEdit = canUserEditPage && storedWithCustomContent && notCopy;
  },
  watch: {
    diagram(doc) {
      console.debug('Document changed', doc);
      this.$store.commit('updateDiagramType', ( !this.doc.diagramType || this.doc.diagramType === DiagramType.Unknown) ? DiagramType.Sequence : this.doc.diagramType);

      this.$store.commit('code', doc.code || Example.Sequence);
      this.rawStyles = doc.styles || {};
      EventBus.$emit('diagramLoaded', doc.code, doc.diagramType);
    }
  },
  methods: {
    edit() {
      EventBus.$emit('edit');
    },
    fullscreen() {
      EventBus.$emit('fullscreen');
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
