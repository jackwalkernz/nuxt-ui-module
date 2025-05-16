<template>
  <div class="w-full h-screen grid grid-cols-1 grid-rows-3 p-4">
    <div
      class="w-full h-full row-start-1 row-end-2 col-start-1 col-end-1 col-span-2 row-span-3 p-4 border-primary rounded-lg border drop-shadow"
    >
      <svg ref="svgContainer" class="w-full h-screen" height="500">
        <line
          v-for="position in phenotypePositions"
          :key="position"
          :x1="position"
          :x2="position"
          :y1="startingYPosition"
          :y2="usableHeight"
          stroke="lightGray"
        />
        <line
          :x1="dashedPosition"
          :x2="dashedPosition"
          :y1="startingYPosition - 20"
          :y2="usableHeight + 20"
          stroke="lightGray"
          stroke-dasharray="5,5"
        />
        <line
          v-for="position in genotypePositions"
          :key="position"
          :x1="position"
          :x2="position"
          :y1="startingYPosition"
          :y2="usableHeight"
          stroke="lightBlue"
          stroke-width="1.5"
        />
        <text
          v-for="item in allLabels"
          :key="item.label"
          :x="item.x_position"
          :y="startingYPosition - 10"
          text-anchor="middle"
          font-size="12"
          font-weight="bold"
          fill="gray"
          font="Arial"
        >
          {{ item.label }}
        </text>
      </svg>
    </div>
    <div class="flex flex-col items-center justify-center">
      <ParameterControl
        v-for="phenotype in phenotypeRanges"
        :key="phenotype.id"
        :phenotype-range="phenotype"
        class="gap-4 py-2"
        @update-lower-value="handleUpdateLowerValue"
        @update-upper-value="handleUpdateUpperValue"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, useTemplateRef } from "#imports";
import { useElementBounding } from "@vueuse/core";
import type {
  GenotypeRange,
  PhenotypeRange,
  PhenotypeRangeUpdate,
} from "~/types";

const svgContainer = useTemplateRef("svgContainer");
const paddingY = ref(20);
const paddingX = ref(60);
const { width, height } = useElementBounding(svgContainer);

//determine the area of the svg container with padding
const usableWidth = computed(() => {
  const paddingTotal = paddingX.value * 2;
  const widthValue = width.value - paddingTotal;
  return widthValue;
});

/**
 * Determine the height of the svg container wit padding
 */
const usableHeight = computed(() => {
  const paddingTotal = paddingY.value * 2;
  const heightValue = height.value - paddingTotal;
  return heightValue;
});

//determine the starting x and y position of the genotype and phenotype lines
const startingXPosition = computed(() => paddingX.value);
const startingYPosition = computed(() => paddingY.value + 10);

const phenotypeRanges = reactive<PhenotypeRange[]>([
  {
    id: "a",
    name: "Phenotype 1",
    max_value: 200,
    min_value: 54,
    step_count: 20,
    large_step_count: 5,
  },
  {
    id: "b",
    name: "Phenotype 2",
    max_value: 664,
    min_value: 354,
    step_count: 20,
    large_step_count: 5,
  },
  {
    id: "c",
    name: "Phenotype 3",
    max_value: 23,
    min_value: 10,
    step_count: 20,
    large_step_count: 5,
  },
  {
    id: "d",
    name: "Phenotype 4",
    max_value: 0.56,
    min_value: 0.005,
    step_count: 20,
    large_step_count: 5,
  },
  {
    id: "e",
    name: "Phenotype 5",
    max_value: 2342,
    min_value: 345,
    step_count: 20,
    large_step_count: 5,
  },
]);

const genotypeRanges = reactive<GenotypeRange[]>([
  {
    id: "a",
    name: "Genotype 1",
    max_value: 200,
    min_value: 20,
    step_count: 20,
    large_step_count: 5,
  },
  {
    id: "b",
    name: "Genotype 2",
    max_value: 200,
    min_value: 20,
    step_count: 20,
    large_step_count: 5,
  },
  {
    id: "c",
    name: "Genotype 3",
    max_value: 200,
    min_value: 20,
    step_count: 20,
    large_step_count: 5,
  },
  {
    id: "d",
    name: "Genotype 4",
    max_value: 200,
    min_value: 20,
    step_count: 20,
    large_step_count: 5,
  },
]);

const genotypeCount = computed(() => genotypeRanges.length);
const phenotypeCount = computed(() => phenotypeRanges.length);
const totalCount = computed(() => genotypeCount.value + phenotypeCount.value);

/**
 * Determine the x positions of the slider centers
 */
interface PositionCollection {
  phenotype_positions: number[];
  genotype_positions: number[];
  positions: number[];
}

const sliderPositions = computed<PositionCollection>(() => {
  const count = totalCount.value - 1;
  const collection: PostionCollection = {
    phenotype_positions: [],
    genotype_positions: [],
    positions: [],
  };
  const approximateDistanceBetween = usableWidth.value / count;
  let initialValue = startingXPosition.value;
  for (let index = 0; index <= count; index++) {
    if (index < phenotypeCount.value) {
      collection.phenotype_positions.push(initialValue);
    } else {
      collection.genotype_positions.push(initialValue);
    }
    collection.positions.push(initialValue);
    initialValue += approximateDistanceBetween;
  }
  return collection;
});

const phenotypePositions = computed(
  () => sliderPositions.value.phenotype_positions
);

const genotypePositions = computed(
  () => sliderPositions.value.genotype_positions
);

const dashedPosition = computed(() => {
  const lastPhenotypePosition = phenotypePositions.value.at(-1);
  const firstGenotypePosition = genotypePositions.value.at(0);
  if (lastPhenotypePosition && firstGenotypePosition) {
    return (lastPhenotypePosition + firstGenotypePosition) / 2;
  }
  return -1;
});

// label genotypes and phenotypes

interface Label {
  label: string;
  x_position: number;
}

interface LabelCollection {
  phenotype_labels: Label[];
  genotype_labels: Label[];
  all_labels: Label[];
}

const labels = computed<LabelCollection[]>(() => {
  const genotype_labels: Label[] = [];
  for (let index = 0; index < genotypeCount.value; index++) {
    const label = genotypeRanges[index].name;
    const x_position = genotypePositions.value[index];
    genotype_labels.push({ label, x_position });
  }
  const phenotype_labels: Label[] = [];
  for (let index = 0; index < phenotypeCount.value; index++) {
    const label = phenotypeRanges[index].name;
    const x_position = phenotypePositions.value[index];
    phenotype_labels.push({ label, x_position });
  }
  return {
    phenotype_labels,
    genotype_labels,
    all_labels: [...phenotype_labels, ...genotype_labels],
  };
});

const allLabels = computed(() => labels.value.all_labels);

const handleUpdateLowerValue = (phenotypeRangeUpdate: PhenotypeRangeUpdate) => {
  const phenotypeIndex = phenotypeRanges.findIndex(
    (phenotype) => phenotype.id === phenotypeRangeUpdate.phenotype_id
  );
  if (phenotypeIndex !== -1) {
    phenotypeRanges[phenotypeIndex].min_value =
      phenotypeRangeUpdate.lower_value;
  }
};

const handleUpdateUpperValue = (phenotypeRangeUpdate: PhenotypeRangeUpdate) => {
  const phenotypeIndex = phenotypeRanges.findIndex(
    (phenotype) => phenotype.id === phenotypeRangeUpdate.phenotype_id
  );
  if (phenotypeIndex !== -1) {
    phenotypeRanges[phenotypeIndex].min_value =
      phenotypeRangeUpdate.lower_value;
  }
};
</script>
