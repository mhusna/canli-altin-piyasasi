module.exports = {
  sourceType: "unambiguous",
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
        modules: "auto"
      }
    ]
  ],
  plugins: [
    ["@babel/plugin-transform-runtime", { "regenerator": true }],
    "@babel/plugin-transform-optional-chaining",
    "@babel/plugin-transform-nullish-coalescing-operator"
  ],
  exclude: [
    /node_modules[\\/]core-js/,
    /node_modules[\\/]regenerator-runtime/,
    /node_modules[\\/]@babel[\\/]runtime/
  ]
};
