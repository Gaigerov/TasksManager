import {observer} from 'mobx-react-lite';
import {List, AutoSizer, ListRowRenderer} from 'react-virtualized';
import 'react-virtualized/styles.css';
import Task from '../Task/Task';
import {useTaskStore} from '../../stores/storeContext';
import {useCallback} from 'react';
import styles from './TasksList.module.css';

const TasksList = observer(() => {
    const taskStore = useTaskStore();
    const {filteredTasks} = taskStore;

    const rowRenderer: ListRowRenderer = useCallback(
        ({index, key, style}) => {
            const task = filteredTasks[index];
            return (
                <div key={key} style={style}>
                    <Task task={task} />
                </div>
            );
        },
        [filteredTasks]
    );

    return (
        <div className={styles.tasksContainer}>
            {filteredTasks.length > 0 ? (
                <AutoSizer>
                    {({width, height}) => (
                        <List
                            width={width}
                            height={height}
                            rowCount={filteredTasks.length}
                            rowHeight={130}
                            rowRenderer={rowRenderer}
                            overscanRowCount={5}
                            style={{
                                paddingTop: 20,
                                paddingBottom: 30,
                                boxSizing: 'border-box',
                                overflowY: 'auto'
                            }}
                        />
                    )}
                </AutoSizer>
            ) : (
                <div className={styles.emptyList}>
                    <p>Нет задач</p>
                </div>
            )}
        </div>
    );
});

export default TasksList;
