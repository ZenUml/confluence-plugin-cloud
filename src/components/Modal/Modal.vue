<template>
  <div
    class="fixed top-0 left-0 right-0 bottom-0 bg-[rgba(0,0,0,.5)]"
    :class="{ hidden: !visible }"
  >
    <div
      class="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] p-6 bg-white shadow-md border-[1px] border-solid border-slate-500 rounded-sm"
    >
      <div class="">
        <slot name="header"></slot>
      </div>
      <div class="pb-4">
        <slot name="body"></slot>
      </div>
      <div class="flex gap-4 justify-end">
        <Button @click="handleCancel">Cancel</Button>
        <Button @click="handleConfirm" type="primary">Confirm</Button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Button from "@/components/AUI/Button.vue";

export default defineComponent({
  components: {
    Button,
  },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    onConfirm: {
      type: Function,
      required: true,
    },
    onCancel: {
      type: Function,
      required: true,
    },
  },
  setup(props: any) {
    const handleConfirm = () => {
      props.onConfirm();
    };

    const handleCancel = () => {
      props.onCancel();
    };

    return { handleConfirm, handleCancel };
  },
});
</script>
