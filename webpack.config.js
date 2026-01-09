const path = require("path");

module.exports = {
  mode: "production",
  target: ["web", "es5"],
  entry: {
    index: ["core-js/stable", "regenerator-runtime/runtime", "./index/index.js"],
    livePrices: ["core-js/stable", "regenerator-runtime/runtime", "./livePrices/livePrices.js"],
    adminPanel: ["core-js/stable", "regenerator-runtime/runtime", "./adminPanel/adminPanel.js"],
    uploadLogos: ["core-js/stable", "regenerator-runtime/runtime", "./uploadLogos/uploadLogos.js"],
    updatePrices: ["core-js/stable", "regenerator-runtime/runtime", "./updatePrices/readPrices.js"],
    register: ["core-js/stable", "regenerator-runtime/runtime", "./register/register.js"],
    editUser: ["core-js/stable", "regenerator-runtime/runtime", "./editUser/editUser.js"]
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.js",
    environment: {
      arrowFunction: false,
      bigIntLiteral: false,
      const: false,
      destructuring: false,
      dynamicImport: false,
      forOf: false,
      module: false
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
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
