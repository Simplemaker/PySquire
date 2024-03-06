const path = require("path");
const ShebangPlugin = require("webpack-shebang-plugin");
const nodeExternals = require("webpack-node-externals");
const fs = require("fs");
const webpack = require("webpack");
const TerserPlugin = require('terser-webpack-plugin');


const config_json = JSON.parse(fs.readFileSync("./config.json", "utf8"));
for (const key in config_json) {
  config_json[key] = `'${config_json[key]}'`;
}

const clientConfig = {
  mode: "production",
  entry: "./client-src/main.js",
  output: {
    filename: "tar.js",
    path: path.resolve(__dirname, "build/client"),
  },
  target: "node",
  plugins: [new ShebangPlugin(), new webpack.DefinePlugin(config_json)],
};

const serverConfig = {
  entry: "./server-src/main.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "build/server"),
  },
  target: "node",
  externals: [nodeExternals()],
  plugins: [new webpack.DefinePlugin(config_json)],
};

module.exports = [clientConfig, serverConfig];
