// Core
import React, { PureComponent } from 'react';

// Instruments
import Styles from './styles.m.css';

// Components
import Checkbox from '../../theme/assets/Checkbox';
import { checkTaskConfig } from '../../theme/assets/CheckboxConfig';
import Star from '../../theme/assets/Star';
import Edit from '../../theme/assets/Edit';
import Remove from '../../theme/assets/Remove';

export default class Task extends PureComponent {
    _getTaskShape = ({
        id = this.props.id,
        completed = this.props.completed,
        favorite = this.props.favorite,
        message = this.props.message,
    }) => ({
        id,
        completed,
        favorite,
        message,
    });

    render () {
        return (
            <li className = { Styles.task }>                
                <div className = { Styles.content }>
                    <Checkbox inlineBlock className = { Styles.toggleTaskCompletedState }  {...checkTaskConfig} />    
                    <input disabled type="text" value="The task"/>
                    
                </div>
                <div className = { Styles.actions }>
                    <Star inlineBlock className = { Styles.toggleTaskFavoriteState } />
                    <Edit inlineBlock className = { Styles.updateTaskMessageOnClick } />
                    <Remove inlineBlock />
                </div>                
            </li>
        );
    }
}
