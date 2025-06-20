import React from 'react';
import {observer} from 'mobx-react-lite';
import Task from '../Task/Task';
import {TaskItem as TaskType} from '../../types/types';

interface TasksListProps {
    tasks: TaskType[];
}

const TasksList: React.FC<TasksListProps> = observer(({
    tasks,
}) => {
    return (
        <div className="tasks-list">
            {tasks.map(task => (
                <Task
                    key={task.id}
                    task={task}
                />
            ))}
        </div>
    );
});

export default TasksList;
