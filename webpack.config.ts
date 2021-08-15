import path from 'path';
import { Configuration } from 'webpack';
import { fullfillAliasConfig } from './webpack.utils';

const nodeExternals = require('webpack-node-externals');


const config: Configuration = {
  mode: "development",
  entry: {
    "server": path.resolve(__dirname, "src", "entry.ts"),
  },
  target: 'node',
  devtool: "inline-source-map",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: `[name].js`,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "babel-loader",
        exclude: [
          path.resolve(__dirname, "node_modules"),
          path.resolve(__dirname, "test"),
        ],
        options: {
          babelrcRoots: __dirname,
        }
      },
      {
        test: /\.ts$/,
        loader: "ts-loader",
        exclude: [
          path.resolve(__dirname, "node_modules"),
          path.resolve(__dirname, "test"),
        ],
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  externalsPresets: {
    node: true,
  },
  externals: [
    // // @ts-ignore
    // nodeExternals(),
  ],
  experiments: {
    topLevelAwait: true,
  }
}


fullfillAliasConfig(__dirname, config);

export default config;
