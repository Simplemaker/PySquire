const path = require("path");
const ShebangPlugin = require('webpack-shebang-plugin');

module.exports = [
  {
    entry: "./client-src/main.js",
    output: {
      filename: "main.js",
      path: path.resolve(__dirname, "build/client"),
    },
    plugins:[
        new ShebangPlugin()
    ]    
  },
  {
    entry: "./server-src/main.js",
    output: {
      filename: "main.js",
      path: path.resolve(__dirname, "build/server"),
    },
    target: "node"
  },
];
