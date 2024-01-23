import cors from "cors";
import express from "express";
import morgan from "morgan";

import { generatePlayerHTML, generateVideosListHTML } from "./templates";

import { videoDB } from "./db";
import { addBulk, obliterate, queue } from "./queue";

import {
  FlushAllData,
  mergePath,
  outputDir,
  upload,
  uploadsPath,
} from "./utils";

const app = express();

app.use(morgan("dev"));
app.use(cors({ origin: "*" }));

app.use("/output", express.static(outputDir), (_, res, next) => {
  res.set("Content-Type", "application/x-mpegURL");
  next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// no cache
app.use((_, res, next) => {
  res.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  next();
});

app.get("/play/:id", async (req, res) => {
  const { id } = req.params;
  const video = await videoDB.get(id);

  if (!video) return res.status(404).json({ error: "video not found" });

  const url = video.file_path.split(".")[0];
  res.set("Content-Type", "text/html");
  res.send(generatePlayerHTML(url, video));
});

app.get("/", async (_, res) => {
  const videos = await videoDB.getAll();
  res.set("Content-Type", "text/html");
  res.send(generateVideosListHTML(videos));
});

app.post("/upload", upload.array("files", 5), async (req, res) => {
  let files = (req.files as Express.Multer.File[]) || [];
  if (!files) {
    res.status(400).json({ error: "no file found" });
    return;
  }
  try {
    const videos = await videoDB.create(
      files.map((file) => ({
        title: file.originalname,
        file_path: file.filename,
      }))
    );

    await addBulk(
      videos.map((video) => ({
        id: video.id,
        title: video.title,
        output: mergePath(outputDir, video.file_path.split(".")[0]),
        input: mergePath(uploadsPath, video.file_path),
      }))
    );

    res.json({
      ok: true,
    });
  } catch (err) {
    if (err instanceof Error) res.status(500).json({ error: err.message });
    else res.status(500).json({ error: "unknown error" });
  }
});

app.get("/f", async (_, res) => {
  await obliterate();
  await FlushAllData();
  res.json({ ok: true });
});

app.get("/q", async (_, res) => {
  const jobs = await queue.getJobs();
  res.set("Content-Type", "application/json");
  console.log(jobs);
  res.json(jobs);
});

const port = process.env.PORT || 5001;
const host = process.env.HOST || "http://localhost";
app.listen(port, () => {
  console.log(`api running at ${host}:${port}`);
});
