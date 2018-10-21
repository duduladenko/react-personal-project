import { MAIN_URL, TOKEN } from './config';

export const api = {

      fetchTasks: async () => {
        const response = await fetch(MAIN_URL, {
            method: 'GET',
            headers: {
                authorization: TOKEN
            },
        });

        if(response.status !== 200)
            throw new Error('Tasks fetching has been failed.');
        
        const { data: tasks } = await response.json();

        return tasks;
    },

    createTask: async (message) => {
        const response = await fetch(MAIN_URL, {
            method: 'POST',
            headers: {
                authorization: TOKEN,
                'content-type': 'application/json',
            },
            body: JSON.stringify({ message }),
        });

        if(response.status !== 200)
            throw new Error('Task hasn\'t been created');

         const { data: task } = await response.json();

        return task;
    },

    async removeTask(id) {
        const response = await fetch(`${MAIN_URL}/${id}`, {
            method: 'DELETE',
            headers: {
                authorization: TOKEN
            },
        });

        if(response.status !== 204)
            throw new Error('Task hasn\'t been deleted');

        return true;
    },

    async updateTask(taskShape) {
        const response = await fetch(MAIN_URL, {
            method: 'PUT',
            headers: {
                authorization: TOKEN,
                'content-type': 'application/json',
            },
            body: JSON.stringify([taskShape]),
        });

        if(response.status !== 200)
            throw new Error('Task hasn\'t been updated');

        const { data: tasks } = await response.json();

        return tasks[0];
    },

    async completeAllTasks(taskShapes) {
        const response = await fetch(MAIN_URL, {
            method: 'PUT',
            headers: {
                authorization: TOKEN,
                'content-type': 'application/json',
            },
            body: JSON.stringify(taskShapes),
        });

        if(response.status !== 200)
            throw new Error('Tasks haven\'t been updated');

        const { data: tasks } = await response.json();

        return tasks;
    }
};