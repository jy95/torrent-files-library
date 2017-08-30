module.exports = {
    "extends": "airbnb-base",
    "rules" :{
        "linebreak-style": 0,
        "valid-jsdoc": "error",
        "max-len": ["error", { "ignoreComments": true }],
        "import/extensions": ['off', 'never'],
        "no-bitwise": ["error", { "allow": ["|"] }],
        "no-restricted-syntax": ['off', "ForInStatement"]
    },
    "env" : {
        "es6" : true,
        "node": true,
        "mocha" : true
    }
};