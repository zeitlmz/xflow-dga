import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { BrowserRouter } from "react-router-dom";
import 'antd/dist/antd.css';
import '@antv/x6/dist/x6.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
)
