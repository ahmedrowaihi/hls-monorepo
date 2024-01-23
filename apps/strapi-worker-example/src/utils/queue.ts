import { type hlsifyJob } from "@ahmedrowaihi/hlsify-worker";
// import { videoDB } from "./db";
import { rmFolder } from "./index";

const videoDB = {
  updateVideoStatus: async (id: number, status: string) => {},
};

class Methods {
  hooks = {};
  on = {};
  constructor() {
    this.hooks = {
      prework: this.prework,
      postwork: this.postwork,
    };
    this.on = {
      completed: this.completed,
      failed: this.failed,
      error: this.error,
    };
  }
  async prework(job: hlsifyJob) {
    await videoDB.updateVideoStatus(job.data.id, "encoding");
  }

  async postwork(job: hlsifyJob) {
    await videoDB.updateVideoStatus(job.data.id, "ready");
    // await rmFolder(job.data.input);
  }

  async completed(job: hlsifyJob) {
    console.log(`Job completed with result ${JSON.stringify(job.returnvalue)}`);
  }

  async failed(job?: hlsifyJob, err?: Error) {
    try {
      if (job) {
        await videoDB.updateVideoStatus(job.data.id, "failed");
        console.log(`Job failed with ${err}`);
        await rmFolder(job.data.input, job.data.output);
      }
      if (err) console.log(`Job failed with ${err.message}`);
    } catch (err) {
      if (err instanceof Error) console.log(`Job failed with ${err.message}`);
    }
  }

  async error(err: Error) {
    console.log(`Error: ${err.message}`);
  }
}

export { Methods };
