import MyDag from "../components/MyDag"
import MyCharts from "../components/MyCharts"
import { PieChartOutlined, PartitionOutlined } from '@ant-design/icons'

export const routers: { [any: string]: any } = {
    '/': { name: 'dag', title: '流程定义', icon: <PartitionOutlined />, element: <MyDag meta={{ flowId: 'myXflow' }} /> },
    '/chart': {
        name: 'chart', title: '图表管理', icon: <PieChartOutlined />, element: <MyCharts />
    }
}