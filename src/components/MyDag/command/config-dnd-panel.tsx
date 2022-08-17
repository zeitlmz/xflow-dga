/* eslint-disable @typescript-eslint/no-unused-vars */
import { uuidv4 } from '@antv/xflow'
import { XFlowNodeCommands, NsGraph } from '@antv/xflow'
import { DND_RENDER_ID } from '../constant'
import type { NsNodeCollapsePanel, NsNodeCmd } from '@antv/xflow'
import { Card } from 'antd'

export const onNodeDrop: NsNodeCollapsePanel.IOnNodeDrop = async (node, commands, modelService) => {
    const args: NsNodeCmd.AddNode.IArgs = {
        nodeConfig: { ...node, id: uuidv4() },
    }
    commands.executeCommand(XFlowNodeCommands.ADD_NODE.id, args)
}

const NodeDescription = (props: { name: string }) => {
    return (
        <Card size="small" title="定时任务介绍" style={{ width: '200px' }} bordered={false}>
            {props.name}
        </Card>
    )
}

export const nodeDataService: NsNodeCollapsePanel.INodeDataService = async (meta, modelService) => {
    return [
        {
            id: 'schedule',
            header: '定时任务',
            children: [
                {
                    id: '2',
                    label: '定时任务',
                    nodeType: 'schedule',
                    parentId: '1',
                    renderKey: DND_RENDER_ID,
                    popoverContent: <NodeDescription name="定时任务" />,
                    ports: [
                        {
                            id: 'node1-input-1',
                            type: NsGraph.AnchorType.INPUT,
                            group: NsGraph.AnchorGroup.TOP,
                            tooltip: '输入桩',
                        },
                        {
                            id: 'node1-output-1',
                            type: NsGraph.AnchorType.OUTPUT,
                            group: NsGraph.AnchorGroup.BOTTOM,
                            tooltip: '输出桩',
                        },
                    ] as NsGraph.INodeAnchor[],
                }
            ],
        },
        {
            id: 'dataProcess',
            header: '数据加工',
            children: [
                {
                    id: '6',
                    label: '数据处理',
                    nodeType: 'dataProcess',
                    parentId: '5',
                    renderKey: DND_RENDER_ID,
                }
            ],
        }
    ]
}

export const searchService: NsNodeCollapsePanel.ISearchService = async (
    nodes: NsNodeCollapsePanel.IPanelNode[] = [],
    keyword: string,
) => {
    // @ts-ignore
    const list = nodes.filter(node => node.label.includes(keyword))
    console.log(list, keyword, nodes)
    return list
}