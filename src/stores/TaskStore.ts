import {makeAutoObservable, reaction} from "mobx";
import {TaskItem, TaskStatus} from '../types/types';

export default class TaskStore {
    tasks: TaskItem[] = [];
    currentTask: TaskItem | null = null;
    isModalOpen = false;
    searchQuery = "";

    constructor() {
        makeAutoObservable(this, {}, {autoBind: true});
        this.loadTasks();

        reaction(
            () => this.tasks.slice(),
            tasks => localStorage.setItem("tasks", JSON.stringify(tasks))
        );
    }

    setSearchQuery = (query: string) => {
        this.searchQuery = query;
    };

    get filteredTasks() {
        const query = this.searchQuery.toLowerCase();
        if (!query.trim()) return this.tasks;

        return this.tasks.filter(task =>
            task.title.toLowerCase().includes(query) ||
            (task.description && task.description.toLowerCase().includes(query))
        );
    }

    loadTasks() {
        const savedTasks = localStorage.getItem("tasks");
        this.tasks = savedTasks ? JSON.parse(savedTasks) : [];
    }

    // Действия
    createTask(task: Omit<TaskItem, "id" | "status">) {
        const newTask: TaskItem = {
            ...task,
            id: Date.now().toString(),
            status: "To Do",
        };
        this.tasks.push(newTask);
    }

    updateTask(updatedTask: TaskItem) {
        const index = this.tasks.findIndex(t => t.id === updatedTask.id);
        if (index !== -1) {
            this.tasks[index] = {...this.tasks[index], ...updatedTask};
        }
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

    changeTaskStatus(taskId: string, newStatus: TaskStatus) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            this.updateTask({...task, status: newStatus});
        }
    }

    // Работа с модальным окном
    openModal(task?: TaskItem) {
        this.currentTask = task || null;
        this.isModalOpen = true;
    }

    closeModal() {
        this.isModalOpen = false;
        this.currentTask = null;
    }

    submitTask(task: TaskItem) {
        if (task.id) {
            this.updateTask(task);
        } else {
            const {id, status, ...rest} = task;
            this.createTask(rest);
        }
        this.closeModal();
    }
}
