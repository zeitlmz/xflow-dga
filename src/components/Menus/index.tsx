import { Menu, MenuProps } from 'antd'
import { useState } from 'react'
import { useLocation } from "react-router-dom"
import { menus } from '../../utils/generateMenus'
import './index.less'
export function Menus(props: { collapsed: boolean }) {
    const location = useLocation().pathname
    const defaultOpenKeys: string[] = []
    if (location && location !== '/' && location.indexOf('/') !== -1) {
        const pathStr = location.split('/')
        defaultOpenKeys.push('/' + pathStr[1])
    }
    const [openKeys, setOpenKeys] = useState<string[]>(defaultOpenKeys);
    const onOpenChange: MenuProps['onOpenChange'] = keys => {
        console.log(keys);
        const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1);
        if (latestOpenKey) {
            setOpenKeys([latestOpenKey]);
        } else {
            setOpenKeys([]);
        }
    };
    return (
        <div className={'my-menus ' + (props.collapsed ? 'collapsed' : 'decollapsed')}>
            <Menu items={menus} openKeys={openKeys} onOpenChange={onOpenChange} mode="inline" defaultSelectedKeys={[location]}
                defaultOpenKeys={defaultOpenKeys} inlineCollapsed={props.collapsed}></Menu>
        </div>
    )
}