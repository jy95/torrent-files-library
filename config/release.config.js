/* eslint-disable no-useless-escape,max-len,no-template-curly-in-string */
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
    ['@semantic-release/changelog', '@semantic-release/npm',
      {
        path: '@semantic-release/git',
        message: ':wrench: Chore: update package.json and CHANGELOG.md for release ${nextRelease.version} [skip ci]',
      }, '@semantic-release/github'],
};
