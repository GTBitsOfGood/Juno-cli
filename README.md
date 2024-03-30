# Juno CLI
This repo provides a Command Line Interface for [Juno](https://github.com/GTBitsOfGood/juno), [Bits of Good](https://bitsofgood.org/)'s central infrastructure API, integrating several in-house services to simplify and streamline project development.

The CLI attempts to expose a user-friendly interface for BoG teams to directly interface with Juno outside of their project files.

*Coverage of different internal Juno routes may vary. Not all Juno server routes will be provided via the CLI.

## Repo Structure

The project uses [yargs](https://www.npmjs.com/package/yargs) for creating a CLI. Testing will be added with [Jest](https://jestjs.io/) at some point.

- `src/` contains source files
- `dist/` contains built files
- `src/cli.d.ts` contains types

## Installation

## Building from Source

Clone the repo and install required dependencies with:

```
yarn install --frozen lockfile
```

To build:

```
yarn build
```

The CLI can be run with the built index.js file in dist:

```
node /dist/index.js
```
