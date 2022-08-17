import { controlMapService } from './form-controls'
import { createGraphConfig, NsNodeCmd, XFlowNodeCommands, NsJsonSchemaForm, NsGraph } from '@antv/xflow'

export namespace NsJsonForm {
    /** ControlShape的Enum */
    const { ControlShape } = NsJsonSchemaForm

    /** 保存form的values */
    export const formValueUpdateService: NsJsonSchemaForm.IFormValueUpdateService = async args => {
        const { values, commandService, targetData } = args
        if (!targetData) {
            return
        }
        const updateNode = (node: NsGraph.INodeConfig) => {
            return commandService.executeCommand<NsNodeCmd.UpdateNode.IArgs>(
                XFlowNodeCommands.UPDATE_NODE.id,
                { nodeConfig: node },
            )
        }
        console.log('formValueUpdateService  values:', values)
        const nodeConfig: NsGraph.INodeConfig = {
            ...targetData,
        }
        values.forEach(val => {
            console.log(val);
            // set(nodeConfig, val.name, val.value)
        })
        updateNode(nodeConfig)
    }

    export const getCustomRenderComponent: NsJsonSchemaForm.ICustomRender = (targetType, targetData) => {
        if (targetType === 'node') {
            // return () => (
            //     <TaskForm nodeData={targetData} />
            // )
            return null
        }
        if (targetType === 'canvas') {
            return null
        }

        return null
    }

    /** 根据选中的节点更新formSchema */
    export const formSchemaService: NsJsonSchemaForm.IFormSchemaService = async args => {
        const { targetData } = args
        console.log(`formSchemaService args:`, args)
        if (!targetData) {
            return {
                tabs: [
                    {
                        /** Tab的title */
                        name: '画布配置',
                        groups: [],
                    },
                ],
            }
        }

        return {
            /** 配置一个Tab */
            tabs: [
                {
                    /** Tab的title */
                    name: '节点配置',
                    groups: [
                        {
                            name: 'group1',
                            controls: [
                                {
                                    name: 'label',
                                    label: '节点名称',
                                    shape: ControlShape.INPUT,
                                    value: targetData.label,
                                },
                                {
                                    name: 'nodeType',
                                    label: '节点类型',
                                    shape: ControlShape.SELECT,
                                    options: [{ title: '定时任务', value: 'schedule' }, { title: '数据处理', value: 'dataProcess' }],
                                    disabled: true,
                                    value: targetData.nodeType,
                                },
                            ],
                        },
                    ],
                },
            ],
        }
    }
}

export const formValueUpdateService: NsJsonSchemaForm.IFormValueUpdateService = async args => {
   
}

export { controlMapService }