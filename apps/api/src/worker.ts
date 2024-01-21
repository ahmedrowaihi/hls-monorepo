import { LocalStorageAdapter, encodeVideo } from "@ahmedrowaihi/encode";
import type { Job } from "bullmq";
import { Queue, Worker } from "bullmq";
import { videoDB } from "./db";
import { rmFolder } from "./utils";

type JobData = {
  id: number;
  title: string;
  output: string;
  input: string;
};

export function createWorkers(numOfWorkers: number) {
  var connection = { connection: { host: "localhost", port: 6379 } };
  const encodeq = "encode";
  const queue = new Queue(encodeq, connection);

  const workers = [] as Worker<JobData>[];
  for (var i = 0; i < numOfWorkers; i++) {
    workers[i] = new Worker(encodeq, encodeWorker, connection);
    workers[i].on("completed", onCompleted);
    workers[i].on("failed", onFailed);
    workers[i].on("error", onError);
  }

  console.log(`⚡️ workers: <${workers.length}>`);
  return { workers, queue };
}

async function encodeWorker(job: Job<JobData>) {
  if (!job.data) throw new Error("no job data");

  await videoDB.updateVideoStatus(job.data.id, "encoding");
  await rmFolder(job.data.output);
  await encodeVideo({
    input: job.data.input,
    output: job.data.output,
    adapter: new LocalStorageAdapter(),
  });

  return job.data;
}

async function onCompleted(job: Job<JobData>) {
  await videoDB.updateVideoStatus(job.data.id, "ready");
  await rmFolder(job.data.input);
  console.log(`Job completed with result ${JSON.stringify(job.returnvalue)}`);
}

async function onFailed(job?: Job<JobData>, err?: Error) {
  try {
    if (job) {
      await videoDB.updateVideoStatus(job.data.id, "failed");
      console.log(`Job failed with ${err}`);
      await rmFolder(job.data.input);
    }
    if (err) console.log(`Job failed with ${err.message}`);
  } catch (err) {
    if (err instanceof Error) console.log(`Job failed with ${err.message}`);
  }
}

async function onError(err: Error) {
  console.log(`Error: ${err.message}`);
}

export const { workers, queue } = createWorkers(4);
