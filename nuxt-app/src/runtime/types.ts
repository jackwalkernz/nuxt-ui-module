export interface Phenotype {
  name: string;
  max_value: number;
  min_value: number;
  step_count: number;
  large_step_count: number | undefined;
}

export interface Genotype {
  name: string;
  max_value: number;
  min_value: number;
  step_count: number;
  large_step_count: number | undefined;
}
