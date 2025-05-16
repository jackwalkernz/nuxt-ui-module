export interface Phenotype {
  id: string;
  value: number;
}

export interface Genotype {
  id: string;
  value: number;
}

export interface GenotypeRange {
  id: string;
  name: string;
  max_value: number;
  min_value: number;
  step_count: number;
  large_step_count: number | undefined;
}

export interface PhenotypeRange {
  id: string;
  name: string;
  min_value: number;
  max_value: number;
  step_count: number;
  large_step_count: number | undefined;
}

export interface PopulationEntry {
  id: string;
  genotypes: Genotype[];
  phenotypes: Phenotype[];
}

export interface PhenotypeRangeUpdate {
  phenotype_id: string;
  lower_value: number;
  upper_value: number;
}
