module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        useBuiltIns: "entry",
        corejs: 3,
        targets: {
          chrome: "30",
          ie: "11",
          safari: "7"
        },
        modules: false
      }
    ]
  ],
  plugins: [
    ["@babel/plugin-transform-runtime", { "regenerator": true }]
  ],
  exclude: [
    /node_modules[\\/]core-js/,
    /node_modules[\\/]regenerator-runtime/,
    /node_modules[\\/]@babel[\\/]runtime/
  ]
};
