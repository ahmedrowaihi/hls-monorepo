import type { Video } from "./db";

export const generatePlayerHTML = (url: string, video: Video) => {
  let html = `<html><head><title>${video.title}</title>`;
  html += `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/vidstack@^1.0.0/player/styles/default/theme.min.css"/>`;
  html += `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/vidstack@^1.0.0/player/styles/default/layouts/video.min.css"/>`;
  html += `<script src="https://cdn.jsdelivr.net/npm/vidstack@^1.0.0/cdn/with-layouts/vidstack.js" type="module" ></script>`;
  html += `</head><body><h1>${video.title}</h1>`;
  html += `<media-player title="${video.title}" src="/output/${url}/master.m3u8">`;
  html += `<media-provider></media-provider>`;
  html += `<media-video-layout thumbnails="/output/${url}/storyboard.vtt"></media-video-layout>`;
  html += `</media-player>`;

  html += `</body></html>`;

  return html;
};

export const generateVideosListHTML = (videos: Video[]) => {
  let html = `<html><head><title>videos</title></head><body><h1>videos</h1>`;
  html += `<ul>`;
  videos.forEach((v) => {
    const url = v.file_path.split(".")[0];
    html += `<li><a href="/play/${v.id}">${v.id}</a> <a href="/output/${url}/master.m3u8">m3u8</a></li>`;
  });
  html += `</ul></body></html>`;

  return html;
};
