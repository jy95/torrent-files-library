let env = process.env.BABEL_ENV || process.env.NODE_ENV;
let presets = ["@babel/preset-env"];
let plugins = ["@babel/plugin-proposal-object-rest-spread"];
let ignore = ["src/docs/**/*.js"];
let comments = false;

// custom settings for prod/test ; for example babel-istanbul-plugin , etc.
// ./fix-coverage/arrow-function-coverage-fix.js : Because some odd issue for istanbul/nyc
if (env === 'test'){
  plugins.push.apply(plugins, ["./fix-coverage/arrow-function-coverage-fix.js", "babel-plugin-istanbul"]);
}

module.exports = {
  presets: presets,
  plugins: plugins,
  ignore: ignore,
  comments: comments,
};
