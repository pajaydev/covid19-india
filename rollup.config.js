'use strict';

import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
    input: 'src/script.js',
    output: {
        file: 'dist/script.js',
        format: 'umd'
    },
    plugins: [resolve(), commonjs()]
};