import React from "react"

export interface Route {
    // 路由code编码
    name: string
    // 路由标题
    title: string
    // 图标
    icon?: React.ReactElement
    // 路由访问路径
    path: string
    // 内容
    element?: React.ReactElement
    // 子路由
    children?: Route[]
}