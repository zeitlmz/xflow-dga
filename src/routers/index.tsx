import MyCharts from "../components/MyCharts"
import DataSourceMan from "../pages/DataSourceMan"
import DagMan from "../pages/DagMan"
import { PieChartOutlined, PartitionOutlined, HomeOutlined } from '@ant-design/icons'
import { Route } from "../entity/Route"
import { Home } from "../pages/Home"
export const routers: Array<Route> = [
    { name: 'home', title: '首页', path: '/', element: <Home />, icon: <HomeOutlined /> },
    {
        name: 'flowMan', title: '工作流', path: '/flowMan', icon: <PartitionOutlined />,
        children: [
            { name: 'datasourceMan', title: '数据源管理', path: '/datasourceMan', element: <DataSourceMan /> },
            { name: 'dagMan', title: '流程管理', path: '/dagMan', element: <DagMan /> }
        ]
    },
    {
        name: 'chart', title: '图表管理', path: '/chart', icon: <PieChartOutlined />,
        children: [
            {
                name: 'autoCharts', title: '自动图表', path: '/autoCharts', element: <MyCharts />
            }
        ]
    }
]