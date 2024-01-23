import { resolve } from "path";
import { publicPath, rmFolder } from "../../../../utils";

export default {
  async afterCreate(event) {
    const { result } = event;
    const output = result.pk;
    const input = result.video.url.split("/").pop();
    if ((strapi as any).addH) {
      (strapi as any)
        .addH({
          id: result.id,
          title: result.title.replace(/\s/g, "-"),
          output: resolve(publicPath, "uploads", output),
          input: resolve(publicPath, "uploads", input),
        })
        .catch((err: Error) => {
          console.log(err);
        });
    }
  },
  async beforeDelete(event) {
    const { params } = event;
    try {
      const getItems = await strapi.api.blog
        .service("blog")
        .find({ id: params.where.id });
      const output = getItems.results[0].pk;
      await rmFolder(resolve(publicPath, "uploads", output));
    } catch (err) {}
  },
};
