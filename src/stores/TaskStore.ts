import { makeAutoObservable, runInAction } from "mobx";
import { TaskItem, TaskStatus } from '../types/types';
import { VALID_MODE } from '../config/constant';
import Cookies from 'js-cookie';
import { NotificationContextType } from '../components/Notification/NotificationContext';
import { v4 as uuidv4 } from 'uuid';

interface StorageData {
    data: {
        tasks: TaskItem[];
    };
    storageName: string;
    id: string;
}

// Ключ для хранения storageId в localStorage
const STORAGE_ID_KEY = "taskStorageId";

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
    isLoading = false;
    showNotification: NotificationContextType;
    storageId: string | null = null; // Добавляем поле для хранения ID хранилища

    constructor(showNotification: NotificationContextType) {
        this.showNotification = showNotification;
        makeAutoObservable(this, {}, { autoBind: true });
        this.loadFilters();
        this.loadStorageId(); // Загружаем storageId при инициализации
    }

    // Сохраняем ID хранилища в localStorage
    private saveStorageId() {
        if (this.storageId) {
            localStorage.setItem(STORAGE_ID_KEY, this.storageId);
        }
    }

    // Загружаем ID хранилища из localStorage
    private loadStorageId() {
        const savedStorageId = localStorage.getItem(STORAGE_ID_KEY);
        if (savedStorageId) {
            this.storageId = savedStorageId;
        }
    }

    // Очищаем ID хранилища
    private clearStorageId() {
        localStorage.removeItem(STORAGE_ID_KEY);
        this.storageId = null;
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

    // Очищаем все данные при выходе
    clearAllData() {
        this.tasks = [];
        this.currentTask = null;
        this.clearStorageId();
        this.resetFilters();
    }

    setNavigate(navigate: (path: string) => void) {
        this.navigate = navigate;
    }

    setSearchQuery = (query: string) => {
        this.searchQuery = query;
    };

    async initializeTasks(user: string) {
        try {
            runInAction(() => {
                this.isLoading = true;
            });

            const authToken = this.getAuthToken();
            let storage: StorageData;
            
            // Если у нас есть сохраненный storageId, пробуем загрузить по нему
            if (this.storageId) {
                try {
                    storage = await this.getStorageById(authToken, this.storageId);
                    // Проверяем, что хранилище принадлежит текущему пользователю
                    if (storage.storageName !== `tasks_${user}`) {
                        throw new Error("Storage does not belong to current user");
                    }
                } catch (error) {
                    console.warn("Failed to load storage by ID, creating new", error);
                    this.clearStorageId();
                    storage = await this.findOrCreateUserStorage(authToken, user);
                    this.storageId = storage.id;
                    this.saveStorageId();
                }
            } else {
                // Если storageId нет, создаем новое хранилище
                storage = await this.findOrCreateUserStorage(authToken, user);
                this.storageId = storage.id;
                this.saveStorageId();
            }

            runInAction(() => {
                this.tasks = storage.data?.tasks || [];
                this.isLoading = false;
            });

        } catch (error) {
            runInAction(() => {
                this.isLoading = false;
            });
            const message = error instanceof Error ? error.message : 'Неизвестная ошибка';
            this.showNotification(`Ошибка загрузки задач: ${message}`, 'error');
            console.error("Initialize tasks error:", error);
        }
    }

    private async getStorageById(authToken: string, storageId: string): Promise<StorageData> {
        const response = await fetch(`https://simple-storage.vigdorov.ru/storages/${storageId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authToken
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Ошибка получения хранилища: ${response.statusText} - ${errorText}`);
        }

        return await response.json();
    }

    private async findOrCreateUserStorage(authToken: string, user: string): Promise<StorageData> {
        const storageName = `tasks_${user}`;
        
        // Проверяем существование хранилища
        const response = await fetch('https://simple-storage.vigdorov.ru/storages', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authToken
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Ошибка получения хранилищ: ${response.statusText} - ${errorText}`);
        }

        const storages: StorageData[] = await response.json();
        const userStorage = storages.find(s => s.storageName === storageName);

        if (userStorage) return userStorage;

        // Создаем новое хранилище если не найдено
        const createResponse = await fetch('https://simple-storage.vigdorov.ru/storages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authToken
            },
            body: JSON.stringify({
                storageName: storageName,
                data: { tasks: [] }
            })
        });

        if (!createResponse.ok) {
            const errorText = await createResponse.text();
            throw new Error(`Ошибка создания хранилища: ${createResponse.statusText} - ${errorText}`);
        }

        return await createResponse.json();
    }

    private async saveTasksToServer(user: string) {
        if (!this.storageId) throw new Error("Storage ID not found");

        const authToken = this.getAuthToken();
        const storageName = `tasks_${user}`;

        const requestData = {
            data: {
                tasks: this.tasks
            },
            storageName: storageName,
            id: this.storageId
        };

        const response = await fetch(`https://simple-storage.vigdorov.ru/storages/${this.storageId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authToken
            },
            body: JSON.stringify(requestData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Ошибка сохранения: ${response.statusText} - ${errorText}`);
        }
    }

    private getAuthToken(): string {
        const token = Cookies.get('authToken');
        if (!token) throw new Error("Необходима авторизация");
        return token;
    }

    async createTask(task: Omit<TaskItem, "id">, user: string) {
        const newTask: TaskItem = {
            ...task,
            id: uuidv4(),
        };
        const originalTasks = [...this.tasks];
        try {
            runInAction(() => {
                this.tasks = [...this.tasks, newTask];
            });
            await this.saveTasksToServer(user);
            this.showNotification(`Задача "${newTask.title}" создана`, 'success');
        } catch (error) {
            runInAction(() => {
                this.tasks = originalTasks;
            });
            const message = error instanceof Error ? error.message : 'Неизвестная ошибка';
            this.showNotification(`Ошибка создания задачи: ${message}`, 'error');
        }
    }

    async updateTask(updatedTask: TaskItem, user: string) {
        const originalTasks = [...this.tasks];
        try {
            runInAction(() => {
                this.tasks = this.tasks.map(task =>
                    task.id === updatedTask.id ? updatedTask : task
                );
            });
            await this.saveTasksToServer(user);
            this.showNotification(`Задача "${updatedTask.title}" обновлена`, 'success');
        } catch (error) {
            runInAction(() => {
                this.tasks = originalTasks;
            });
            const message = error instanceof Error ? error.message : 'Неизвестная ошибка';
            this.showNotification(`Ошибка обновления задачи: ${message}`, 'error');
        }
    }

    async deleteTask(id: string, user: string) {
        const task = this.tasks.find(t => t.id === id);
        const originalTasks = [...this.tasks];
        try {
            runInAction(() => {
                this.tasks = this.tasks.filter(task => task.id !== id);
            });
            await this.saveTasksToServer(user);
            if (task) {
                this.showNotification(`Задача "${task.title}" удалена`, 'success');
            }
        } catch (error) {
            runInAction(() => {
                this.tasks = originalTasks;
            });
            const message = error instanceof Error ? error.message : 'Неизвестная ошибка';
            this.showNotification(`Ошибка удаления задачи: ${message}`, 'error');
        }
    }

    async cloneTask(id: string, user: string) {
        const taskToClone = this.tasks.find(t => t.id === id);
        if (taskToClone) {
            await this.createTask({
                ...taskToClone,
                title: `${taskToClone.title} (копия)`,
            }, user);
        }
    }

    changeTaskStatus(taskId: string, newStatus: TaskStatus, user: string) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            this.updateTask({...task, status: newStatus}, user);
        }
    }

    setCurrentTask(task: TaskItem | null) {
        this.currentTask = task;
    }

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
        this.saveFilters();
    }

    resetFilters() {
        this.filters = {status: '', date: ''};
        this.saveFilters();
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

    submitTask(task: TaskItem, user: string) {
        if (task.id) {
            this.updateTask(task, user);
        } else {
            const {id, ...rest} = task;
            this.createTask(rest, user);
        }
        this.closeModal();
    }
}
