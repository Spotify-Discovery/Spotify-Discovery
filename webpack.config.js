const path = require('path');
//const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: path.join(__dirname, "client", "src", "index.jsx"),

  output: {
    path:path.resolve(__dirname, "client/dist"),
    filename: 'bundle.js'
  },

  resolve: {
    modules: [path.join(__dirname, 'src'), 'node_modules'],
    alias: {
      react: path.join(__dirname, 'node_modules', 'react'),
    },
  },

  module: {
    rules: [
      {
        test: /\.js$|jsx/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        },
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ],
      },
    ],
  },

  // plugins: [
  //   new HtmlWebpackPlugin({
  //     template: path.join(__dirname, "client", "src", "index.html"),
  //   }),
  // ],
}