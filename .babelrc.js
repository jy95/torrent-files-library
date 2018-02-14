let env = process.env.BABEL_ENV || process.env.NODE_ENV;
let presets = [];
let plugins = ["@babel/plugin-proposal-object-rest-spread"];
let ignore = ["src/docs/**/*.js"];
let comments = false;

// custom settings for prod/test ; for example babel-istanbul-plugin , etc.
switch (env){
  case 'test':
    // ./fix-coverage/arrow-function-coverage-fix.js : Because some odd issue for istanbul/nyc
    plugins.push.apply(plugins, ["babel-plugin-istanbul"]);
    break;

  case 'production':
    // workaround : https://github.com/babel/minify/issues/790#issuecomment-365750066
    presets.push.apply(presets, [['minify', { removeUndefined: false }]] );
    break;
}

// default preset
presets.push.apply(presets, ["@babel/preset-env"]);

module.exports = {
  presets: presets,
  plugins: plugins,
  ignore: ignore,
  comments: comments,
};