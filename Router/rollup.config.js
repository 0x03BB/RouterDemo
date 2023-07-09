import typescript from "../node_modules/@rollup/plugin-typescript/dist/cjs/index.js";

export default {
    input: 'scripts/main.ts',
    output: {
        file: 'wwwroot/js/scripts.js',
        format: 'es',
        sourcemap: 'true'
    },
    plugins: [typescript()]
};
