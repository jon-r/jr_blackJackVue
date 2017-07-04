var webpack = require('webpack');

var config = {
  context: __dirname +'/src', // `__dirname` is root of project and `src` is source
  entry: {
    app: './main.js',
  },
  output: {
    path: __dirname +'/dist', // `dist` is the destination
    filename: 'bundle.js',
    publicPath: '/dist',
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
        exclude: /node_modules/,
        loader: 'style!css', // TODO fix this for CSS?
        // https://github.com/tj/frontend-boilerplate/blob/master/webpack.config.js
      },

    ],
  },
  // To run development server
  devServer: {
    contentBase: __dirname +'/src',
  },

  resolve: {
    alias: {
      vue: 'vue/dist/vue.js',
    },
  },

  devtool: 'eval-source-map', // Default development sourcemap
  // devtool: "source-map"
};

// Check if build is running in production mode, then change the sourcemap type
if (process.env.NODE_ENV === 'production') {
  config.devtool = 'source-map';

  // Can do more here
  // JSUglify plugin
  // Offline plugin
  // Bundle styles seperatly using plugins etc,
}

module.exports = config;
