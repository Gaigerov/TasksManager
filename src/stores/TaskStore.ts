import {makeAutoObservable, reaction, runInAction} from "mobx";
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
            () => this.tasks.slice(), // Используем slice для создания нового массива
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
        if (savedTasks) {
            runInAction(() => {
                this.tasks = JSON.parse(savedTasks);
            });
        }
    }

    // Действия
    createTask(task: Omit<TaskItem, "id" | "status">) {
        const newTask: TaskItem = {
            ...task,
            id: Date.now().toString(),
            status: "To Do",
        };
        // Создаем новый массив вместо мутации
        this.tasks = [...this.tasks, newTask];
    }

    updateTask(updatedTask: TaskItem) {
        const index = this.tasks.findIndex(t => t.id === updatedTask.id);
        if (index !== -1) {
            // Создаем новый массив вместо мутации
            const newTasks = [...this.tasks];
            newTasks[index] = {...this.tasks[index], ...updatedTask};
            this.tasks = newTasks;
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

    // Устанавливаем текущую задачу для редактирования
    setCurrentTask(task: TaskItem) {
        this.currentTask = task;
    }

    // Работа с модальным окном
    openModal() {
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
