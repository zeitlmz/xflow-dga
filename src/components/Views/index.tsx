import './index.less'
import { Route, Routes } from "react-router-dom"
import { routers } from '../../routers'
import Err404 from '../Err404'
import { Route as MyRoute } from '../../entity/Route'
export function Views(props: { collapsed: boolean }) {
    const GetRoutes = (routes?: MyRoute[]) => {
        if (routes && routes.length > 0) {
            return routes.map(route => {
                const childrens = GetRoutes(route.children)
                return <Route path={route.path} key={route.name} element={route.element} >{childrens.length > 0 && childrens}</Route>
            })
        }
        return []
    }
    console.log(props.collapsed);
    const MyRoutes = GetRoutes(routers)
    return (
        <div className='my-views' style={{ width: 'calc(100% - ' + (props.collapsed ? 79 : 250) + 'px)' }}>
            <Routes>
                {MyRoutes}
                <Route path='/404' element={<Err404 />}></Route>
            </Routes>
        </div>
    )
}