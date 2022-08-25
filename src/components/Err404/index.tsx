import { Result } from 'antd'
export default function Err404() {
    return <Result
        status="404"
        title="404"
        subTitle="页面未找到"
    />
}
