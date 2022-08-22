import { AutoChart } from '@antv/auto-chart';
import { useState } from 'react';
import MyMonacoEditor from '../MyMonacoEditor';
export default function MyCharts() {
    const [data, setState] = useState([])
    const onChange = (val: string) => {
        // console.log(val);
        let arr;
        try {
            arr = JSON.parse(val)
            console.log(arr);
        } catch (err) {
            console.log(err);
            return
        }
        setState(arr)
    }
    return (
        <>
            <AutoChart showRanking={true} width={'100vw'} height={'50vh'} data={data} />
            <MyMonacoEditor theme='vs-dark' onChange={onChange} lang={'json'} height={'50vh'} width={'100%'} />
        </>
    )
}

