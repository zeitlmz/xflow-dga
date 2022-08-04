import { controlMapService } from './form-controls'
import { createGraphConfig, NsNodeCmd, XFlowNodeCommands, NsJsonSchemaForm, NsGraph } from '@antv/xflow'
import taskForm from '../task-form'
export function delay(ms: number) {
    return new Promise(resolve => setTimeout(() => resolve(true), ms))
}

/**  Demo Props  */
export interface IDemoProps { }

/**  graphConfig：配置Graph  */
export const useGraphConfig = createGraphConfig<IDemoProps>(graphConfig => {
    graphConfig.setDefaultNodeRender(props => {
        return <div className="react-node"> {props.data.label} </div>
    })
})

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

    export const getCustomRenderComponent: NsJsonSchemaForm.ICustomRender = (
        targetType,
        targetData,
    ) => {
        console.log(targetType, targetData)
        if (targetType === 'node') {
            return () => (
                <div>
                    <input className='ant-input' placeholder='请输入一点东西'></input>
                    <div className="custom-form-component"> node: {targetData?.label} custom componnet </div>
                </div>
            )
        }
        if (targetType === 'canvas') {
            return () => <div className="custom-form-component"> canvas custom componnet </div>
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
                                    label: '节点Label',
                                    shape: ControlShape.INPUT,
                                    value: targetData.label,
                                },
                                {
                                    name: 'x',
                                    label: 'x',
                                    shape: ControlShape.FLOAT,
                                    value: targetData.x,
                                },
                                {
                                    name: 'y',
                                    label: 'y',
                                    shape: ControlShape.FLOAT,
                                    value: targetData.y,
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
    console.log('formValueUpdateService', args)
}

export { controlMapService }