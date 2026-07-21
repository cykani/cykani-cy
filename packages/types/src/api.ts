export type ApiVariables = {
  orgId: string;
  userId: string;
  authMethod: string;
  container: any;
};

export type ApiEnv = {
  Variables: ApiVariables;
};
