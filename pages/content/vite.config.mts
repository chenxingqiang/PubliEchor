import { makeEntryPointPlugin } from '@extension/hmr';
import { isDev, withPageConfig } from '@extension/vite-config';
import { resolve } from 'path';

const rootDir = resolve(__dirname);
const libDir = resolve(rootDir, 'lib');

export default withPageConfig({
    resolve: {
        alias: {
            '@lib': libDir,
        },
    },
    publicDir: resolve(rootDir, 'public'),
    plugins: [isDev && makeEntryPointPlugin()],
    build: {
        lib: {
            entry: resolve(__dirname, 'lib/index.ts'),
            formats: ['iife'],
            name: 'ContentScript',
            fileName: 'index',
        },
        outDir: resolve(rootDir, '..', '..', 'dist', 'content'),
    },
});
