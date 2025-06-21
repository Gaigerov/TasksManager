import {makeAutoObservable, reaction} from "mobx";
import {TaskItem, TaskStatus} from '../types/types';

export default class TaskStore {
    tasks: TaskItem[] = [];
    currentTask: TaskItem | null = null;
    isModalOpen = false;

    constructor() {
        makeAutoObservable(this, {}, {autoBind: true});
        this.loadTasks();

        reaction(
            () => this.tasks.slice(), // Создаем копию массива для отслеживания изменений
            tasks => localStorage.setItem("tasks", JSON.stringify(tasks))
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
            // Создаем новый объект задачи вместо изменения существующего
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
            // Используем updateTask для гарантированного сохранения изменений
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
