// Core
import React, { PureComponent } from 'react';

// Instruments
import Styles from './styles.m.css';
import { checkTaskConfig } from '../../theme/assets/CheckboxConfig';

// Components
import Checkbox from '../../theme/assets/Checkbox';
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

    state = {
        isTaskEditing: false,
        newMessage: this.props.message
    }

    taskInput = React.createRef();

    _removeTask = () => {
        const { _removeTaskAsync, id } = this.props;

        _removeTaskAsync(id);
    }

    _toggleTaskCompletedState= () => {
        const { _updateTaskAsync, completed } = this.props;

        _updateTaskAsync(
            this._getTaskShape({ completed: !completed})
        );
    }

    _toggleTaskFavoriteState = () => {
        const { _updateTaskAsync, favorite } = this.props;

        _updateTaskAsync(
            this._getTaskShape({ favorite: !favorite })
        );
    }

    _updateNewTaskMessage = (event) => {
        const { value: message } = event.target;

        this.setState({ newMessage: message });
    }

    _taskInputFocus = () => {
        this.taskInput.current.focus();
    }
    
    _setTaskEditingState = (state) => {
        this.setState({ isTaskEditing: state }, () => {
            if(state)
                this._taskInputFocus();
        });
    }

    _cancelUpdatingTaskMessage = () => {
        const { message }  = this.props;

        this.setState({ newMessage: message, isTaskEditing: false });
    }

    _updateTask = () => {
        const { _updateTaskAsync, message } = this.props;
        const { newMessage } = this.state;

        if(newMessage === '')
            return null;

        if(newMessage === message) {
            this._setTaskEditingState(false);

            return null;
        } else {
            _updateTaskAsync(
                this._getTaskShape({ message: newMessage })
            );

            this._setTaskEditingState(false);
        }
    }

    _updateTaskMessageOnClick = () => {
        const { isTaskEditing } = this.state;

        if(isTaskEditing)
            this._updateTask();
        else
            this._setTaskEditingState(true);
        
        return null;
    }    

    _updateTaskMessageOnKeyDown = (event) => {
        const { newMessage }  = this.state;
        
        //it's a test requirement but it breaks UI usability when user fully clear editing field and tries to cancel changes
        if( newMessage === '')
            return null;
            
        if (event.key === 'Enter')
            this._updateTask();
        else if (event.key === 'Escape')
            this._cancelUpdatingTaskMessage();
    }

    render () {
        const { completed, favorite }  = this.props;
        const { isTaskEditing, newMessage } = this.state;

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
                    <input
                        ref = { this.taskInput }
                        disabled = { !isTaskEditing }
                        type = "text"
                        value = { newMessage }
                        onChange = { this._updateNewTaskMessage }
                        onKeyDown = { this._updateTaskMessageOnKeyDown }                        
                    />
                </div>
                <div className = { Styles.actions }>
                    <Star
                        inlineBlock
                        checked = { favorite }
                        className = { Styles.toggleTaskFavoriteState }
                        onClick = { this._toggleTaskFavoriteState }
                    />
                    <Edit
                        inlineBlock
                        className = { Styles.updateTaskMessageOnClick }                        
                        onClick = { this._updateTaskMessageOnClick }
                        />
                    <Remove inlineBlock className = { Styles.removeTask } onClick = { this._removeTask } />
                </div>                
            </li>
        );
    }
}
