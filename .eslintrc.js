module.exports = {
    parser:"@typescript-es;int/parser",
    extends: [
        "plugin:@typescript-eslint/recommended",
        'prettier/@typescript-eslint',
        'plugin:prettier/recommended'
    ],
    parseOptions: {
        ecmaVersion: 2018,
        sourveType: 'module'
    },
    rules:{
        
    },
}