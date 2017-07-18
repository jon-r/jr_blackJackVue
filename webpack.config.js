const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
  context: `${__dirname}/src`, // `__dirname` is root of project and `src` is source
  entry: {
    app: './main.js',
  },
  output: {
    path: `${__dirname}/dist`, // `dist` is the destination
    filename: 'bundle.js',
//    publicPath: './',
  },
  module: {
    rules: [
      {
        test: /\.js$/, // Check for all js files
        use: [{
          loader: 'babel-loader',
          options: { presets: ['es2015'] },
        }],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
            },
            'postcss-loader',
          ],
        }),
      },
      {
        test: /\.(jpe?g|gif|png|svg|woff|ttf|wav|mp3)$/,
        loader: 'file-loader',
        query: {
//          useRelativePath: process.env.NODE_ENV === 'production',
        },
      },
    ],
  },
  // To run development server
  devServer: {
    contentBase: `${__dirname}/src`,
  },
  plugins: [
    new ExtractTextPlugin('app.css'),
    new HtmlWebpackPlugin({
      template: `${__dirname}/src/index.html`,
      minify: {
        collapseWhitespace: true,
      },
    }),
  ],

  resolve: {
    alias: {
      vue: 'vue/dist/vue.common.js',
    },
  },

  devtool: 'eval-source-map', // Default development sourcemap
  // devtool: "source-map"
};

// Check if build is running in production mode, then change the sourcemap type
if (process.env.NODE_ENV === 'production') {
  config.devtool = 'source-map';

  console.log(process.env.NODE_ENV);

  // Can do more here
  // JSUglify plugin
  // Offline plugin
  // Bundle styles seperatly using plugins etc,
}

module.exports = config;
