import { HashRouter } from "react-router-dom"
import './App.less'
import { TopBar } from "./components/TopBar"
import { Menus } from "./components/Menus"
import { Views } from "./components/Views"
import React, { useReducer } from "react"
export const AppContext = React.createContext({});
import { myReducer } from "./store/myReducer"
function App() {
    const [collapsed, dispatch] = useReducer(myReducer, false);
    return (
        <HashRouter>
            <div style={{ width: '100%', height: '100vh' }}>
                <TopBar onCollapsed={dispatch} collapsed={collapsed} />
                <AppContext.Provider value={{ collapsed: collapsed }}>
                    <div style={{ display: 'flex', height: 'calc(100vh - 60px)' }}>
                        <Menus collapsed={collapsed} />
                        <Views collapsed={collapsed} />
                    </div>
                </AppContext.Provider>
            </div>
        </HashRouter >
    )
}
export default App