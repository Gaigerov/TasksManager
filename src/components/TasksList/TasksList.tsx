import { observer } from 'mobx-react-lite';
import { List, AutoSizer, ListRowRenderer } from 'react-virtualized';
import 'react-virtualized/styles.css';
import Task from '../Task/Task';
import { useTaskStore } from '../../stores/storeContext';
import { useCallback } from 'react';
import styles from './TasksList.module.css';
import { Loader } from '../Loader/Loader';
import { motion, AnimatePresence } from 'framer-motion';


const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

const TasksList = observer(() => {
    const taskStore = useTaskStore();
    const { filteredTasks } = taskStore;

    const isNewTask = useCallback(
        (taskId: string) => taskStore.newTaskIds.has(taskId),
        [taskStore.newTaskIds]
    );

    const rowRenderer: ListRowRenderer = useCallback(
        ({index, key, style}) => {
            const task = filteredTasks[index];
            const isLast = index === filteredTasks.length - 1;
            const isNew = isNewTask(task.id);
            
            return (
                <motion.div
                    key={key}
                    style={style}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                        opacity: 1, 
                        y: 0,
                        transition: { 
                            duration: 0.5,
                            delay: isNew ? 0 : 0.1 * index
                        }
                    }}
                    exit={{ opacity: 0 }}
                    custom={index}
                >
                    <Task task={task} isLastTask={isLast} />
                </motion.div>
            );
        },
        [filteredTasks, isNewTask]
    );

    if (taskStore.isLoading) {
        return <Loader open={taskStore.isLoading} />;
    }

    return (
        <div className={styles.tasksContainer}>
            {filteredTasks.length > 0 ? (
                <div className={styles.contentWrapper}>
                    <div className={styles.fadeTop}></div>
                    <AutoSizer>
                        {({ width, height }) => (
                            <AnimatePresence>
                                <motion.div
                                    initial="hidden"
                                    animate="visible"
                                    variants={containerVariants}
                                    style={{ width, height }}
                                >
                                    <List
                                        width={width}
                                        height={height}
                                        rowCount={filteredTasks.length}
                                        rowHeight={130}
                                        rowRenderer={rowRenderer}
                                        overscanRowCount={5}
                                        style={{
                                            paddingTop: 35,
                                            paddingBottom: 35,
                                            boxSizing: 'border-box',
                                            overflowY: 'auto'
                                        }}
                                    />
                                </motion.div>
                            </AnimatePresence>
                        )}
                    </AutoSizer>
                    <div className={styles.fadeBottom}></div>
                </div>
            ) : (
                <motion.div 
                    className={styles.emptyList}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <p>Нет задач</p>
                </motion.div>
            )}
        </div>
    );
});

export default TasksList;
