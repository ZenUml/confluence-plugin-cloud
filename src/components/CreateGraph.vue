<template>
  <div
    class="fixed top-0 left-0 right-0 bottom-0 bg-[rgba(255,255,255,.9)]"
    :class="{ hidden: !visible }"
  >
    <div
      class="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] p-6 bg-white shadow-md border-[1px] border-solid border-slate-500"
      :class="{ hidden: !modalVisible }"
    >
      <div class="mb-4 text-xl">New Graph</div>
      <div class="flex justify-center gap-2 mb-4">
        <div>Graph Title</div>
        <input
          class="px-1 border-2 border-solid border-[#091e4224] rounded-[3px] focus:border-[#388bff] hover:border-[#388bff] outline-none transition-[border-color]"
          type="text"
          placeholder="Title"
          v-model="title"
          ref="inputRef"
        />
      </div>
      <div class="flex justify-between flex-row-reverse mt-6">
        <Button type="primary" :disabled="!title" @click="handleConfirm"
          >Confirm</Button
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Button from "./AUI/Button.vue";
import MacroUtil from "@/model/MacroUtil";

export default Vue.extend({
  props: {
    onConfirm: {
      type: Function,
      default: () => {}
    }
  },
  components: {
    Button
  },
  data() {
    return {
      inputRef: null as HTMLInputElement | null,
      visible: true,
      modalVisible: false,
      title: ""
    };
  },
  methods: {
    handleConfirm() {
      this.visible = false;
      if (this.onConfirm) {
        this.onConfirm(this.title);
      }
    }
  },
  async mounted() {
    if (await MacroUtil.isCreateNew()) {
      this.modalVisible = true;
      Vue.nextTick(() => {
        if (this.$refs.inputRef)
          (this.$refs.inputRef as any).focus();
      });
    } else {
      this.visible = false;
    }
  },
});
</script>
