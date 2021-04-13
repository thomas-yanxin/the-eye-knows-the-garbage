/** @format */
'use strict';
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var eslint = require('./eslint');
var eslintFolder = path.join(path.dirname(require.resolve('eslint')), '..');
var moduleResolverPath = path.join(eslintFolder, 'lib/shared/relative-module-resolver');
var ModuleResolver = require(moduleResolverPath);
ModuleResolver.resolve = function (moduleName) {
    return require.resolve(moduleName);
};
module.exports = {
    extends: [
        'airbnb',
        'prettier',
        'airbnb-typescript',
        'prettier/react',
        'prettier/@typescript-eslint',
    ],
    plugins: ['@typescript-eslint', 'eslint-comments', 'jest', 'unicorn', 'react-hooks'],
    env: {
        browser: true,
        node: true,
        es6: true,
        mocha: true,
        jest: true,
        jasmine: true,
    },
    rules: __assign(__assign({}, eslint.rules), { 'no-param-reassign': 1, 'import/no-unresolved': [
            1,
            {
                ignore: ['^@/', '^@@/', '^@alipay/bigfish/'],
                caseSensitive: true,
                commonjs: true,
            },
        ], 'import/no-extraneous-dependencies': [
            1,
            {
                optionalDependencies: true,
                devDependencies: [
                    '**/tests/**.{ts,js,jsx,tsx}',
                    '**/_test_/**.{ts,js,jsx,tsx}',
                    '/mock/**/**.{ts,js,jsx,tsx}',
                    '**/**.test.{ts,js,jsx,tsx}',
                    '**/_mock.{ts,js,jsx,tsx}',
                ],
            },
        ], 
        // Use function hoisting to improve code readability
        'no-use-before-define': ['warn', { functions: false, classes: true, variables: true }], '@typescript-eslint/no-use-before-define': [
            'warn',
            { functions: false, classes: true, variables: true, typedefs: true },
        ], 'max-len': 'warn', 'no-mixed-operators': 'warn', 'comma-dangle': 0 }),
    settings: {
        'import/resolver': { node: { extensions: ['.js', '.jsx', '.ts', '.tsx'] } },
    },
};
