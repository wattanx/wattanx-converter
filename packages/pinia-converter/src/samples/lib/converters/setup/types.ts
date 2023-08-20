export type ConvertedExpression = {
  use?: string;
  returnName?: string;
  statement: string;
};

export type ConverterMutation = {
  statements: string[];
  mutationName: string;
};
