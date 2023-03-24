import { InputOptions, OutputOptions, Plugin } from 'rollup'
import { makeLabel, NormalizedOptions } from './'
import dtsPlugin from 'rollup-plugin-dts'
import hashbangPlugin from 'rollup-plugin-hashbang'
import jsonPlugin from '@rollup/plugin-json'
import { handleError } from './errors'
import { getDeps, removeFiles, loadTsConfig } from './utils'
import { TsResolveOptions, tsResolvePlugin } from './rollup/ts-resolve'

type RollupConfig = {
  inputConfig: InputOptions
  outputConfig: OutputOptions
}

const getRollupConfig = async (
  options: NormalizedOptions
): Promise<RollupConfig> => {
  const compilerOptions: {
    baseUrl?: string
    paths?: Record<string, string[]>
  } = await loadTsConfig(process.cwd()).then(
    (res) => res.data?.compilerOptions || {}
  )

  const dtsOptions =
    typeof options.dts === 'string'
      ? { entry: options.dts }
      : options.dts === true
      ? { entry: options.entryPoints }
      : { entry: options.entryPoints, ...options.dts }

  let tsResolveOptions: TsResolveOptions | undefined

  if (dtsOptions.resolve) {
    tsResolveOptions = {}
    // Only resolve speicifc types when `dts.resolve` is an array
    if (Array.isArray(dtsOptions.resolve)) {
      tsResolveOptions.resolveOnly = dtsOptions.resolve
    }

    // `paths` should be handled by rollup-plugin-dts
    if (compilerOptions.paths) {
      const res = Object.keys(compilerOptions.paths).map(
        (p) => new RegExp(`^${p.replace('*', '.+')}$`)
      )
      tsResolveOptions.ignore = (source) => {
        return res.some((re) => re.test(source))
      }
    }
  }

  const deps = await getDeps(process.cwd())

  const tsupCleanPlugin: Plugin = {
    name: 'tsup:clean',
    async buildStart() {
      if (options.clean) {
        await removeFiles(['**/*.d.ts'], options.outDir)
      }
    },
  }

  return {
    inputConfig: {
      input: dtsOptions.entry,
      onwarn(warning, handler) {
        if (
          warning.code === 'UNRESOLVED_IMPORT' ||
          warning.code === 'CIRCULAR_DEPENDENCY' ||
          warning.code === 'EMPTY_BUNDLE'
        ) {
          return
        }
        return handler(warning)
      },
      plugins: [
        tsupCleanPlugin,
        tsResolveOptions && tsResolvePlugin(tsResolveOptions),
        hashbangPlugin(),
        jsonPlugin(),
        dtsPlugin({
          compilerOptions:
            compilerOptions.baseUrl && compilerOptions.paths
              ? {
                  baseUrl: compilerOptions.baseUrl,
                  paths: compilerOptions.paths,
                }
              : undefined,
        }),
      ].filter(Boolean),
      external: [...deps, ...(options.external || [])],
    },
    outputConfig: {
      dir: options.outDir || 'dist',
      format: 'esm',
      exports: 'named',
    },
  }
}

async function runRollup(options: RollupConfig) {
  const { rollup } = await import('rollup')
  try {
    const start = Date.now()
    const getDuration = () => {
      return `${Math.floor(Date.now() - start)}ms`
    }
    console.log(`${makeLabel('dts', 'info')} Build start`)
    const bundle = await rollup(options.inputConfig)
    await bundle.write(options.outputConfig)
    console.log(
      `${makeLabel('dts', 'success')} Build success in ${getDuration()}`
    )
  } catch (error) {
    console.log(`${makeLabel('dts', 'error')} Build error`)
    handleError(error)
  }
}

async function watchRollup(
  options: {
    inputConfig: InputOptions
    outputConfig: OutputOptions
  },
  waitForEsbuild: WaitForEsbuild
) {
  const { watch } = await import('rollup')

  watch({
    ...options.inputConfig,
    plugins: [
      {
        name: 'wait-for-esbuild',
        async buildStart() {
          await waitForEsbuild()
        },
      },
      ...(options.inputConfig.plugins || []),
    ],
    output: options.outputConfig,
  }).on('event', async (event) => {
    if (event.code === 'START') {
      console.log(`${makeLabel('dts', 'info')} Build start`)
    } else if (event.code === 'BUNDLE_END') {
      console.log(
        `${makeLabel('dts', 'success')} Build success in ${event.duration}ms`
      )
    } else if (event.code === 'ERROR') {
      console.log(`${makeLabel('dts', 'error')} Build failed`)
      console.log(event.error)
      handleError(event.error)
    }
  })
}

type WaitForEsbuild = () => undefined | Promise<void>

export const startRollup = async (
  options: NormalizedOptions,
  waitForEsbuild: WaitForEsbuild
) => {
  const config = await getRollupConfig(options)
  if (options.watch) {
    watchRollup(config, waitForEsbuild)
  } else {
    await runRollup(config)
  }
}
