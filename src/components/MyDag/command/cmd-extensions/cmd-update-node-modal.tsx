import React, { useState } from 'react'
import type { HookHub, ICmdHooks as IHooks, NsGraph, IModelService } from '@antv/xflow'
import { Deferred, ManaSyringe } from '@antv/xflow'
import { Modal, Form, Button, Input, Select, Row, Col, Checkbox, FormInstance, InputNumber, Switch } from 'antd'
const { Option } = Select;
import type { IArgsBase, ICommandHandler, IGraphCommandService } from '@antv/xflow'
import { ICommandContextProvider } from '@antv/xflow'
import MyMonacoEditor from '../../../MyMonacoEditor';
import { CustomCommands } from './constants'
import 'antd/es/modal/style/index.css'

import './model-custom.less'
import { DataForm } from '../entity/DataForm'
type ICommand = ICommandHandler<
    NsUpdateNodeCmd.IArgs,
    NsUpdateNodeCmd.IResult,
    NsUpdateNodeCmd.ICmdHooks
>

export namespace NsUpdateNodeCmd {
    /** Command: 用于注册named factory */
    export const command = CustomCommands.SHOW_UPDATE_MODAL
    /** hook name */
    export const hookKey = 'updateNode'
    /** hook 参数类型 */
    export interface IArgs extends IArgsBase {
        nodeConfig: NsGraph.INodeConfig
        updateNodeDataService: updateNodeDataService
    }
    export interface updateNodeDataService {
        (nodeData: any, nodeConfig: NsGraph.INodeConfig, meta: NsGraph.IGraphMeta): Promise<{
            err: string | null
            nodeName: string
        }>
    }
    /** hook handler 返回类型 */
    export interface IResult {
        err: string | null
        preNodeName?: string
        currentNodeName?: string
    }
    /** hooks 类型 */
    export interface ICmdHooks extends IHooks {
        renameNode: HookHub<IArgs, IResult>
    }
}

@ManaSyringe.injectable()
/** 部署画布数据 */
export class UpdateNodeCommand implements ICommand {
    /** api */
    // @ts-ignore
    @ManaSyringe.inject(ICommandContextProvider) contextProvider: ICommand['contextProvider']

    /** 执行Cmd */
    execute = async () => {
        const ctx = this.contextProvider()
        const { args, hooks: runtimeHook } = ctx.getArgs()
        const hooks = ctx.getHooks()
        const result = await hooks.renameNode.call(args, async args => {
            // @ts-ignore
            const { nodeConfig, graphMeta, commandService, modelService, updateNodeDataService } = args
            const preNodeName = nodeConfig.label
            // @ts-ignore
            const getAppContext: IGetAppCtx = () => {
                return {
                    graphMeta,
                    commandService,
                    modelService,
                    updateNodeDataService,
                }
            }

            const x6Graph = await ctx.getX6Graph()
            const cell = x6Graph.getCellById(nodeConfig.id)

            if (!cell || !cell.isNode()) {
                throw new Error(`${nodeConfig.id} is not a valid node`)
            }
            /** 通过modal 获取 new name */
            const newName = await showModal(nodeConfig, getAppContext)
            /** 更新 node name  */
            if (newName) {
                const cellData = cell.getData<NsGraph.INodeConfig>()
                cell.setData({ ...cellData, label: newName } as NsGraph.INodeConfig)
                return { err: null, preNodeName, currentNodeName: newName }
            }
            return { err: null, preNodeName, currentNodeName: '' }
        })

        // @ts-ignore
        ctx.setResult(result)
        return this
    }

    /** undo cmd */
    undo = async () => {
        if (this.isUndoable()) {
            const ctx = this.contextProvider()
            ctx.undo()
        }
        return this
    }

    /** redo cmd */
    redo = async () => {
        if (!this.isUndoable()) {
            await this.execute()
        }
        return this
    }

    isUndoable(): boolean {
        const ctx = this.contextProvider()
        return ctx.isUndoable()
    }
}

export interface IGetAppCtx {
    (): {
        graphMeta: NsGraph.IGraphMeta
        commandService: IGraphCommandService
        modelService: IModelService
        updateNodeDataService: NsUpdateNodeCmd.updateNodeDataService
    }
}

export type IModalInstance = ReturnType<typeof Modal.confirm>


function showModal(node: NsGraph.INodeConfig, getAppContext: IGetAppCtx) {
    /** showModal 返回一个Promise */
    const defer = new Deferred<string | void>()

    /** modal确认保存逻辑 */
    class ModalCache {
        static modal: IModalInstance
        static form: FormInstance<DataForm>
    }
    /** modal确认保存逻辑 */
    const onOk = async () => {
        const { form, modal } = ModalCache
        const appContext = getAppContext()
        const { updateNodeDataService, graphMeta } = appContext
        try {
            await form.validateFields()
            modal.update({ okButtonProps: { loading: true } })
            const values = await form.getFieldsValue()
            console.log(values);
            /** 执行 backend service */
            if (updateNodeDataService) {
                const { err, nodeName } = await updateNodeDataService(values, node, graphMeta)
                if (err) {
                    throw new Error(err)
                }
                defer.resolve(nodeName)
            }
            /** 更新成功后，关闭modal */
            onHide()
        } catch (error) {
        }
    }

    /** modal销毁逻辑 */
    const onHide = () => {
        modal.destroy()
        ModalCache.form = null as any
        ModalCache.modal = null as any
        container.destroy()
    }

    /** modal内容 */
    const ModalContent = () => {
        const [form] = Form.useForm<DataForm>()
        /** 缓存form实例 */
        ModalCache.form = form
        const formData: DataForm = {
            myNodeName: '',
            remark: '',
            failRetryCount: 3,
            failRetryTime: 10,
            delayTime: 0,
            timeOutReport: true,
            timeOutStrategy: ['timeOut'],
            outTime: 30,
            email: '',
            datasourceType: 'mysql',
            datasource: 'mysql01',
            sqlType: 'query',
            sendEmail: true,
            segmentSymbol: '',
            logRows: 1,
            sqlContent: '',
            preSqlContent: '',
            postSqlContent: '',
            execStatus: 0
        }
        type SelectData = Array<{ label: string, value: string }>
        const timeOutStrategys = [
            { label: '超时告警', value: 'timeOut' },
            { label: '超时失败', value: 'outFail' }
        ];
        const [isTimeOutReport, setTimeOutReport] = useState<boolean>(formData.timeOutReport)
        const [sqlType, setSqlType] = useState<string>(formData.sqlType)
        const onTimeOutReportChange = (val: boolean) => {
            setTimeOutReport(val)
        }
        const [datasourceList, setDatasourceList] = useState<SelectData>([])
        const [datasourceTypeList, setDatasourceTypeList] = useState<SelectData>([{ label: 'mysql', value: 'mysql' }, { label: 'oracle', value: 'oracle' }])
        let getDataSourceList = (val: string) => {
            console.log(val);
            return new Promise((resolve) => {
                resolve([{ label: 'mysql数据源1', value: 'mysql01' }] as Array<{ label: string, value: string }>)
            })
        }

        const onDatasourceTypeChange = (val: string) => {
            getDataSourceList(val).then((res) => {
                setDatasourceList(res as SelectData)
            })
            form.setFieldsValue({ datasource: '' })
        }
        const onSqlTypeChange = (val: string) => {
            setSqlType(val)
        }
        const editorChange = (val: string) => {
            form.setFieldsValue({ sqlContent: val })
        }
        return (
            < >
                <Form form={form} layout={'vertical'} labelAlign='right' labelCol={{ style: { width: 120 } }} initialValues={formData}>
                    <Row gutter={24}>
                        <Col span={24}>
                            <Form.Item
                                name="myNodeName"
                                label="节点名称"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入节点名称',
                                    },
                                ]}
                            >
                                <Input placeholder='请输入节点名称' />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={24}>
                            <Form.Item
                                name="remark"
                                label="描述"
                            >
                                <Input.TextArea placeholder='请输入节点描述' />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={8}>
                            <Form.Item
                                name="failRetryCount"
                                label="失败重试次数"
                            >
                                <InputNumber addonAfter={<>次</>} placeholder='请输入' />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="failRetryTime"
                                label="失败重试间隔"
                            >
                                <InputNumber addonAfter={<>分</>} placeholder='请输入' />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="delayTime"
                                label="延迟执行时间"
                            >
                                <InputNumber addonAfter={<>分</>} placeholder='请输入' />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={8}>
                            <Form.Item
                                name="timeOutReport"
                                valuePropName='checked'
                                label="超时告警"
                            >
                                <Switch onChange={onTimeOutReportChange} checkedChildren="开启" unCheckedChildren="关闭" />
                            </Form.Item>
                        </Col>
                        {isTimeOutReport &&
                            <>
                                <Col span={8}>
                                    <Form.Item
                                        name='timeOutStrategy'
                                        label="超时告警策略"
                                    >
                                        <Checkbox.Group options={timeOutStrategys} />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        name="outTime"
                                        label="超时时长"
                                    >
                                        <InputNumber addonAfter={<>分</>} />
                                    </Form.Item>
                                </Col>
                            </>
                        }
                    </Row>
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item
                                name="datasourceType"
                                label="数据源类型"
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择数据源类型',
                                    },
                                ]}
                            >
                                <Select onChange={onDatasourceTypeChange} options={datasourceTypeList} placeholder="请选择">
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="datasource"
                                label="数据源实例"
                            >
                                <Select onChange={onDatasourceTypeChange} options={datasourceList} placeholder="请选择">
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={6}>
                            <Form.Item
                                name="sqlType"
                                label="SQL类型"
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择SQL类型',
                                    },
                                ]}
                            >
                                <Select onChange={onSqlTypeChange} placeholder="请选择">
                                    <Option value='query'>查询</Option>
                                    <Option value='other'>非查询</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        {sqlType === 'query' &&
                            <>
                                <Col span={6}>
                                    <Form.Item
                                        name="sendEmail"
                                        valuePropName='checked'
                                        label="发送邮件"
                                    >
                                        <Switch checkedChildren="开启" unCheckedChildren="关闭" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="日志显示"
                                    >
                                        <Row>
                                            <Col span={11}>
                                                <Form.Item
                                                    name="logRows"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: '请选择日志显示行数',
                                                        },
                                                    ]}
                                                >
                                                    <Select placeholder="请选择">
                                                        <Option value={1}>1</Option>
                                                        <Option value={10}>10</Option>
                                                        <Option value={25}>25</Option>
                                                        <Option value={50}>50</Option>
                                                        <Option value={100}>100</Option>
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                            <Col span={12} offset={1}><div style={{ paddingTop: '5px' }}>行查询结果</div></Col>
                                        </Row>
                                    </Form.Item>
                                </Col>
                            </>
                        }
                        {sqlType === 'other' &&
                            <Col span={18}>
                                <Form.Item
                                    name="segmentSymbol"
                                    label="分段执行符号"
                                >
                                    <Input placeholder='请输入分段执行符号' />
                                </Form.Item>
                            </Col>
                        }
                    </Row>
                    <Row gutter={24}>
                        <Col span={24}>
                            <Form.Item
                                name="sqlContent"
                                label="SQL语句"
                                rules={[
                                    {
                                        required: true,
                                        message: '请填写SQL语句',
                                    },
                                ]}
                            >
                                <MyMonacoEditor theme='vs-white' width='100%' height='300px' lang='sql' onChange={editorChange} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6} offset={18}>
                            <div style={{ width: '100%', 'textAlign': 'right' }}>
                                <Button onClick={() => { onHide(); }} style={{ marginRight: '8px' }}>取消</Button>
                                <Button onClick={() => { onOk(); }} type='primary'>保存</Button>
                            </div>
                        </Col>
                    </Row>
                </Form>
            </>
        )
    }
    /** 创建modal dom容器 */
    const container = createContainer()
    /** 创建modal */
    const modal = Modal.confirm({
        className: 'xflowForm',
        title: '修改节点',
        width: '700px',
        content: <ModalContent />,
        getContainer: () => {
            return container.element
        },
        okCancel: false,
        centered: true,
        keyboard: false
    })

    /** 缓存modal实例 */
    ModalCache.modal = modal

    /** showModal 返回一个Promise，用于await */
    return defer.promise
}

const createContainer = () => {
    const div = document.createElement('div')
    div.classList.add('xflow-modal-container')
    window.document.body.append(div)
    return {
        element: div,
        destroy: () => {
            window.document.body.removeChild(div)
        },
    }
}