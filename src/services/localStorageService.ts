import {TaskItem} from '../types/types';

export const loadTasks = (): TaskItem[] => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
};

export const saveTasks = (tasks: TaskItem[]) => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

export const loadFilters = (): {status: string; date: string} => {
    const savedFilters = localStorage.getItem('taskFilters');
    return savedFilters ? JSON.parse(savedFilters) : {status: '', date: ''};
};

export const saveFilters = (filters: {status: string; date: string}) => {
    localStorage.setItem('taskFilters', JSON.stringify(filters));
};
