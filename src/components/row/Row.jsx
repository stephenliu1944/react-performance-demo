import styles from './row.css';
import React, { PureComponent } from 'react';
import Column from '../column/Column';
import { batchCreateItems } from '../../utils/util';

export default class Row extends PureComponent {

    constructor(props) {
        super(props);
        
        this.state = {
            columns: batchCreateItems(10)
        };
    }
    
    static height = 200;    // 行高

    render() {
        var { show } = this.props;

        return (
            <li className={styles.row} id={this.props.id}>            
                {                
                    show ? this.state.columns.map((column) => {
                        return <Column key={column.id} />;
                    }) : null
                }
            </li>
        );
    }
}