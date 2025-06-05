export type PartialRecord<K extends keyof unknown, T> = {
  [P in K]?: T;
};
