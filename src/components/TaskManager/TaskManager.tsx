import React from 'react';
import {observer} from 'mobx-react-lite';
import TaskModal from '../TaskModal/TaskModal';
import TasksList from '../TasksList/TasksList';
import {useTaskStore} from '../../stores/storeContext';

const TaskManager: React.FC = observer(() => {
    const taskStore = useTaskStore();

    return (
        <div className="task-manager">
            {taskStore.tasks.length > 0 ? (
                <TasksList
                    tasks={taskStore.tasks}
                />
            ) : (
                <div className="empty-state">
                    <p>Задачи не найдены</p>
                </div>
            )}

            <TaskModal />
        </div>
    );
});

export default TaskManager;
