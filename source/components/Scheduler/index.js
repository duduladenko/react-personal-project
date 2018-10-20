// Core
import React, { Component } from 'react';

// Instruments
import Styles from './styles.m.css';
import { api } from '../../REST'; // ! Импорт модуля API должен иметь именно такой вид (import { api } from '../../REST')

// Components
import Task from '../Task';
import Checkbox from '../../theme/assets/Checkbox';
import { checkAllConfig } from '../../theme/assets/CheckboxConfig';

export default class Scheduler extends Component {
    state = {
        newTaskMessage: '',
        tasksFilter: '',
        isTasksFetching: false,
        tasks: [],
    };

    componentDidMount() {
        this._fetchTasksAsync();
    }

    _fetchTasksAsync = async () => {        
        try {
            const tasks = await api.fetchTasks();
            
            this.setState({ tasks });
        }
        catch (error) {
            console.log(error);
        }
    };

    _updateNewTaskMessage = (event) => {
        try {
            const { value: message } = event.target;

            this.setState({ newTaskMessage: message });
        }
        catch(error) {
            console.log(error);
        }
    };

    _createTaskOnEnter = (event) => {        
        if(event.key === 'Enter')
            this._createTaskAsync(event);
    };
    
    _handleFormSubmit = (event) => {        
        this._createTaskAsync(event);
    };

    _createTaskAsync = async (event) => {
        try {
            event.preventDefault();
            const { newTaskMessage } = this.state;
            
            if(!newTaskMessage)
                return;

            const newTask = await api.createTask(newTaskMessage); 

            this.setState((prevState) => ({
                newTaskMessage: '',
                tasks: [ newTask, ...prevState.tasks]
            }));
        } catch(error) {
            console.log(error);
        }
    };

    _removeTaskAsync = async (id) => {
        try {
            const success = await api.removeTask(id);

            this.setState((prevState) => ({
                tasks: prevState.tasks.filter(task => task.id != id)
            }));
        } catch (error){
            console.log(error);
        }
    };

    _updateTaskAsync = async (taskShape) => {
        try {
            const updatedTask = await api.updateTask(taskShape);

            this.setState((prevState) => ({
                tasks: prevState.tasks.map( task => task.id == updatedTask.id ? updatedTask : task)
            }));

        } catch(error) {
            console.log(error);
        }
    };

    render () {
        const { newTaskMessage, tasks } = this.state;

        const tasksJSX = tasks.map( (task) => (
            <Task
                key = { task.id }
                { ...task }
                _removeTaskAsync = { this._removeTaskAsync }
                _updateTaskAsync = { this._updateTaskAsync }
            />
        ));

        return (
            <section className = { Styles.scheduler }>
                <main>
                    <header>
                        <h1>Task sheduler</h1>
                        <input type="text" placeholder="Search" />
                    </header>
                    
                    <section>
                        <form onSubmit = { this._handleFormSubmit }>
                            <input
                                placeholder="Describe your new task"
                                type="text"
                                maxLength = "50"
                                value = { newTaskMessage }
                                onChange = { this._updateNewTaskMessage }
                                onKeyPress = { this._createTaskOnEnter } />
                            <button type="submit" >Add task</button>
                        </form>
                        <ul>
                            { tasksJSX }
                        </ul>
                    </section>
                    
                    <footer>
                        <Checkbox {...checkAllConfig} />
                        <span className = { Styles.completeAllTasks }>Complete all tasks</span>
                    </footer>
                </main>
            </section>
        );
    }
}
