import { useState } from 'react';
import Monaco from 'react-monaco-editor';
export default (props: { onChange: Function, lang: string, width: string, height: string }) => {
    const [data, setState] = useState(JSON.stringify([
        {
            "f1": "2019-01",
            "f2": 100
        },
        {
            "f1": "2019-02",
            "f2": 300
        },
        {
            "f1": "2019-03",
            "f2": 340
        },
        {
            "f1": "2019-04",
            "f2": 330
        }
    ], null, 4))

    const options = {
        selectOnLineNumbers: true,
        renderSideBySide: false
    }
    const onChange = (val: string) => {
        props.onChange(val)
        setState(val)
    }
    setTimeout(() => {
        props.onChange(data)
    }, 1)
    return (<Monaco theme="vs-dark" height={props.height} width={props.width} language={props.lang} options={options} value={data} onChange={onChange} />)
}