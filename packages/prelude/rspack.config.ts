import type { Configuration } from '@rspack/core';

const config: Configuration = {
  entry: './src/index.ts',
  output: {
    filename: 'index.js',
    library: {
      name: 'BrrdPrelude',
      type: 'umd',
    },
    globalObject: 'globalThis',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: 'builtin:swc-loader',
          options: {
            jsc: {
              parser: {
                syntax: 'typescript',
              },
              target: 'es2020',
            },
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        include: /node_modules/,
        use: {
          loader: 'builtin:swc-loader',
          options: {
            jsc: {
              parser: {
                syntax: 'ecmascript',
              },
              target: 'es2020',
            },
          },
        },
      },
    ],
  },
  externals: {
    // Don't bundle React and React Reconciler, they will be imported and bound to globalThis
  },
  optimization: {
    minimize: false,
  },
  devtool: false,
  experiments: {
    css: false,
  },
};

export default config;