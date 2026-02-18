import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import babel from '@rollup/plugin-babel';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import { readFileSync } from 'fs';

const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));

export default [
    {
        input: 'src/index.ts',
        output: [
            {
                file: packageJson.main,
                format: 'cjs',
                sourcemap: true,
                exports: 'named',
            },
            {
                file: packageJson.module,
                format: 'esm',
                sourcemap: true,
                exports: 'named',
            },
        ],
        plugins: [
            peerDepsExternal(),
            resolve({
                browser: true,
                preferBuiltins: false,
            }),
            commonjs(),
            postcss({
                extract: false,
                inject: true,
                modules: false,
                minimize: true,
            }),
            typescript({
                tsconfig: './tsconfig.json',
                declaration: true,
                declarationDir: 'dist',
                exclude: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx'],
            }),
            babel({
                babelHelpers: 'bundled',
                exclude: 'node_modules/**',
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
                presets: [['@babel/preset-env', { targets: 'defaults' }], ['@babel/preset-react', { runtime: 'automatic' }], '@babel/preset-typescript'],
            }),
        ],
        external: ['react', 'react-dom'],
    },
];
