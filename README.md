# Turborepo Express.js/ffmpeg PoC

## Using this example

Run the following command:

```sh
git clone https://github.com/ahmedrowaihi/turborepo-express-ffmpeg-poc.git
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
- `econde`: a portable [Node.js](https://nodejs.org/en/) package that utilizes [ffmpeg](https://ffmpeg.org/) to encode video to hls
- `eslint-config-custom`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `tsconfig`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).
