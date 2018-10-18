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
    render () {
        return (
            <section className = { Styles.scheduler }>
                <main>
                    <header>
                        <h1>Task sheduler</h1>
                        <input type="text" placeholder="Search" />
                    </header>
                    
                    <section>
                        <form>
                            <input placeholder="Describe your new task"  type="text" />
                            <button>Add task</button>
                        </form>
                        <ul>
                            <Task />
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
