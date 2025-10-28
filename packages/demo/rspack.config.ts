import { defineConfig } from '@rspack/cli'
import { HtmlRspackPlugin } from '@rspack/core'

module.exports = defineConfig({
  entry: './src/main.tsx',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'builtin:swc-loader',
          options: {
            jsc: {
              parser: {
                syntax: 'typescript',
                tsx: true,
              },
              transform: {
                react: {
                  runtime: 'automatic',
                },
              },
              target: 'es2020',
            },
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['postcss-loader'],
        type: 'css',
      },
      {
        test: /\.wasm$/,
        type: 'webassembly/async',
      },
      {
        resourceQuery: /raw/,
        type: 'asset/source',
      },
    ],
  },
  plugins: [
    new HtmlRspackPlugin()
  ],
  devServer: {
    port: 3001,
  },
  experiments: {
    css: true,
    asyncWebAssembly: true,
  }
})