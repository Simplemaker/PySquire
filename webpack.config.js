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

const private_key = fs.readFileSync('private_key.pem', 'utf8')
config_json['PRIVATE_KEY'] = `\`${private_key}\``
const public_key = fs.readFileSync('public_key.pem', 'utf8')
config_json['PUBLIC_KEY'] = `\`${public_key}\``


const clientConfig = {
  mode: "production",
  entry: "./src/client.js",
  output: {
    filename: "client.js",
    path: path.resolve(__dirname, "build/"),
  },
  target: "node",
  plugins: [new ShebangPlugin(), new webpack.DefinePlugin(config_json)],
};

const serverConfig = {
  entry: "./src/server.js",
  output: {
    filename: "server.js",
    path: path.resolve(__dirname, "build/"),
  },
  target: "node",
  externals: [nodeExternals()],
  plugins: [new webpack.DefinePlugin(config_json)],
};

module.exports = [clientConfig, serverConfig];
