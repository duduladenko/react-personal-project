// Core
import React, { Component } from 'react';

// Instruments
import Styles from './styles.m.css';
import { api } from '../../REST'; // ! Импорт модуля API должен иметь именно такой вид (import { api } from '../../REST')

// Components
import Spinner from '../Spinner';
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
            this._setTasksFetchingState(true);
            const tasks = await api.fetchTasks();
            
            this.setState({ tasks });
        }
        catch (error) {
            console.log(error);
        } finally {
            this._setTasksFetchingState(false);
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

    _getAllCompleted = () => {
        const { tasks } = this.state;

        return tasks.filter(task => !task.completed).length === 0;
    };

    _createTaskOnEnter = (event) => {        
        if(event.key === 'Enter')
            this._createTaskAsync(event);
    };
    
    _handleFormSubmit = (event) => {        
        this._createTaskAsync(event);
    };

    _setTasksFetchingState = (state) => {
        this.setState({ isTasksFetching: state });
     };

    _createTaskAsync = async (event) => {
        try {
            event.preventDefault();
            const { newTaskMessage } = this.state;
            
            if(!newTaskMessage)
                return null;

            this._setTasksFetchingState(true);
            const newTask = await api.createTask(newTaskMessage); 

            this.setState((prevState) => ({
                newTaskMessage: '',
                tasks: [ newTask, ...prevState.tasks]
            }));
        } catch(error) {
            console.log(error);
        } finally {
            this._setTasksFetchingState(false);
        }
    };

    _removeTaskAsync = async (id) => {
        try {
            this._setTasksFetchingState(true);
            await api.removeTask(id);

            this.setState((prevState) => ({
                tasks: prevState.tasks.filter(task => task.id != id)
            }));
        } catch (error){
            console.log(error);
            this._setTasksFetchingState(false);
        } finally {
            this._setTasksFetchingState(false);
        }
    };

    _updateTaskAsync = async (taskShape) => {
        try {
            this._setTasksFetchingState(true);
            const updatedTask = await api.updateTask(taskShape);

            this.setState((prevState) => ({
                tasks: prevState.tasks.map( task => task.id == updatedTask.id ? updatedTask : task)
            }));

        } catch(error) {
            console.log(error);
        } finally {
            this._setTasksFetchingState(false);
        }
    };

    _completeAllTasksAsync = async () => {
        try {
            const { tasks } = this.state;
            const uncompletedTaskShapes = tasks.filter(task => !task.completed)
                .map(task => ({ id: task.id, completed: true, favorite: task.favorite, message: task.message}));

            if (uncompletedTaskShapes.length === 0) 
                return null;

            this._setTasksFetchingState(true);
            await api.completeAllTasks(uncompletedTaskShapes);

            this.setState((prevState) => ({
                tasks: prevState.tasks.map(task => { task.completed = true; return task})
            }));
        } catch(error) {
            console.log(error);
        } finally {
            this._setTasksFetchingState(false);
        }
    };

    render () {
        const { isTasksFetching, newTaskMessage, tasks } = this.state;

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
                    <Spinner isSpinning = { isTasksFetching } />
                    <header>
                        <h1>Task sheduler</h1>
                        <input type="text" placeholder="Search" />
                    </header>
                    
                    <section>
                        <form onSubmit = { this._handleFormSubmit }>
                            <input
                                placeholder = "Describe your new task"
                                type = "text"
                                maxLength = { 50 }
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
                        <Checkbox
                            checked = { this._getAllCompleted() }
                            {...checkAllConfig}
                            onClick = { this._completeAllTasksAsync } />
                        <span className = { Styles.completeAllTasks }>Complete all tasks</span>
                    </footer>
                </main>
            </section>
        );
    }
}
