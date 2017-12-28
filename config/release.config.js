/* eslint-disable no-useless-escape */
module.exports = {
  analyzeCommits: {
    preset: 'eslint',
    releaseRules: './config/release-rules.js',
    parserOpts: {
      headerPattern: /^(?:\:(\w*)\:)?\s(\w*)\:\s(.*?)(?:\((.*)\))?$/,
      headerCorrespondence: [
        'emoji',
        'tag',
        'message',
      ],
    },
  },
  generateNotes: {
    preset: 'eslint',
    parserOpts: {
      headerPattern: /^(?:\:(\w*)\:)?\s(\w*)\:\s(.*?)(?:\((.*)\))?$/,
      headerCorrespondence: [
        'emoji',
        'tag',
        'message',
      ],
    },
  },
};
