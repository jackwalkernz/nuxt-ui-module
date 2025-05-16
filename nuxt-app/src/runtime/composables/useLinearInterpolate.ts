export const useLinearInterpolate = (start: number, end: number, t: number) => {
  return start + (end - start) * t;
};
