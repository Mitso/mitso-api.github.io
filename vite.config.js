import { defineConfig } from 'vite'
import { VitePluginNode } from 'vite-plugin-node'

export default defineConfig({
    server: {
        port: process.env.PORT
    },
    plugins: [
        ...VitePluginNode({
            adapter: 'express',
            appPath: './index.js',
            exportName: 'viteNodeApp',
            initAppOnBoot: false,
            tsCompiler: 'esbuild',
            swcOptions: {}
        })
    ],
    optimizeDeps: {}
})