export type ConvertedExpression = {
  use?: string;
  returnName?: string;
  statement: string;
};

export type ConvertedMutation = {
  statements: string[];
  mutationName: string;
};
