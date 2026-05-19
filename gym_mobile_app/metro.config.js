const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname, {
  isCSSEnabled: true,
});

const githubPagesBasePath = process.env.EXPO_PUBLIC_BASE_PATH || '/gym_mobile_app/';
const publicPath = githubPagesBasePath.endsWith('/')
  ? githubPagesBasePath
  : `${githubPagesBasePath}/`;

// Configure for GitHub Pages deployment
if (process.env.NODE_ENV === 'production') {
  config.transformer.publicPath = publicPath;
}

module.exports = config;
