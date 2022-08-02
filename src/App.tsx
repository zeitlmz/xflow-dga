import { Route, Routes } from "react-router-dom"
import MyDag from "./components/MyDag"
import './App.less'
function App() {
    return (
        <Routes>
            <Route path="/" element={<MyDag meta={{ flowId: 'myXflow' }} />} />
        </Routes>
    )
}
export default App