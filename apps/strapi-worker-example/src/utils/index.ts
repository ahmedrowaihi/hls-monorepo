import { rm } from "fs/promises";
import path from "path";
const base = process.cwd();

export const publicPath = path.join(base, "public");

export const rmFolder = async (...paths: string[]) => {
  for (const path of paths) {
    try {
      await rm(path, { recursive: true, force: true });
    } catch (err) {}
  }
};
