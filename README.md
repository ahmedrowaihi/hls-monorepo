# HLS Mono Express.js/ffmpeg PoC

## Using this example

Run the following command:

```sh
git clone https://github.com/ahmedrowaihi/hls-monorepo
```

## Getting Started

### Installation

```sh
pnpm install
```

### Running the app

```sh
pnpm dev
```

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `api`: a [Express.js](https://expressjs.com/) app | simple PoC for upload/encode video to hls
- `hlsify`: a portable [Node.js](https://nodejs.org/en/) package that utilizes [ffmpeg](https://ffmpeg.org/) to encode video to hls
- `hlsify-worker`: a framework agnostic pre-setup `mq` worker for `hlsify` package, with hot sauce 🌶️ and hooks 🔗.

#### examples

- `app/api` app uses `hlsify` package to encode video to hls
- other examples are at [hlsify](https://github.com/ahmedrowaihi/hlsify-example) repo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).
