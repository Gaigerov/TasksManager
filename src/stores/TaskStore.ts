import {makeAutoObservable, reaction, runInAction} from "mobx";
import {TaskItem, TaskStatus} from '../types/types';
import {VALID_MODE} from '../config/constant'

export default class TaskStore {
    tasks: TaskItem[] = [];
    currentTask: TaskItem | null = null;
    isModalOpen = false;
    navigate: ((path: string) => void) | null = null;
    searchQuery = "";
    filters = {
        status: '',
        date: ''
    };

    constructor() {
        makeAutoObservable(this, {}, {autoBind: true});
        this.loadTasks();
        this.loadFilters();

        reaction(
            () => this.tasks.slice(),
            tasks => localStorage.setItem("tasks", JSON.stringify(tasks))
        );
        reaction(
            () => [this.filters.status, this.filters.date],
            () => this.saveFilters()
        );
    }

    private saveFilters() {
        localStorage.setItem("taskFilters", JSON.stringify(this.filters));
    }

    private loadFilters() {
        const savedFilters = localStorage.getItem("taskFilters");
        if (savedFilters) {
            runInAction(() => {
                this.filters = JSON.parse(savedFilters);
            });
        }
    }

    setNavigate(navigate: (path: string) => void) {
        this.navigate = navigate;
    }

    setSearchQuery = (query: string) => {
        this.searchQuery = query;
    };

    loadTasks() {
        const savedTasks = localStorage.getItem("tasks");
        if (savedTasks) {
            runInAction(() => {
                this.tasks = JSON.parse(savedTasks);
            });
        }
    }

    // Действия
    createTask(task: Omit<TaskItem, "id">) {
        const newTask: TaskItem = {
            ...task,
            id: Date.now().toString(),
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
                title: `${taskToClone.title} (копия)`,
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
    openModal(
        mode: typeof VALID_MODE.VIEW |
            typeof VALID_MODE.CREATE |
            typeof VALID_MODE.EDIT |
            typeof VALID_MODE.FILTER,
        task?: TaskItem
    ) {
        this.setCurrentTask(task || null);
        if (this.navigate) {
            if (mode === VALID_MODE.VIEW && task) {
                this.navigate(`/${VALID_MODE.VIEW}?id=${task.id}`);
            } else if (mode === VALID_MODE.EDIT && task) {
                this.navigate(`/${VALID_MODE.EDIT}?id=${task.id}`);
            } else if (mode === VALID_MODE.FILTER) {
                this.navigate(`/${VALID_MODE.FILTER}`);
            } else {
                this.navigate(`/${VALID_MODE.CREATE}`);
            }
        }
    }

    closeModal() {
        this.setCurrentTask(null);
        if (this.navigate) {
            this.navigate("/");
        }
    }

    setFilters(filters: {status: string; date: string}) {
        this.filters = filters;
    }

    resetFilters() {
        this.filters = {status: '', date: ''};
    }

    get filteredTasks() {
        const query = this.searchQuery.toLowerCase().trim();
        const statusFilter = this.filters.status;
        const dateFilter = this.filters.date;

        return this.tasks.filter(task => {
            const matchesSearch = query
                ? task.title.toLowerCase().includes(query) ||
                (task.description?.toLowerCase().includes(query) ?? false)
                : true;
            const matchesStatus = statusFilter
                ? task.status === statusFilter
                : true;
            const matchesDate = dateFilter
                ? task.date === dateFilter
                : true;

            return matchesSearch && matchesStatus && matchesDate;
        });
    }

    submitTask(task: TaskItem) {
        if (task.id) {
            this.updateTask(task);
        } else {
            const {id, ...rest} = task;
            this.createTask(rest);
        }
        this.closeModal();
    }
}
