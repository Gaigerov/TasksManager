import {observer} from 'mobx-react-lite';
import Task from '../Task/Task';
import {useTaskStore} from '../../stores/storeContext';

const TasksList = observer(() => {
    const taskStore = useTaskStore();
    const {filteredTasks} = taskStore;

    return (
        <div>
            {filteredTasks.map(task => (
                <Task
                    key={task.id}
                    task={task}
                />
            ))}
        </div>
    );
});

export default TasksList;
