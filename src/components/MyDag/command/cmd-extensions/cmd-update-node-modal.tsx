import React, { useRef, useState } from 'react'
import type { HookHub, ICmdHooks as IHooks, NsGraph, IModelService } from '@antv/xflow'
import { Deferred, ManaSyringe } from '@antv/xflow'
import { FormInstance, InputNumber, Switch } from 'antd'
import { Modal, Form, Button, Input, Select, Row, Col, Popover } from 'antd'
const { Option } = Select;
import type { IArgsBase, ICommandHandler, IGraphCommandService } from '@antv/xflow'
import { ICommandContextProvider } from '@antv/xflow'
import QnnReactCron from "qnn-react-cron";
import { CustomCommands } from './constants'
import 'antd/es/modal/style/index.css'
import { FormOutlined } from '@ant-design/icons'
import type { IFormProps } from '../entity/TaskFrom'
import './model-custom.less'
import { DataForm } from '../entity/DataForm'
import { resolve } from 'path'
import { rejects } from 'assert'
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
        updateNodeNameService: updateNodeDataService
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
            nodeName: '',
            remark: '',
            failRetryCount: 3,
            failRetryTime: 10,
            timeOutReport: true,
            timeOutStrategy: [],
            outTime: 30,
            email: '',
            datasourceType: 'mysql',
            datasource: '',
            sqlType: 1,
            sendEmail: true,
            sqlContent: '',
            preSqlContent: '',
            postSqlContent: '',
            execStatus: 0
        }
        type SelectData = Array<{ label: string, value: string }>
        const [timeOutReport, setTimeOutReport] = useState<boolean>(formData.timeOutReport)
        const onTimeOutReportChange = (val: boolean) => {
            setTimeOutReport(val)
        }
        const [datasourceList, setDatasourceList] = useState<SelectData>([])
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
        return (
            < >
                <Form form={form} labelAlign='right' labelCol={{ style: { width: 120 } }} initialValues={formData}>
                    <Row gutter={24}>
                        <Col span={24}>
                            <Form.Item
                                name="nodeName"
                                label="节点名称"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入节点名称',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={24}>
                            <Form.Item
                                name="remark"
                                label="描述"
                            >
                                <Input.TextArea />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item
                                name="failRetryCount"
                                label="失败重试次数"
                            >
                                <InputNumber placeholder='请输入' />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="failRetryTime"
                                label="失败重试间隔"
                            >
                                <Input placeholder='请输入' />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item
                                name="glueType"
                                label="超时告警"
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择运行模式',
                                    },
                                ]}
                            >
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item
                                name="datasourceType"
                                label="请选择数据源类型"
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择数据源类型',
                                    },
                                ]}
                            >
                                <Select onChange={onDatasourceTypeChange} placeholder="请选择">
                                    {datasourceList.map(item => <Option value={item.value}>{item.label}</Option>)}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            {scheduleType === "CRON" &&
                                <Form.Item label="CRON表达式"
                                >
                                    <Form.Item name='cronGenDisplay' noStyle rules={[
                                        { required: true, message: '请输入CRON表达式' }
                                    ]}>
                                        <Input placeholder='请输入CRON表达式' style={{ width: 'calc(100% - 32px)' }} />
                                    </Form.Item>
                                    <Popover visible={showPopover} placement="right" content={
                                        <div style={{ width: '350px' }}>
                                            <
                                                // @ts-ignore
                                                QnnReactCron value="* * * * * ? *" onOk={getCronValue}
                                                getCronFns={(fns: any) => {
                                                    cronFns = fns
                                                }}
                                                footer={
                                                    <>
                                                        <Button key={'btn1'} style={{ marginRight: '10px' }} onClick={() => { setShowPopover(false) }}>
                                                            取消
                                                        </Button>
                                                        <Button type="primary" onClick={() => {
                                                            getCronValue(cronFns.getValue())
                                                        }}>
                                                            确定
                                                        </Button>
                                                    </>
                                                }
                                            />
                                        </div>
                                    } trigger="click">
                                        <Button icon={<FormOutlined />} onClick={() => {
                                            setShowPopover(true)
                                        }}></Button>
                                    </Popover>
                                </Form.Item>}
                            {scheduleType === "FIX_RATE" &&
                                <Form.Item
                                    name="schedule_conf_FIX_RATE"
                                    label="固定速度"
                                    rules={[
                                        { required: true, message: '请输入(单位秒)' }
                                    ]}
                                >
                                    <InputNumber style={{ width: '100%' }} placeholder='请输入(单位秒)' />
                                </Form.Item>
                            }
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={24}>
                            <Form.Item
                                name="executorParam"
                                label="执行参数"
                                rules={[
                                    {
                                        required: true,
                                        message: '请填写执行参数',
                                    },
                                ]}
                            >
                                <Input.TextArea placeholder='请填写执行参数' />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item
                                name="executorRouteStrategy"
                                label="路由策略"
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择路由策略',
                                    },
                                ]}
                            >
                                <Select placeholder="请选择">
                                    <Option value="FIRST">第一个</Option>
                                    <Option value="LAST">最后一个</Option>
                                    <Option value="ROUND">轮询</Option>
                                    <Option value="RANDOM">随机</Option>
                                    <Option value="CONSISTENT_HASH">一致性HASH</Option>
                                    <Option value="LEAST_FREQUENTLY_USED">最不经常使用</Option>
                                    <Option value="LEAST_RECENTLY_USED">最近最久未使用</Option>
                                    <Option value="FAILOVER">故障转移</Option>
                                    <Option value="BUSYOVER">忙碌转移</Option>
                                    <Option value="SHARDING_BROADCAST">分片广播</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="childJobId"
                                label="子任务ID"
                            >
                                <Input placeholder='请输入子任务ID' />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item
                                name="misfireStrategy"
                                label="调度过期策略"
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择调度过期策略',
                                    },
                                ]}
                            >
                                <Select placeholder="请选择">
                                    <Option value="DO_NOTHING" selected="">忽略</Option>
                                    <Option value="FIRE_ONCE_NOW">立即执行一次</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="executorBlockStrategy"
                                label="阻塞处理策略"
                                rules={[
                                    { required: true, message: '请选择阻塞处理策略' }
                                ]}
                            >
                                <Select placeholder="请选择">
                                    <Option value="SERIAL_EXECUTION">单机串行</Option>
                                    <Option value="DISCARD_LATER">丢弃后续调度</Option>
                                    <Option value="COVER_EARLY">覆盖之前调度</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item
                                name="executorTimeout"
                                label="任务超时时间"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入任务超时时间',
                                    },
                                ]}
                            >
                                <InputNumber placeholder='请输入任务超时时间' />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="executorFailRetryCount"
                                label="失败重试次数"
                                rules={[
                                    { required: true, message: '请输入失败重试次数' }
                                ]}
                            >
                                <InputNumber placeholder='请输入失败重试次数' />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6} offset={18}>
                            <div style={{ width: '100%', 'textAlign': 'right' }}>
                                <Button onClick={() => { onHide(); setShowPopover(false) }} style={{ marginRight: '8px' }}>取消</Button>
                                <Button onClick={() => { onOk(); setShowPopover(false) }} type='primary'>保存</Button>
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