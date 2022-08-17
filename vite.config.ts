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
    css: {
        preprocessorOptions: {
            less: {
                javascriptEnabled: true,  //注意，这一句是在less对象中，写在外边不起作用
                modifyVars: { //在这里进行主题的修改，参考官方配置属性
                    '@primary-color': '#1DA57A',
                },
            }
        }
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
