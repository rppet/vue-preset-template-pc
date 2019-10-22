module.exports = {
    root: true,
    env: {
        node: true
    },
    'extends': [
        'plugin:vue/essential',
        '@vue/standard'
    ],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        // allow async-await
        'generator-star-spacing': 'off',
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        indent: [
            'error',
            4
        ],
        'linebreak-style': [
            'error',
            'unix'
        ],
        quotes: [
            'error',
            'single'
        ],
        semi: [
            'error',
            'always'
        ],
        'no-new': ['off'],
        camelcase: ['warn', {
            properties: 'never'
        }],
        'brace-style': ['error', 'stroustrup'],
        'space-before-function-paren': ['error', {
            anonymous: 'always',
            named: 'never',
            asyncArrow: 'never'
        }],
        'spaced-comment': ['warn', 'always', {
            line: {
                markers: ['/'],
                exceptions: ['-', '+']
            },
            block: {
                markers: ['!', '*!'],
                exceptions: ['*'],
                balanced: true
            }
        }]
    },
    parserOptions: {
        parser: 'babel-eslint'
    }
}
