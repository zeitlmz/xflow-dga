import MyDag from "../components/MyDag"
import MyCharts from "../components/MyCharts"
import { PieChartOutlined, PartitionOutlined } from '@ant-design/icons'
import { Route } from "../entity/Route"

export const routers: Array<Route> = [
    {
        name: 'dagMan', title: '流程管理', path: '/dagMan', icon: <PartitionOutlined />,
        children: [
            { name: 'dagDefine', title: '流程定义', path: '/dagDefine', element: <MyDag meta={{ flowId: 'myXflow' }} /> },
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