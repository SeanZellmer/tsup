# tsup

Rollup + [esbuild](https://github.com/evanw/esbuild).

This library is intentionally kept simple, if you want customizations please use Rollup directly.

## Why Rollup?

> Rollup is at least an order of magnitude slower than esbuild, why not use esbuild directly?

Because esbuild isn't mature enough, here we use Rollup to bundle `.d.ts` files, add code splitting support, import non-js assets etc. tsup uses esbuild to compile TypeScript/ESNext code to ES2015.

## Install

Install it locally in your project folder:

```bash
npm i tsup -D
# Or Yarn
yarn add tsup --dev
```

You can also install it globally but it's not recommended.

## Usage

### Bundle files

```bash
tsup [...files]
```

Files are written into `./dist`.

### Generate declaration file

```bash
tsup index.ts --dts
```

This will emit `./dist/index.js` and `./dist/index.d.ts`.

### Bundle files and node modules

```bash
tsup [...files] --bundle
```

`dependencies` in your `packages.json` are always excluded, you can also use `--external <module>` flag to mark specific package as external.

When you're bundling a lot files, this can be 10x~200x slower than esbuild.

### Run a program

```bash
tsup run main.ts
```

---

For more details:

```bash
tsup --help
```

## License

MIT &copy; [EGOIST (Kevin Titor)](https://github.com/sponsors/egoist)
