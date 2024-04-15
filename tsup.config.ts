import { defineConfig, Options } from 'tsup'

export default defineConfig((options: Options) => ({
  outDir: 'dist',
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  silent: true,
  splitting: false,
  sourcemap: false,
  minify: false,
  clean: true,
  dts: true,
  target: 'es2019',
  injectStyle: true,
  ...options,
}))
