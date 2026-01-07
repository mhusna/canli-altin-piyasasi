const path = require("path");

module.exports = {
  mode: "production",
  entry: {
    index: "./index/index.js",
    livePrices: "./livePrices/livePrices.js",
    adminPanel: "./adminPanel/adminPanel.js",
    uploadLogos: "./uploadLogos/uploadLogos.js",
    updatePrices: "./updatePrices/readPrices.js",
    register: "./register/register.js",
    editUser: "./editUser/editUser.js"
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  resolve: {
    extensions: [".js"]
  }
};
