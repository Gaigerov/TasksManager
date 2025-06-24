import { useState, useEffect, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate, useLocation } from 'react-router-dom';
import { TaskItem } from '../../types/types';
import styles from './TaskModal.module.css';
import ModalHeader from './ModalHeader/ModalHeader';
import ModalBody from './ModalBody/ModalBody';
import TaskViewModalBody from '../TaskViewModalBody/TaskViewModalBody';
import ModalFooter from './ModalFooter/ModalFooter';
import { useTaskStore } from '../../stores/storeContext';
import { validateTask, TaskValidationErrors } from '../../utils/taskValidation';
import { VALID_MODE } from '../../config/constant';

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
    const searchParams = new URLSearchParams(location.search);
    const [task, setTask] = useState<TaskItem>(emptyTask);
    const [errors, setErrors] = useState<TaskValidationErrors>(initialErrors);
    const taskId = searchParams.get('id');

    const mode = location.pathname.substring(1);
    const isOpen = mode === VALID_MODE.CREATE || mode === VALID_MODE.EDIT || mode === VALID_MODE.VIEW;
    const isViewMode = mode === VALID_MODE.VIEW;

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

        taskStore.submitTask(task);
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
        // Создаем копию задачи без ID
        const { id, ...clonedTask } = task;
        taskStore.setCurrentTask(clonedTask as TaskItem);
        navigate('/create');
    }, [task, taskStore, navigate]);

    const handleDelete = useCallback(() => {
        if (task.id) {
            taskStore.deleteTask(task.id);
            taskStore.closeModal();
        }
    }, [task.id, taskStore]);

    // Конфигурация кнопок для режима просмотра
    const viewModeButtons = [
        { label: 'Edit', variant: 'warning' as const, onClick: handleEdit },
        { label: 'Copy', variant: 'primary' as const, onClick: handleClone },
        { label: 'Del', variant: 'danger' as const, onClick: handleDelete },
        { label: 'Cancel', variant: 'secondary' as const, onClick: handleClose }
    ];

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={handleClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.modalContent}>
                    <ModalHeader
                        title={
                            isViewMode ? task.title :
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
                    ) : (
                        <>
                            <ModalBody
                                task={task}
                                errors={errors}
                                onChange={handleChange}
                            />
                            <ModalFooter
                                submitLabel={isNewTask ? "Создать" : "Сохранить"}
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
