import './index.less'
import { Route, Routes } from "react-router-dom"
import { routers } from '../../routers'
import Err404 from '../Err404'
export function Views(props: { collapsed: boolean }) {
    return (
        <div className='my-views' style={{ width: 'calc(100% - ' + (props.collapsed ? 79 : 250) + 'px)' }}>
            <Routes>
                {Object.keys(routers).map(key => <Route path={key} key={routers[key].name} element={routers[key].element} />)}
                <Route path='/404' element={<Err404 />}></Route>
            </Routes>
        </div>
    )
}