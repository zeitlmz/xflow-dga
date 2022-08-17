export interface DataForm {
    // 节点名称
    nodeName: string
    // 备注
    remark?: string
    // 失败重试次数
    failRetryCount: number
    // 失败重试间隔时间
    failRetryTime: number
    // 超时告警
    timeOutReport: boolean
    // 超时告警策略
    timeOutStrategy: Array<string>
    // 指定的超时时长(秒/s)
    outTime: number
    // 邮箱
    email: string
    // 数据源类型[mysqloracle等]
    datasourceType: string
    // 已维护好的数据源
    datasource: string
    // sql类型0:非查询1查询
    sqlType: number
    // 执行完成是否发送邮件
    sendEmail: boolean
    // sql语句
    sqlContent: string
    // 前置处理sql
    preSqlContent: string
    // 后置处理sql
    postSqlContent: string
    // 执行状态,0:未开始,1:执行中,3:执行成功,4:执行失败,5:已超时,6:超时失败
    execStatus: number
}