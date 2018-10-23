// Core
import React, { Component } from 'react';
import FlipMove from 'react-flip-move';

// Instruments
import Styles from './styles.m.css';
import { api } from '../../REST'; // ! An import of an API module should be exactly like this (import { api } from '../../REST')

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
        const { value: message } = event.target;

        this.setState({ newTaskMessage: message });
    };

    _getAllCompleted = () => {
        const { tasks } = this.state;

        return tasks.filter(task => !task.completed).length === 0;
    };

    _createTaskOnEnter = (event) => {        
        if(event.key === 'Enter')
            this._createTaskAsync(event);
    };
    
    _setTasksFetchingState = (state) => {
        this.setState({ isTasksFetching: state });
     };

    _updateTasksFilter = (event) => {
        const { value: tasksFilter } = event.target;

        this.setState({ tasksFilter: tasksFilter.toLocaleLowerCase() });
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

    _tasksSorting = (a, b) => {
        if(a.completed && !b.completed)
            return 1;

        if(!a.completed && b.completed)
            return -1;

        if(a.favorite && !b.favorite)
            return -1;

        if(!a.favorite && b.favorite)
            return 1;

        return 0;
    };

    render () {
        const { isTasksFetching, tasksFilter, newTaskMessage, tasks } = this.state;

        const tasksJSX =  tasks
            .filter(task => !task.message.toLocaleLowerCase().search(tasksFilter))
            .sort(this._tasksSorting)
            .map(task => (
                <Task 
                    key = { task.id }
                    { ...task }
                    _removeTaskAsync = { this._removeTaskAsync }
                    _updateTaskAsync = { this._updateTaskAsync }
                />
        ));

        return (
            <section className = { Styles.scheduler }>
                <Spinner isSpinning = { isTasksFetching } />
                <main>
                    <header>
                        <h1>Task sheduler</h1>
                        <input
                            onChange = { this._updateTasksFilter }
                            placeholder = "Search" 
                            type = "search"
                            value = { tasksFilter }
                        />
                    </header>
                    
                    <section>
                        <form onSubmit = { this._createTaskAsync }>
                            <input
                                className = { Styles.createTask }
                                placeholder = "Describe your new task"
                                type = "text"
                                maxLength = { 50 }
                                value = { newTaskMessage }
                                onChange = { this._updateNewTaskMessage }
                                onKeyPress = { this._createTaskOnEnter } />
                            <button>Add task</button>
                        </form>
                        <div className = { Styles.overlay }>
                            <ul>
                                <FlipMove duration = {400}>
                                    { tasksJSX }
                                </FlipMove>
                            </ul>
                        </div>
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
