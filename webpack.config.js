const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  entry: './src/modules/widget/widgetfunction.tsx',

  module: {
    rules: [
      {
        test: /\.svg$/,
        use: 'svg-inline-loader',
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },

      // {
      //   test: /\.(js|jsx)$/,
      //   // exclude: /node_modules/,
      //   use: {
      //     loader: 'babel-loader',
      //     options: {
      //       presets: [
      //         '@babel/preset-env',
      //         ['@babel/preset-react', { runtime: 'automatic' }],
      //         // [
      //         //   '@babel/preset-typescript',
      //         //   { isTSX: true, allExtensions: true, allowNamespaces: true },
      //         // ],
      //       ],
      //     },
      //   },
      // },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        // exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },

  devServer: {
    port: 9000,
  },
  // resolve: { fallback: { crypto: false, path: false } },
  plugins: [new HtmlWebpackPlugin(), new webpack.ProgressPlugin()],
  mode: 'production',
};
