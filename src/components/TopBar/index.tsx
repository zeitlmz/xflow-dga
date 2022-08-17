import './index.less'
import { Breadcrumb, Button } from 'antd'
import { HomeOutlined, MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons'
import { useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom"
import { routers } from '../../routers'
import Err404 from '../Err404'
export function TopBar(props: { onCollapsed: Function, collapsed: boolean }) {
    const [logWidth, setLogWidth] = useState(250);
    const onclick = () => {
        props.onCollapsed(props.collapsed ? 'decollapse' : 'collapse');
        if (props.collapsed) {
            setLogWidth(250)
        } else {
            setLogWidth(79)
        }
    }

    const pathname = useLocation().pathname
    const routerInfo = routers[pathname] || {}
    if (!routerInfo) {
        const navigate = useNavigate()
        navigate('/404')
    }
    return (
        <div className='top-bar'>
            <div className='log' style={{ width: logWidth + 'px' }}>{props.collapsed ? 'Zeit' : 'Zeit丶浅白'}</div>
            <div className='right' style={{ width: 'calc(100% - ' + logWidth + 'px)' }}>
                <Button type="text" onClick={onclick}>
                    {props.collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                </Button>
                <div className='my-breadcrumb'>
                    <Breadcrumb>
                        <Breadcrumb.Item href="/">
                            <HomeOutlined />
                        </Breadcrumb.Item>
                        <Breadcrumb.Item href={routerInfo.path}>
                            {routerInfo.icon}<span>{routerInfo.title}</span>
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>
            </div>
        </div>
    )
}