# tsup

[![npm version](https://badgen.net/npm/v/tsup)](https://npm.im/tsup) [![npm downloads](https://badgen.net/npm/dm/tsup)](https://npm.im/tsup)

Bundle your TypeScript library with no config, powered by [esbuild](https://github.com/evanw/esbuild).

## 👀 What can it bundle?

Anything that's supported by Node.js natively, namely `.js`, `.json`, `.mjs`. And TypeScript `.ts`, `.tsx`. [CSS support is experimental](https://tsup.egoist.dev/#css-support).

## ⚙️ Install

Install it locally in your project folder:

```bash
npm i tsup -D
# Or Yarn
yarn add tsup --dev
```

You can also install it globally but it's not recommended.

## 📖 Usage

### Bundle files

```bash
tsup [...files]
```

Files are written into `./dist`.

You can bundle multiple files in one go:

```bash
tsup src/index.ts src/cli.ts
```

This will output `dist/index.js` and `dist/cli.js`.

## 📚 Documentation

For complete usages, please dive into the [docs](https://tsup.egoist.dev).

For all configuration options, please see [the API docs](https://paka.dev/npm/tsup#module-index-export-Options).

## 💬 Discussions

Head over to the [discussions](https://github.com/egoist/tsup/discussions) to share your ideas.

## Sponsors

<a href="https://chromatic.com" target="_blank"><img src="https://fastly.jsdelivr.net/gh/egoist-bot/images@main/uPic/Frame%203.png" width="700" alt="chromatic"></a>

[![sponsors](https://sponsors-images.egoist.dev/sponsors.svg)](https://github.com/sponsors/egoist)

## Project Stats

![Alt](https://repobeats.axiom.co/api/embed/4ef361ec8445b33c2dab451e1d23784015834c72.svg 'Repobeats analytics image')

## License

MIT &copy; [EGOIST](https://github.com/sponsors/egoist)
