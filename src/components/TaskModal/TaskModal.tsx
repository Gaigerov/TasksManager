import React, {useState, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {TaskItem, TaskStatus} from '../../types/types';
import styles from './TaskModal.module.css';
import ModalBody from './ModalBody/ModalBody';
import ModalHeader from './ModalHeader/ModalHeader';
import ModalFooter from './ModalFooter/ModalFooter';
import {useTaskStore} from '../../stores/storeContext'; 
import {validateTask, TaskValidationErrors} from '../../utils/taskValidation'; // Добавлен импорт типа

// Создаем пустой объект задачи для инициализации
const emptyTask: TaskItem = {
    id: '',
    title: '',
    description: '',
    time: '',
    date: '',
    status: 'To Do' as TaskStatus,
};

// Начальное состояние для ошибок
const initialErrors: TaskValidationErrors = {
    title: [],
    description: [],
    date: [],
    time: [],
};

const TaskModal: React.FC = observer(() => {
    const taskStore = useTaskStore();
    const [task, setTask] = useState<TaskItem>(emptyTask);
    const [errors, setErrors] = useState<TaskValidationErrors>(initialErrors); // Изменен тип ошибок

    const isOpen = taskStore.isModalOpen;

    useEffect(() => {
        if (taskStore.currentTask) {
            setTask(taskStore.currentTask);
        } else {
            setTask({...emptyTask});
        }
        setErrors(initialErrors); // Сбрасываем ошибки при открытии модалки
    }, [taskStore.currentTask, taskStore.isModalOpen]);

    const handleChange = (field: keyof TaskItem, value: string) => {
        setTask(prev => ({...prev, [field]: value}));
        
        // Очищаем ошибку для изменяемого поля
        setErrors(prev => ({
            ...prev,
            [field]: []
        }));
    };

    const handleSubmit = () => {
        const validationErrors = validateTask(task);
        
        // Проверяем наличие ошибок в любом из полей
        const hasErrors = Object.values(validationErrors).some(
            fieldErrors => fieldErrors.length > 0
        );
        
        if (hasErrors) {
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
                        errors={errors} // Передаем объект ошибок
                        onChange={handleChange}
                    />

                    <ModalFooter
                        submitLabel={isNewTask ? "Создать" : "Сохранить"}
                        onSubmit={handleSubmit}
                    />
                </div>
            </div>
        </div>
    );
});

export default TaskModal;
