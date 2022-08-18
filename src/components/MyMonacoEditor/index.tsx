import { useState } from 'react';
import Monaco from 'react-monaco-editor';

export default (props: { onChange: Function, lang: string, defaultValue?: string, theme?: string, width: string, height: string }) => {
    const [data, setState] = useState<string>(props.defaultValue || '')

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
    return (<div style={{ border: '1px solid rgb(240, 240, 240)' }}><Monaco theme={props.theme ? props.theme : 'vs-dark'} height={props.height} width={props.width} language={props.lang} options={options} value={data} onChange={onChange} /></div>)
}
