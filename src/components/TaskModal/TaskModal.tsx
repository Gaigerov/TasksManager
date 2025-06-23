import {useState, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {TaskItem} from '../../types/types';
import styles from './TaskModal.module.css';
import ModalHeader from './ModalHeader/ModalHeader';
import ModalBody from './ModalBody/ModalBody';
import TaskViewModalBody from '../TaskViewModalBody/TaskViewModalBody';
import ModalFooter from './ModalFooter/ModalFooter';
import {useTaskStore} from '../../stores/storeContext';
import {validateTask, TaskValidationErrors} from '../../utils/taskValidation';
import {useLocation} from 'react-router-dom';
import {VALID_MODE} from '../../config/constant';

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
    const taskStore = useTaskStore();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const [task, setTask] = useState<TaskItem>(emptyTask);
    const [errors, setErrors] = useState<TaskValidationErrors>(initialErrors);
    const taskId = searchParams.get('id');

    // Получаем режим из пути
    const mode = location.pathname.substring(1);
    const isOpen = mode === VALID_MODE.CREATE || mode === VALID_MODE.EDIT || mode === VALID_MODE.VIEW;
    const isViewMode = mode === VALID_MODE.VIEW;
    // const isEditMode = mode === VALID_MODE.EDIT;
    // const isCreateMode = mode === VALID_MODE.CREATE;

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

    const handleClose = () => {
        taskStore.closeModal();
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={handleClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.modalContent}>
                    <ModalHeader
                        title={
                            isViewMode ? task.title :
                                isNewTask ? "Создать задачу" :
                                    "Редактировать задачу:"
                        }
                    />

                    {isViewMode ? (
                        <TaskViewModalBody
                            taskId={task.id}
                            onClose={handleClose}
                        />
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
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
});

export default TaskModal;
