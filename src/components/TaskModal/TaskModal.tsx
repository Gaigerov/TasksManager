import {useState, useEffect, useCallback} from 'react';
import {observer} from 'mobx-react-lite';
import {useNavigate, useLocation} from 'react-router-dom';
import {TaskItem} from '../../types/types';
import styles from './TaskModal.module.css';
import ModalHeader from './ModalHeader/ModalHeader';
import ModalBody from './ModalBody/ModalBody';
import TaskViewModalBody from '../TaskViewModalBody/TaskViewModalBody';
import ModalFooter from './ModalFooter/ModalFooter';
import {useTaskStore} from '../../stores/storeContext';
import {validateTask, TaskValidationErrors} from '../../utils/taskValidation';
import {VALID_MODE} from '../../config/constant';
import TaskFilterModalBody from '../TaskFilterModalBody/TaskFilterModalBody';
import {useNotification} from '../Notification/NotificationContext';
import Cookies from 'js-cookie'; // Добавлен импорт Cookies

const emptyTask: TaskItem = {
    id: '',
    title: '',
    description: '',
    time: '',
    date: '',
    status: 'To Do',
};

const initialErrors: TaskValidationErrors = {
    title: [],
    description: [],
    date: [],
    time: [],
};

const TaskModal: React.FC = observer(() => {
    const navigate = useNavigate();
    const location = useLocation();
    const taskStore = useTaskStore();
    const showNotification = useNotification();
    const searchParams = new URLSearchParams(location.search);
    const [task, setTask] = useState<TaskItem>(emptyTask);
    const [errors, setErrors] = useState<TaskValidationErrors>(initialErrors);
    const taskId = searchParams.get('id');
    const [filterStatus, setFilterStatus] = useState(taskStore.filters.status);
    const [filterDate, setFilterDate] = useState(taskStore.filters.date);
    const user = Cookies.get('user') || ''; // Получаем текущего пользователя

    const mode = location.pathname.substring(1);
    const isOpen = mode === VALID_MODE.CREATE || mode === VALID_MODE.EDIT || mode === VALID_MODE.VIEW || mode === VALID_MODE.FILTER;
    const isViewMode = mode === VALID_MODE.VIEW;
    const isFilterMode = mode === VALID_MODE.FILTER;

    const handleStatusChange = (status: string) => setFilterStatus(status);
    const handleDateChange = (date: string) => setFilterDate(date);

    // Обработчики кнопок фильтрации
    const handleApplyFilters = () => {
        taskStore.setFilters({
            status: filterStatus,
            date: filterDate
        });
        taskStore.closeModal();
    };

    const handleResetFilters = () => {
        setFilterStatus('');
        setFilterDate('');
        taskStore.resetFilters();
        showNotification('Фильтры сброшены', 'info');
    };

    useEffect(() => {
        if (isOpen) {
            if (taskId && !taskStore.currentTask) {
                const foundTask = taskStore.tasks.find(t => t.id === taskId);
                if (foundTask) taskStore.setCurrentTask(foundTask);
            }
            if (taskStore.currentTask) {
                setTask(taskStore.currentTask);
            } else {
                setTask({...emptyTask});
            }
            setErrors(initialErrors);
        }
    }, [isOpen, taskStore.currentTask, taskId, taskStore]);

    const handleChange = (field: keyof TaskItem, value: string) => {
        setTask(prev => ({...prev, [field]: value}));
        setErrors(prev => ({
            ...prev,
            [field]: []
        }));
    };

    const handleSubmit = () => {
        const validationErrors = validateTask(task);
        const hasErrors = Object.values(validationErrors).some(
            fieldErrors => fieldErrors.length > 0
        );

        if (hasErrors) {
            setErrors(validationErrors);
            return;
        }

        // Передаем пользователя в submitTask
        taskStore.submitTask(task, user);
        taskStore.closeModal();
    };

    const isNewTask = !task.id;

    const handleClose = useCallback(() => {
        taskStore.closeModal();
    }, [taskStore]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, handleClose]);

    // Обработчики для кнопок в режиме просмотра
    const handleEdit = useCallback(() => {
        navigate(`/edit?id=${task.id}`);
    }, [task.id, navigate]);

    const handleClone = useCallback(() => {
        const {id, ...clonedTask} = task;

        const newTask: TaskItem = {
            ...clonedTask,
            id: Date.now().toString(),
            title: `${task.title} (copy)`
        };

        // Передаем пользователя в createTask
        taskStore.createTask({
            title: newTask.title,
            description: newTask.description,
            time: newTask.time,
            date: newTask.date,
            status: newTask.status
        }, user);

        taskStore.closeModal();
    }, [task, taskStore, user]);

    const handleDelete = useCallback(() => {
        if (task.id) {
            // Передаем пользователя в deleteTask
            taskStore.deleteTask(task.id, user);
            taskStore.closeModal();
        }
    }, [task.id, taskStore, user]);

    // Конфигурация кнопок для режима просмотра
    const viewModeButtons = [
        {label: 'Edit', variant: 'warning' as const, onClick: handleEdit},
        {label: 'Copy', variant: 'primary' as const, onClick: handleClone},
        {label: 'Del', variant: 'danger' as const, onClick: handleDelete},
        {label: 'Cancel', variant: 'secondary' as const, onClick: handleClose}
    ];
    // Конфигурация кнопок для режима фильтрации
    const filterModeButtons = [
        {label: 'Filter', variant: 'warning' as const, onClick: handleApplyFilters},
        {label: 'Reset', variant: 'danger' as const, onClick: handleResetFilters},
        {label: 'Cancel', variant: 'secondary' as const, onClick: handleClose}
    ];

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={handleClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.modalContent}>
                    <ModalHeader
                        title={
                            isViewMode ? task.title :
                                isFilterMode ? "Фильтр задач" :
                                    isNewTask ? "Создать задачу" :
                                        "Редактировать задачу"
                        }
                    />
                    {isViewMode ? (
                        <>
                            <TaskViewModalBody
                                taskId={task.id}
                                onClose={handleClose}
                            />
                            <ModalFooter
                                isViewMode={true}
                                viewModeButtons={viewModeButtons}
                            />
                        </>
                    ) :
                        isFilterMode ? (
                            <>
                                <TaskFilterModalBody
                                    selectedStatus={filterStatus}
                                    selectedDate={filterDate}
                                    onStatusChange={handleStatusChange}
                                    onDateChange={handleDateChange}
                                    onClearAll={handleResetFilters}
                                />
                                <ModalFooter
                                    isFilterMode={true}
                                    filterModeButtons={filterModeButtons}
                                />
                            </>
                        ) :
                            (
                                <>
                                    <ModalBody
                                        task={task}
                                        errors={errors}
                                        onChange={handleChange}
                                    />
                                    <ModalFooter
                                        submitLabel={isNewTask ? "Create" : "Save"}
                                        onSubmit={handleSubmit}
                                        submitDisabled={Object.values(errors).some(err => err.length > 0)}
                                    />
                                </>
                            )}
                </div>
            </div>
        </div>
    );
});

export default TaskModal;
