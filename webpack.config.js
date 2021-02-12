const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: './src/assets/js/main.js',

  output: {
    filename: 'main.js',
    path: path.join(__dirname, '/dist/assets/js')
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              "@babel/preset-env",
            ],
          },
        },
      },
    ],
  },
  target: ["web", "es5"],
};