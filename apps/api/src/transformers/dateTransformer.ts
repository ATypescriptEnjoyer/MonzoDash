export const dateTransformer = {
  from: (value: string) => new Date(value),
  to: (value: Date) => value.toISOString(),
};
