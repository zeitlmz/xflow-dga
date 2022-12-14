import { Button, Input, Table, TablePaginationConfig, Modal, message, Form, Row, Col, Select, InputNumber, Switch, Badge, Dropdown, Menu, Popover } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined, ExclamationCircleOutlined, FormOutlined, ClusterOutlined, MoreOutlined } from '@ant-design/icons';
import React, { ReactNode, useEffect, useState } from 'react';
const { Option } = Select
import QnnReactCron from "qnn-react-cron";
import './index.less'
import { DagForm } from '../../entity/DagForm';
import { BaseForm } from '../../entity/BaseForm';
import MyMonacoEditor from '../../components/MyMonacoEditor';
import MyDag from '../../components/MyDag';
interface DataType {
    id: number,
    flowName: string;
    remark: string;
    status: number;
    createTime: string;
    updateTime: string;
    leastExecTime: string;
}

const getRandomuserParams = (params: { [any: string]: any }) => ({
    results: params.pagination?.pageSize,
    page: params.pagination?.current,
    ...params,
});

const DagMan = () => {
    const formData = {
        timeOutReport: false
    }

    const baseFormData = {
        scheduleType: 'CRON'
    }
    const [form] = Form.useForm<DagForm>()
    const [baseForm] = Form.useForm<BaseForm>()
    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: 10,
    });

    const fetchData = (params: { [any: string]: any }) => {
        setLoading(true);
        new Promise((resolve) => {
            resolve({
                code: 200,
                message: '操作成功',
                data: [
                    {
                        id: 1,
                        flowName: '工作流01',
                        remark: '前端写死的数据',
                        status: 0,
                        createTime: '2022-08-19 00:00:00',
                        updateTime: '2022-08-19 00:00:00',
                        leastExecTime: '2022-08-19 00:00:00'
                    },
                    {
                        id: 2,
                        flowName: '工作流02',
                        remark: '前端写死的数据',
                        status: 1,
                        createTime: '2022-08-19 00:00:00',
                        updateTime: '2022-08-19 00:00:00',
                        leastExecTime: '2022-08-19 00:00:00'
                    },
                    {
                        id: 3,
                        flowName: '工作流03',
                        remark: '前端写死的数据',
                        status: 2,
                        createTime: '2022-08-19 00:00:00',
                        updateTime: '2022-08-19 00:00:00',
                        leastExecTime: '2022-08-19 00:00:00'
                    },
                    {
                        id: 4,
                        flowName: '工作流04',
                        remark: '前端写死的数据',
                        status: 3,
                        createTime: '2022-08-19 00:00:00',
                        updateTime: '2022-08-19 00:00:00',
                        leastExecTime: '2022-08-19 00:00:00'
                    },
                    {
                        id: 5,
                        flowName: '工作流05',
                        remark: '前端写死的数据',
                        status: 4,
                        createTime: '2022-08-19 00:00:00',
                        updateTime: '2022-08-19 00:00:00',
                        leastExecTime: '2022-08-19 00:00:00'
                    },
                    {
                        id: 6,
                        flowName: '工作流06',
                        remark: '前端写死的数据',
                        status: 5,
                        createTime: '2022-08-19 00:00:00',
                        updateTime: '2022-08-19 00:00:00',
                        leastExecTime: '2022-08-19 00:00:00'
                    }
                ]
            })
        }).then((res: any) => {
            setData(res.data);
            setLoading(false);
            setPagination({
                ...params.pagination,
                total: 200
            });
        });
    };

    // 执行状态,0:未运行,1:运行中,2:执行成功,3:执行失败,4:已超时,5:超时失败
    const flowStatus: { [any: number]: any } = {
        0: { status: 'default', text: '未运行' },
        1: { status: 'processing', text: '运行中' },
        2: { status: 'success', text: '运行完成' },
        3: { status: 'error', text: '运行出错' },
        4: { status: 'warning', text: '已超时' },
        5: { status: 'error', text: '超时失败' }
    }

    const execFlow = (id: number, command: string) => {
        console.log(id);
        switch (command) {
            case 'start':
                Modal.confirm({
                    title: '确认运行?',
                    icon: <ExclamationCircleOutlined />,
                    centered: true,
                    onOk: () => {
                        message.success('运行成功')
                    }
                })
                break;
            case 'stop':
                Modal.confirm({
                    title: '确认停止运行?',
                    icon: <ExclamationCircleOutlined />,
                    centered: true,
                    onOk: () => {
                        message.success('停止成功')
                    }
                })
                break;
        }
    }

    const columns: ColumnsType<DataType> = [
        {
            title: '工作流名称',
            dataIndex: 'flowName',
            width: '200px'
        },
        {
            title: '状态',
            dataIndex: 'status',
            width: '120px',
            filters: [
                {
                    text: '未运行',
                    value: 0,
                },
                {
                    text: '执行中',
                    value: 1,
                },
                {
                    text: '执行成功',
                    value: 2,
                },
                {
                    text: '执行失败',
                    value: 3,
                },
                {
                    text: '已超时',
                    value: 4,
                },
                {
                    text: '超时失败',
                    value: 5,
                }
            ],
            render: (value) => <><Badge status={flowStatus[value].status} /><span>{flowStatus[value].text}</span></>,
        },
        {
            title: '描述',
            dataIndex: 'remark',
        },
        {
            title: '最近执行时间',
            dataIndex: 'leastExecTime',
            width: '180px',
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            width: '180px',
        },
        {
            title: '更新时间',
            dataIndex: 'updateTime',
            width: '180px',
        },
        {
            title: '操作',
            width: '200px',
            render: (value) => {
                return (
                    <>
                        <Dropdown.Button buttonsRender={() => [<Button type='primary' danger={value.status === 1} onClick={() => execFlow(value.id, value.status === 1 ? 'stop' : 'start')}>{value.status !== 1 ? '运行' : '停止'}</Button>, <Button icon={<MoreOutlined />}></Button>]} style={{ marginRight: '10px' }} overlay={
                            <Menu
                                onClick={(menuInfo) => {
                                    if (menuInfo.key == '1') {
                                        showBaseForm('修改基础信息')
                                    } else if (menuInfo.key == '2') {
                                        showForm('修改工作流')
                                    }
                                }}
                                items={[
                                    {
                                        label: '修改信息',
                                        key: '1',
                                        icon: <FormOutlined />,
                                    },
                                    {
                                        label: '修改流程',
                                        key: '2',
                                        icon: <ClusterOutlined />,
                                    },
                                ]}
                            />
                        }>
                        </Dropdown.Button>
                        <Button onClick={() => { handleDelete(value.id) }} disabled={value.status === 1} type='primary' danger>删除</Button>
                    </>
                )
            }
        },
    ];

    useEffect(() => {
        fetchData({
            pagination,
        });
    }, []);

    const [showPopover, setShowPopover] = useState<boolean>(false);

    const [autoRun, setAutoRun] = useState<boolean>(false);

    const [scheduleType, setScheduleType] = useState<string>(baseFormData.scheduleType);

    const [isShow, setIsShow] = useState<boolean>(false);

    const [baseIsShow, setBaseIsShow] = useState<boolean>(false);

    const [modalTitle, setModalTitle] = useState<string>('新增数据源');

    const [okLoading, setOkLoading] = useState<boolean>(false);


    const handleTableChange = (newPagination: TablePaginationConfig, filters: { [any: string]: any }, sorter: { [any: string]: any }) => {
        fetchData({
            sortField: sorter.field,
            sortOrder: sorter.order,
            pagination: newPagination,
            ...filters,
        });
    };
    const search = () => {

    }
    const showForm = (title: string) => {
        setModalTitle(title)
        setIsShow(true)
    }
    const showBaseForm = (title: string) => {
        setModalTitle(title)
        setBaseIsShow(true)
    }
    // 新增数据源
    const add = () => {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    code: 200,
                    message: '新增成功',
                    data: null
                })
            }, 1500)
        })
    }
    // 修改数据源
    const update = () => {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    code: 200,
                    message: '修改成功',
                    data: null
                })
            }, 1500)
        })
    }
    // 删除数据源
    const deleteRow = (id: number) => {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    code: 200,
                    message: '删除成功',
                    data: null
                })
            }, 1500)
        })
    }
    // 打开删除数据的确认弹窗
    const handleDelete = (id: number) => {
        Modal.confirm({
            title: 'Confirm',
            icon: <ExclamationCircleOutlined />,
            content: '确认删除此条数据?',
            centered: true,
            onOk: () => {
                const hide = message.loading('删除中...')
                deleteRow(id).then((res: any) => {
                    hide()
                    if (res.code === 200) {
                        message.success({ content: '删除成功' })
                    }
                })
            },
        });
    }
    const handleOk = async () => {
        await form.validateFields()
        setOkLoading(true)
        if (modalTitle === '修改工作流') {
            update().then((res: any) => {
                if (res.code === 200) {
                    setIsShow(false)
                    setOkLoading(false)
                    message.success({ content: res.message })
                }
            })
        } else {
            add().then((res: any) => {
                if (res.code === 200) {
                    setIsShow(false)
                    setOkLoading(false)
                    message.success({ content: res.message })
                }
            })
        }

    }
    const handleBaseOk = async () => {
        await baseForm.validateFields()
        setOkLoading(true)
        update().then((res: any) => {
            if (res.code === 200) {
                setBaseIsShow(false)
                setOkLoading(false)
                message.success({ content: res.message })
            }
        })

    }

    const onScheduleTypeChange = (val: string) => {
        setScheduleType(val)
        setShowPopover(false)
        baseForm.setFieldsValue({ cronGenDisplay: '' })
    }
    const handleCancel = () => {
        setIsShow(false)

    }

    const handleBaseCancel = () => {
        setBaseIsShow(false)

    }

    const editorChange = (val: string) => {
        form.setFieldsValue({ params: val })
    }
    const [isTimeOutReport, setTimeOutReport] = useState<boolean>(formData.timeOutReport)
    const onTimeOutReportChange = (val: boolean) => {
        setTimeOutReport(val)
    }
    const autoRunChange = (val: boolean) => {
        setAutoRun(val)
    }
    let cronFns: any = {}
    let getCronValue = (val: string) => {
        console.log(val);
        baseForm.setFieldsValue({ cronGenDisplay: val })
        setShowPopover(false)
    }
    return (
        <>
            <Modal okText='保存' className='dagModal01' maskClosable={false} destroyOnClose centered width={'100%'} title={modalTitle} visible={isShow} onOk={handleOk} onCancel={handleCancel} confirmLoading={okLoading}>
                <div style={{ display: 'flex', height: 'calc(100vh - 108px)' }}>
                    <div className='left-form'>
                        <Form form={form} layout={'vertical'} labelAlign='right' labelCol={{ style: { width: 120 } }} initialValues={formData}>
                            <Row gutter={24}>
                                <Col span={24}>
                                    <Form.Item
                                        name="flowName"
                                        label="工作流名称"
                                        rules={[
                                            {
                                                required: true,
                                                message: '请输入工作流名称',
                                            },
                                        ]}
                                    >
                                        <Input placeholder='请输入工作流名称' />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col span={24}>
                                    <Form.Item
                                        name="remark"
                                        label="描述"
                                    >
                                        <Input.TextArea placeholder='请输入数据源描述' />
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
                                    <Col span={16}>
                                        <Form.Item
                                            name="outTime"
                                            label="超时时长"
                                        >
                                            <InputNumber style={{ width: '100%' }} addonAfter={<>分</>} />
                                        </Form.Item>
                                    </Col>
                                }
                            </Row>
                            <Row gutter={24}>
                                <Col span={24}>
                                    <Form.Item
                                        name="execStrategy"
                                        label="执行策略"
                                        rules={[
                                            {
                                                required: true,
                                                message: '请选择执行策略',
                                            },
                                        ]}
                                    >
                                        <Select placeholder='请选择'>
                                            <Option value='并行'>并行</Option>
                                            <Option value='串行等待'>串行等待</Option>
                                            <Option value='串行抛弃'>串行抛弃</Option>
                                            <Option value='串行优先'>串行优先</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col span={24}>
                                    <Form.Item
                                        name="globalVariables"
                                        label="全局变量"
                                    >
                                        <MyMonacoEditor theme='vs-white' width='100%' height='150px' lang='json' onChange={editorChange} />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                    <MyDag meta={{ flowId: 'myXFlow2' }} />
                </div>
            </Modal>
            <Modal okText='保存' className='dagModal01' maskClosable={false} destroyOnClose centered width={'600px'} title={modalTitle} visible={baseIsShow} onOk={handleBaseOk} onCancel={handleBaseCancel} confirmLoading={okLoading}>
                <div style={{ padding: '20px' }}>
                    <Form form={baseForm} layout={'vertical'} labelAlign='right' initialValues={baseFormData}>
                        <Row gutter={24}>
                            <Col span={24}>
                                <Form.Item
                                    name="flowName"
                                    label="工作流名称"
                                    rules={[
                                        {
                                            required: true,
                                            message: '请输入工作流名称',
                                        },
                                    ]}
                                >
                                    <Input placeholder='请输入工作流名称' />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={24}>
                                <Form.Item
                                    name="remark"
                                    label="描述"
                                >
                                    <Input.TextArea placeholder='请输入数据源描述' />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={6}>
                                <Form.Item
                                    name="autoRun"
                                    valuePropName='checked'
                                    label="自动运行"
                                >
                                    <Switch onChange={autoRunChange} checkedChildren="开启" unCheckedChildren="关闭" />
                                </Form.Item>
                            </Col>
                            {autoRun &&
                                <>
                                    <Col span={9}>
                                        <Form.Item
                                            name="scheduleType"
                                            label="运行策略"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: '请选择执行策略',
                                                },
                                            ]}
                                        >
                                            <Select onChange={onScheduleTypeChange} placeholder='请选择'>
                                                <Option value='CRON'>CRON表达式</Option>
                                                <Option value='SPEED'>固定速度</Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={9}>
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
                                        {scheduleType === "SPEED" &&
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
                                </>
                            }

                        </Row>
                        <Row gutter={24}>
                            <Col span={6}>
                                <Form.Item
                                    name="timeOutReport"
                                    valuePropName='checked'
                                    label="超时告警"
                                >
                                    <Switch onChange={onTimeOutReportChange} checkedChildren="开启" unCheckedChildren="关闭" />
                                </Form.Item>
                            </Col>
                            {isTimeOutReport &&
                                <Col span={18}>
                                    <Form.Item
                                        name="outTime"
                                        label="超时时长"
                                    >
                                        <InputNumber style={{ width: '100%' }} addonAfter={<>分</>} />
                                    </Form.Item>
                                </Col>
                            }
                        </Row>
                        <Row gutter={24}>
                            <Col span={24}>
                                <Form.Item
                                    name="execStrategy"
                                    label="节点执行策略"
                                    rules={[
                                        {
                                            required: true,
                                            message: '请选择执行策略',
                                        },
                                    ]}
                                >
                                    <Select placeholder='请选择'>
                                        <Option value='并行'>并行</Option>
                                        <Option value='串行等待'>串行等待</Option>
                                        <Option value='串行抛弃'>串行抛弃</Option>
                                        <Option value='串行优先'>串行优先</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={24}>
                                <Form.Item
                                    name="globalVariables"
                                    label="全局变量(JSON格式)"
                                >
                                    <MyMonacoEditor theme='vs-white' width='100%' height='150px' lang='json' onChange={editorChange} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </Modal>
            <div className='search-box'>
                <Button type='primary' onClick={() => { showForm('创建工作流') }}>创建工作流</Button>
                <div className='right'>
                    <Input placeholder='请输入工作流名称' />
                    <Button type='primary' icon={<SearchOutlined />} style={{ marginLeft: '10px' }} onClick={search}></Button>
                </div>
            </div>
            <div className='table-box'>
                <Table
                    columns={columns}
                    rowKey={(record) => record.id}
                    dataSource={data}
                    pagination={pagination}
                    loading={loading}
                    onChange={handleTableChange}
                />
            </div>
        </>
    );
};

export default DagMan;