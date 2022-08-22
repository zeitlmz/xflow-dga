import { Button, Input, Table, TablePaginationConfig, Modal, message, Form, Row, Col, Select, InputNumber } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined, ExclamationCircleOutlined, LockFilled } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
const { Option } = Select
import './index.less'
import { DataSourceForm } from '../../entity/DataSourceForm';
import MyMonacoEditor from '../../components/MyMonacoEditor';
import { dbUtil } from '../../db/index'
interface DataType {
    id: number,
    datasourceName: string;
    datasourceType: string;
    datasourceUrl: string;
    remark: string;
    createTime: string;
    updateTime: string;
}

const getRandomuserParams = (params: { [any: string]: any }) => ({
    results: params.pagination?.pageSize,
    page: params.pagination?.current,
    ...params,
});

const DataSourceMan = () => {
    const formData = {}
    const [form] = Form.useForm<DataSourceForm>()
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
                data: [{
                    id: 1,
                    datasourceName: 'mysql数据源01',
                    datasourceType: 'mysql',
                    datasourceUrl: 'jdbc:mysql://localhost:3306/demo',
                    remark: '前端写死的数据',
                    createTime: '2022-08-19 00:00:00',
                    updateTime: '2022-08-19 00:00:00'
                },
                {
                    id: 2,
                    datasourceName: 'oracle数据源02',
                    datasourceType: 'oracle',
                    datasourceUrl: 'jdbc:oracle://localhost:1521/demo2',
                    remark: '前端写死的数据',
                    createTime: '2022-08-19 00:00:00',
                    updateTime: '2022-08-19 00:00:00'
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
    const columns: ColumnsType<DataType> = [
        {
            title: '数据源名称',
            dataIndex: 'datasourceName',
            width: '200px'
        }
        ,
        {
            title: '数据源类型',
            dataIndex: 'datasourceType',
            width: '120px',
            filters: [
                {
                    text: 'mysql',
                    value: 'mysql',
                },
                {
                    text: 'oracle',
                    value: 'oracle',
                },
            ],
        },
        {
            title: '连接地址',
            dataIndex: 'datasourceUrl',
            width: '20%',
        },
        {
            title: '描述',
            dataIndex: 'remark',
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
            width: '180px',
            render: (value) => <><Button style={{ marginRight: '5px' }} onClick={() => { showForm('修改数据源') }} type='primary'>修改</Button><Button onClick={() => { handleDelete(value.id) }} type='primary' danger>删除</Button></>,
        },
    ];

    useEffect(() => {
        fetchData({
            pagination,
        });
    }, []);

    const [isShow, setIsShow] = useState<boolean>(false);

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
            okText: '确认',
            cancelText: '取消',
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
        if (modalTitle === '修改数据源') {
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
    const handleCancel = () => {
        setIsShow(false)

    }

    const editorChange = (val: string) => {
        form.setFieldsValue({ params: val })
    }

    const testConn = () => {
        const { databaseName, datasourceType, ip, password, port, username } = form.getFieldsValue()
        // const conn = dbUtil(datasourceType, ip, parseInt(port), username, password, databaseName)
        // if (conn) {
        message.success('连接成功')
        // } else {
        // message.error('连接失败')
        // }
    }
    return (
        <>
            <Modal maskClosable={false} okText='保存' footer={<>
                <Button onClick={handleCancel}>取消</Button>
                <Button type='primary' onClick={testConn}>测试连接</Button>
                <Button type='primary' loading={okLoading} onClick={handleOk}>保存</Button>
            </>} destroyOnClose centered title={modalTitle} visible={isShow} onCancel={handleCancel}>
                <Form form={form} layout={'vertical'} labelAlign='right' labelCol={{ style: { width: 120 } }} initialValues={formData}>
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
                                <Select placeholder='请选择'>
                                    <Option value='mysql'>mysql</Option>
                                    <Option value='oracle'>oracle</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="datasourceName"
                                label="数据源名称"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入数据源名称',
                                    },
                                ]}
                            >
                                <Input placeholder='请输入数据源名称' />
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
                        <Col span={16}>
                            <Form.Item
                                name="ip"
                                label="IP主机名"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入数据库IP地址',
                                    },
                                ]}
                            >
                                <Input placeholder='请输入数据库IP地址' />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="port"
                                label="端口"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入端口',
                                    },
                                ]}
                            >
                                <InputNumber style={{ width: '100%' }} placeholder='端口' />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item
                                name="username"
                                label="用户名"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入用户名',
                                    },
                                ]}
                            >
                                <Input placeholder='请输入用户名' />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="password"
                                label="密码"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入密码',
                                    },
                                ]}
                            >
                                <Input placeholder='请输入密码' type='password' />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={24}>
                            <Form.Item
                                name="databaseName"
                                label="数据库名称"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入数据库名称',
                                    },
                                ]}
                            >
                                <Input placeholder='请输入数据库名称' />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={24}>
                            <Form.Item
                                name="params"
                                label="jdbc连接参数"
                            >
                                <MyMonacoEditor theme='vs-white' width='100%' height='150px' lang='json' onChange={editorChange} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
            <div className='search-box'>
                <Button type='primary' onClick={() => { showForm('创建数据源') }}>创建数据源</Button>
                <div className='right'>
                    <Input placeholder='请输入数据源名称' />
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

export default DataSourceMan;