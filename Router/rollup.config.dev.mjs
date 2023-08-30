import typescript from '@rollup/plugin-typescript';

export default {
    input: 'scripts/main.ts',
    output: {
        file: 'wwwroot/js/scripts.js',
        sourcemap: true
    },
    plugins: [typescript()]
};
