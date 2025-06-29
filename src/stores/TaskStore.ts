import {makeAutoObservable, reaction} from 'mobx';
import {TaskItem, TaskStatus} from '../types/types';
import {
    loadTasks,
    saveTasks,
    loadFilters,
    saveFilters
} from '../services/localStorageService';
import {createNewTask, getModalPath} from '../utils/taskUtils';
import {filterTasks} from '../utils/taskFilters';
import {ValidMode} from '../config/constant';

export default class TaskStore {
    tasks: TaskItem[] = [];
    currentTask: TaskItem | null = null;
    navigate: ((path: string) => void) | null = null;
    searchQuery = '';
    filters = {status: '', date: ''};

    constructor() {
        makeAutoObservable(this, {}, {autoBind: true});
        this.initStore();
    }

    private initStore() {
        this.tasks = loadTasks();
        this.filters = loadFilters();

        reaction(
            () => this.tasks.slice(),
            tasks => saveTasks(tasks)
        );

        reaction(
            () => [this.filters.status, this.filters.date],
            () => saveFilters(this.filters)
        );
    }

    createTask(task: Omit<TaskItem, 'id'>) {
        this.tasks = [...this.tasks, createNewTask(task)];
    }

    updateTask(updatedTask: TaskItem) {
        this.tasks = this.tasks.map(task =>
            task.id === updatedTask.id ? {...task, ...updatedTask} : task
        );
    }

    deleteTask(id: string) {
        this.tasks = this.tasks.filter(task => task.id !== id);
    }

    cloneTask(id: string) {
        const taskToClone = this.tasks.find(t => t.id === id);
        if (taskToClone) {
            this.createTask({
                ...taskToClone,
                title: `${taskToClone.title} (копия)`
            });
        }
    }

    get filteredTasks() {
        return filterTasks(
            this.tasks,
            this.searchQuery,
            this.filters.status,
            this.filters.date
        );
    }

    setSearchQuery = (query: string) => {
        this.searchQuery = query;
    };

    setNavigate(navigate: (path: string) => void) {
        this.navigate = navigate;
    }

    setCurrentTask(task: TaskItem | null) {
        this.currentTask = task;
    }

    setFilters(filters: {status: string; date: string}) {
        this.filters = filters;
    }

    resetFilters() {
        this.filters = {status: '', date: ''};
    }

    openModal(
        mode: ValidMode,
        task?: TaskItem
    ) {
        this.setCurrentTask(task || null);
        const path = getModalPath(mode, task);
        if (path && this.navigate) this.navigate(path);
    }

    closeModal() {
        this.setCurrentTask(null);
        if (this.navigate) this.navigate('/');
    }

    submitTask(task: TaskItem) {
        task.id ? this.updateTask(task) : this.createTask(task);
        this.closeModal();
    }

    changeTaskStatus(taskId: string, newStatus: TaskStatus) {
        this.updateTask({
            ...this.tasks.find(t => t.id === taskId)!,
            status: newStatus
        });
    }
}
