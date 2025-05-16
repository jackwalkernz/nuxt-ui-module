<template>
  <div class="w-full h-full flex flex-row items-center justify-start gap-4">
    <div class="w-full flex flex-row items-center justify-start gap-2 p-2">
      <h1 class="text-md font-semibold text-secondary">
        {{ props.phenotypeRange.name }}
      </h1>
      <UCheckbox v-model="exactValue" label="Use exact value" class="px-3" />
      <div v-if="exactValue" class="flex flex-row items-center justify-start">
        <UInputNumber
          v-model="value"
          :min="props.phenotypeRange.min_value"
          :max="props.phenotypeRange.max_value"
          variant="soft"
        />
      </div>
      <div v-else class="flex flex-row items-center jusify-center gap-2">
        <UInputNumber
          v-model="lowerValue"
          :min="props.phenotypeRange.min_value"
          :max="lower_bound.max_value"
          variant="soft"
        />
        <UInputNumber
          v-model="upperValue"
          :min="upper_bound.min_value"
          :max="props.phenotypeRange.max_value"
          variant="soft"
        />
      </div>
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

const exactValue = ref(true);

const value = ref(
  (props.phenotypeRange.min_value + props.phenotypeRange.max_value) / 2
);

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

const emits = defineEmits(["updateLowerValue", "updateUpperValue"]);

watch(lowerValue, (newValue) => {
  emits("updateLowerValue", {
    phenotype_id: props.phenotypeRange.id,
    lower_value: newValue,
    upper_value: upperValue.value,
  } as PhenotypeRangeUpdate);
});

watch(upperValue, (newValue) => {
  emits("updateUpperValue", {
    phenotype_id: props.phenotypeRange.id,
    lower_value: lowerValue.value,
    upper_value: newValue,
  } as PhenotypeRangeUpdate);
});
</script>
