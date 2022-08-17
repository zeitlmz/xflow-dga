import React from 'react';
import { AutoChart } from '@antv/auto-chart';
import { useState } from 'react';
import MyMonacoEditor from '../MyMonacoEditor';
export default function MyCharts() {
    const [data, setState] = useState([])
    const onChange = (val: string) => {
        let arr;
        try {
            arr = JSON.parse(val)
        } catch (err) {
            console.error(err);
            return
        }
        setState(arr)
    }
    return (
        <div>
            <AutoChart showRanking={true} width={'100vw'} height={'50vh'} data={data} />
            <MyMonacoEditor onChange={onChange} lang={'json'} height={'50vh'} width={'100%'} />
        </div>
    )
}

