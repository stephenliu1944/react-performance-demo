import React, { Component } from 'react';
import styles from './grid.css';
import io from 'socket.io-client';
import Row from '../../components/row/Row';
import { isVisibleChild, batchCreateItems, throttle } from '../../utils/util';

var socket;
const ROW_COUNT = 1000;                                   // 初始生成1000行数据
const SERVER = `http://localhost:${__SOCKET_PORT__}`;     // websocket服务器地址

export default class Grid extends Component {

    constructor(props) {
        super(props);

        socket = io(SERVER);

        // 监听 websocket 连接建立
        socket.on('connect', () => {
            console.log('connected');
        });
        // 监听 websocket 连接断开
        socket.on('disconnect', (reason) => {
            console.log('disconnect');
            if (reason === 'io server disconnect') {
                socket.connect();
            }
        });
        // 监听错误事件
        socket.on('error', (reason) => {
            console.log('error', reason);
        });

        this.state.list = batchCreateItems(ROW_COUNT);
        this.checkVisibleRows();   
    }

    static height = 600;        // 容器高度

    state = {
        list: [],
        shouldUpdate: false,
        element: null           // 当前组件的ref
    }

    componentDidMount() {
        socket.on('message', (row) => {
            this.state.list.push(row);
            this.refresh();
        });
    }

    componentWillUnmount() {
        socket.disconnect();
    }
    // 将已经滚动到不可见区域的 Row 隐藏
    checkVisibleRows = () => {
        var scrollTop = this.element ? this.element.scrollTop : 0;
        var shouldUpdate = false;

        this.state.list.forEach((row, index) => {
            var visible = isVisibleChild(index, scrollTop, Grid.height, Row.height);
            if (row.visible !== visible) {
                row.visible = visible;
                if (!shouldUpdate) {
                    shouldUpdate = true;
                }
            }
        });
        this.state.shouldUpdate = shouldUpdate;
    }

    resetVisibleRows = () => {
        this.checkVisibleRows();                // 重新校验哪些row可见
        this.setState(this.state);
    }

    refresh = throttle(this.resetVisibleRows, 1000)     // 用于节流socket推送的数据

    handleScroll = throttle(this.resetVisibleRows, 50)  // 用于节流滚动条滚动事件

    shouldComponentUpdate(nextProps, nextState) { 
        // 确保添加数据或者滚动scrollBall时不需要渲染的情况      
        return this.state.list.length !== nextState.list.length || nextState.shouldUpdate;
    }

    render() {
        var { list = [] } = this.state;

        return (
            <ul className={styles.grid} onScroll={this.handleScroll} ref={(el) => this.element = el}>
                {
                    list.map((row) => {
                        return <Row key={row.id} id={row.id} show={row.visible} />;
                    })
                }
            </ul>
        );
    }
}