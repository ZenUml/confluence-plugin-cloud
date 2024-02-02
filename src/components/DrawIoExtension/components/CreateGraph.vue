<template>
  <div
    class="fixed top-0 left-0 right-0 bottom-0 bg-[rgba(255,255,255,.9)]"
    :class="{ hidden: !visible }"
  >
    <div
      class="w-[630px] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] p-6 bg-white shadow-md border-[1px] border-solid border-slate-500"
    >
      <div class="mb-4 text-xl">
        {{ forEnforceTitle ? "Set title" : "Create New Graph" }}
      </div>
      <div class="flex gap-2 mb-4">
        <div>Graph Title</div>
        <input
          class="px-1 border-2 border-solid border-[#091e4224] rounded-[3px] focus:border-[#388bff] hover:border-[#388bff] outline-none transition-[border-color]"
          type="text"
          placeholder="Title"
          v-model="title"
          ref="inputRef"
        />
      </div>
      <div class="text-gray-500 flex gap-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="34"
          height="24"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
          <path d="M12 9h.01" />
          <path d="M11 12h1v4h1" />
        </svg>
        <div>
          Please provide a clear and descriptive title to improve clarity,
          facilitate navigation and search on the dashboard, and enhance team
          communication.
        </div>
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
import { defineComponent, nextTick, ref } from "vue";
import Button from "@/components/AUI/Button.vue";

export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    defaultTitle: {
      type: String,
      default: ""
    },
    forEnforceTitle: Boolean,
    onConfirm: {
      type: Function,
      default: () => {}
    }
  },
  components: {
    Button
  },
  setup(props) {
    const inputRef = ref<HTMLInputElement>();
    const title = ref(props.defaultTitle);

    const handleConfirm = () => {
      if (props.onConfirm) {
        props.onConfirm(title.value);
      }
    };

    nextTick(() => {
      if (inputRef.value) {
        inputRef.value.focus();
      }
    });

    return {
      inputRef,
      title,
      handleConfirm
    };
  }
});
</script>
