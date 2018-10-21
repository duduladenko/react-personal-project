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

    _removeTask = () => {
        const { _removeTaskAsync, id } = this.props;

        _removeTaskAsync(id);
    }

    _toggleTaskCompletedState= () => {
        const { _updateTaskAsync, completed } = this.props;

        _updateTaskAsync(
            this._getTaskShape({
                completed: !completed,
            })
        );
    }

    _toggleTaskFavoriteState = () => {
        const { _updateTaskAsync, favorite } = this.props;

        _updateTaskAsync(
            this._getTaskShape({
                favorite: !favorite,
            })
        );
    }

    render () {
        const { completed, favorite, message }  = this.props;

        return (
            <li className = { Styles.task }>                
                <div className = { Styles.content }>
                    <Checkbox
                        inlineBlock
                        checked = { completed }
                        className = { Styles.toggleTaskCompletedState }
                        {...checkTaskConfig }
                        onClick = { this._toggleTaskCompletedState }
                    />    
                    <input disabled type="text" value = { message }/>
                    
                </div>
                <div className = { Styles.actions }>
                    <Star
                        inlineBlock
                        checked = { favorite }
                        className = { Styles.toggleTaskFavoriteState }
                        onClick = { this._toggleTaskFavoriteState }
                    />
                    <Edit inlineBlock className = { Styles.updateTaskMessageOnClick } />
                    <Remove inlineBlock onClick = { this._removeTask } />
                </div>                
            </li>
        );
    }
}
