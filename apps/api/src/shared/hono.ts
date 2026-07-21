import { Hono } from "hono";

export type ApiEnv = {
  Variables: {
    orgId: string;
    userId: string;
    container: any;
  };
};

export type ApiHono = Hono<ApiEnv>;
