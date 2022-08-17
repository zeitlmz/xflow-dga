import { Menu, MenuProps } from 'antd'
import { Link, useLocation } from "react-router-dom"
import './index.less'
import { routers } from '../../routers'
type MenuItem = Required<MenuProps>['items'][number];
export function Menus(props: { collapsed: boolean }) {
    function getItem(label: React.ReactNode, key?: React.Key | null, icon?: React.ReactNode, children?: MenuItem[], type?: 'group'): MenuItem {
        return { key, icon, children, label, type } as MenuItem;
    }
    const items: MenuItem[] = [];
    Object.keys(routers).map(key => items.push(getItem(<Link to={key}>{routers[key].title}</Link>, key, routers[key].icon)))
    return (
        <div className={'my-menus ' + (props.collapsed ? 'collapsed' : 'decollapsed')}>
            <Menu items={items} mode="inline" defaultSelectedKeys={[useLocation().pathname]}
                defaultOpenKeys={[useLocation().pathname]} inlineCollapsed={props.collapsed}></Menu>
        </div>
    )
}