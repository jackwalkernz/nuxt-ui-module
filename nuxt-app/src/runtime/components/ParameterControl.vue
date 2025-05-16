<template>
  <div class="w-full h-full flex flex-row items-center justify-center p-4">
    <h1 class="text-md font-semibold text-secondary">
      {{ props.phenotypeRange.name }}
    </h1>
    <div class="w-full flex flex-row items-center justify-center gap-4">
      <UInputNumber
        v-model="lowerValue"
        :min="lower_bound.min_value"
        :max="lower_bound.max_value"
      />
      <UInputNumber
        v-model="upperValue"
        :min="upper_bound.min_value"
        :max="upper_bound.max_value"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  phenotypeRange: {
    type: Object as PropType<PhenotypeRange>,
    required: true,
  },
});

interface Bound {
  min_value: number;
  max_value: number;
}

const lowerValue = ref<number>(props.phenotypeRange.min_value);
const upperValue = ref<number>(props.phenotypeRange.max_value);
const lower_bound = computed<Bound>(() => {
  return {
    min_value: props.phenotypeRange.min_value,
    max_value: upperValue.value,
  };
});

const upper_bound = computed<Bound>(() => {
  return {
    min_value: lowerValue.value,
    max_value: props.phenotypeRange.max_value,
  };
});
</script>
