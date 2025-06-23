import {makeAutoObservable, reaction, runInAction} from "mobx";
import {TaskItem, TaskStatus} from '../types/types';
import {VALID_MODE} from '../config/constant'

export default class TaskStore {
    tasks: TaskItem[] = [];
    currentTask: TaskItem | null = null;
    isModalOpen = false;
    navigate: ((path: string) => void) | null = null;
    searchQuery = "";

    constructor() {
        makeAutoObservable(this, {}, {autoBind: true});
        this.loadTasks();

        reaction(
            () => this.tasks.slice(),
            tasks => localStorage.setItem("tasks", JSON.stringify(tasks))
        );
    }

    setNavigate(navigate: (path: string) => void) {
        this.navigate = navigate;
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

        this.tasks = [...this.tasks, newTask];
    }

    updateTask(updatedTask: TaskItem) {
        const index = this.tasks.findIndex(t => t.id === updatedTask.id);
        if (index !== -1) {
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


    setCurrentTask(task: TaskItem | null) {
        this.currentTask = task;
    }

    // Работа с модальным окном
    openModal(mode: typeof VALID_MODE.CREATE | typeof VALID_MODE.EDIT, task?: TaskItem) {
        if (this.navigate) {
            if (mode === VALID_MODE.EDIT && task) {
                this.navigate(`/${VALID_MODE.EDIT}?id=${task.id}`);
            } else {
                this.navigate(`/${VALID_MODE.CREATE}`);
            }
        }
    }

    closeModal() {
        if (this.navigate) {
            this.navigate("/");
        }
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
