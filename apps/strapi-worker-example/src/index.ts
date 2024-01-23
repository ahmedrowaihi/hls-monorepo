import { createWorkers } from "@ahmedrowaihi/hlsify-worker";
import { Methods } from "./utils/queue";
export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    if (!strapi) throw new Error("strapi is undefined");

    const { queue, add } = await createWorkers({
      count: 4,
      ...new Methods(),
      opts: {
        connection: {
          host: process.env.REDIS_HOST || "localhost",
          port: parseInt(process.env.REDIS_PORT || "6379"),
        },
      },
    });
    if (strapi.queue) delete strapi.queue;
    strapi.queue = queue;
    if (strapi.addH) delete strapi.addH;
    strapi.addH = add;
  },
};
