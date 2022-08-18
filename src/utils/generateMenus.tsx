import type { Route } from '../entity/Route';
import { Link, useLocation } from "react-router-dom"
import { MenuProps } from 'antd'
import { routers } from '../routers'
type MenuItem = Required<MenuProps>['items'][number];

export const menus = generateRoutes()

function generateRoutes(): MenuItem[] {
    // 封装成antd-menu需要的数据格式
    const getItem = (route: Route): MenuItem => {
        const children = getMenus(route.children, route.path)
        return { key: route.path, icon: route.icon, children: children.length > 0 ? children : null, label: route.element && children.length === 0 ? <Link to={route.path}>{route.title}</Link> : route.title } as MenuItem;
    }
    // 迭代菜单
    const getMenus = (routes?: Route[], parentPath?: string): MenuItem[] => {
        if (routes && routes.length !== 0) {
            const items: MenuItem[] = [];
            routes.forEach(item => {
                if (parentPath && parentPath !== '/') {
                    item.path = parentPath + item.path
                }
                items.push(getItem(item))
            })
            return items
        }
        return []
    }
    return getMenus(routers)
}