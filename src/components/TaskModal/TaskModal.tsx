import React, {useState, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {TaskItem, TaskStatus} from '../../types/types';
import styles from './TaskModal.module.css';
import ModalBody from './ModalBody/ModalBody';
import ModalHeader from './ModalHeader/ModalHeader';
import ModalFooter from './ModalFooter/ModalFooter';
import {useTaskStore} from '../../stores/storeContext'; 
import {validateTask} from '../../utils/taskValidation';

// Создаем пустой объект задачи для инициализации
const emptyTask: TaskItem = {
    id: '',
    title: '',
    description: '',
    time: '',
    date: '',
    status: 'To Do' as TaskStatus,
};

const TaskModal: React.FC = observer(() => {
    const taskStore = useTaskStore();
    const [task, setTask] = useState<TaskItem>(emptyTask);
    const [errors, setErrors] = useState<string[]>([]);

    const isOpen = taskStore.isModalOpen;

    useEffect(() => {
        if (taskStore.currentTask) {
            setTask(taskStore.currentTask);
        } else {
            setTask({...emptyTask});
        }
        setErrors([]);
    }, [taskStore.currentTask, taskStore.isModalOpen]);

    const handleChange = (field: keyof TaskItem, value: string) => {
        setTask(prev => ({...prev, [field]: value}));

        if (errors.length > 0) {
            setErrors(prev => prev.filter(error =>
                !error.includes('Название') &&
                !error.includes('дату') &&
                !error.includes('время')
            ));
        }
    };

    const handleSubmit = () => {
        const validationErrors = validateTask(task);

        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }
        taskStore.submitTask(task);
    };

    const isNewTask = !task.id;

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={taskStore.closeModal}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.modalContent}>
                    <ModalHeader
                        title={isNewTask ? "Создать задачу" : "Редактировать задачу"}
                    />

                    <ModalBody
                        task={task}
                        errors={errors}
                        onChange={handleChange}
                    />

                    <ModalFooter
                        submitLabel={isNewTask ? "Создать" : "Сохранить"}
                        onSubmit={handleSubmit}
                        onClose={() => taskStore.closeModal}
                    />
                </div>
            </div>
        </div>
    );
});

export default TaskModal;
