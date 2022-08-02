import { defineConfig } from 'vite'
import * as path from "path";
import react from '@vitejs/plugin-react'
import reactRefresh from "@vitejs/plugin-react-refresh";

// https://vitejs.dev/config/
export default defineConfig({
    base: '/',
    plugins: [
        react({
            babel: {
                plugins: [
                    ["@babel/plugin-proposal-decorators", { legacy: true }],
                    ["@babel/plugin-proposal-class-properties", { loose: true }],
                ],
                // Use .babelrc files
                babelrc: true,
                // Use babel.config.js files
                configFile: true,
            }
        }), reactRefresh()],
    // 配置路径别名
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
        },
    },
    server: {
        port: 3000,
        proxy: {
            "/api": {
                target: "http://localhost:8810",
                changeOrigin: true,
                cookieDomainRewrite: "",
                secure: false,
            },
        },
    }
})
