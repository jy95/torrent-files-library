/* eslint-disable no-useless-escape */
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
  release: {
    // eslint-disable-next-line max-len
    verifyConditions: ['@semantic-release/changelog', '@semantic-release/npm', '@semantic-release/github'],
    // eslint-disable-next-line max-len
    publish: ['@semantic-release/changelog', '@semantic-release/npm', '@semantic-release/github'],
  },
};
