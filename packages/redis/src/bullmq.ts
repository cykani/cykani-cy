import { Queue, Worker } from "bullmq";
import type Redis from "ioredis";

export function createQueue(name: string, connection: Redis): Queue {
  return new Queue(name, {
    connection: connection.duplicate() as any,
    defaultJobOptions: {
      removeOnComplete: { age: 3600 },
      removeOnFail: { age: 86400 },
      attempts: 3,
      backoff: { type: "exponential", delay: 2000 },
    },
  });
}

export function createWorker(
  name: string,
  connection: Redis,
  handler: (jobData: any) => Promise<void>
): Worker {
  return new Worker(
    name,
    async (job) => {
      await handler(job.data);
    },
    {
      connection: connection.duplicate() as any,
      concurrency: 5,
    }
  );
}
