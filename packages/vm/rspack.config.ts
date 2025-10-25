import { defineConfig } from '@rspack/cli';

const config: any = defineConfig({
  entry: './src/index.ts',
  output: {
    filename: 'index.js',
    library: {
      type: 'module'
    }
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  externals: {
    'react': 'globalThis.React',
    'react-reconciler': 'globalThis.ReactReconciler'
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
  optimization: {
    minimize: false,
  },
  devtool: false,
})
export default config;