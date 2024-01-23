import { spawnSync } from "child_process";
import fs from "fs";
import multer from "multer";
import { platform } from "os";
import path from "path";

import { videoDB } from "./db";

export async function FlushAllData() {
  if (platform() === "win32") {
    spawnSync("taskkill", ["/IM", "ffmpeg.exe", "/F", "/T"]);
    spawnSync("taskkill", ["/IM", "ffprobe.exe", "/F", "/T"]);
  } else {
    spawnSync("killall", ["ffmpeg"]);
    spawnSync("killall", ["ffprobe"]);
  }
  await rmFolder(uploadsPath, outputDir);
  await videoDB.deleteAll();
}

export function mergePath(...paths: string[]) {
  return path.resolve(__dirname, ...paths);
}

export async function rmFolder(...folder: string[]) {
  for (const f of folder) {
    try {
      await fs.promises.rm(f, { recursive: true, force: true });
    } catch (err) {
      console.log(err);
    }
  }
}

export const uploadsPath = path.resolve(__dirname, "uploads");
export const outputDir = path.resolve(__dirname, "output");

const storage = multer.diskStorage({
  destination: function (_, __, cb) {
    if (!fs.existsSync(uploadsPath)) fs.mkdirSync(uploadsPath);
    cb(null, uploadsPath);
  },
  filename: function (_, file, cb) {
    cb(null, Date.now().toString() + path.extname(file.originalname));
  },
});

export const upload = multer({ storage });
