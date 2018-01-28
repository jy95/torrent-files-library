/* eslint-disable no-useless-escape,max-len */
module.exports = {
  analyzeCommits: {
    preset: 'eslint',
    releaseRules: './config/release-rules.js',
    parserOpts: {
      headerPattern: /^(?::([\w-]*):)?\s*(\w*):\s*(.*)$/,
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
      headerPattern: /^(?::([\w-]*):)?\s*(\w*):\s*(.*)$/,
      headerCorrespondence: [
        'emoji',
        'tag',
        'message',
      ],
    },
  },
  verifyConditions:
    ['@semantic-release/changelog', '@semantic-release/npm', '@semantic-release/git', '@semantic-release/github'],
  publish:
    ['@semantic-release/changelog', '@semantic-release/npm', '@semantic-release/git', '@semantic-release/github'],
};
