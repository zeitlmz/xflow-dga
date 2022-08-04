import { Route, Routes, HashRouter } from "react-router-dom"
import MyDag from "./components/MyDag"
import './App.less'
import MyCharts from "./components/MyCharts"
function App() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<MyDag meta={{ flowId: 'myXflow' }} />} />
                <Route path="/chart" element={<MyCharts />} />
            </Routes>
        </HashRouter>
    )
}
export default App