import { observer } from 'mobx-react-lite';
import { List, AutoSizer, ListRowRenderer } from 'react-virtualized';
import 'react-virtualized/styles.css';
import Task from '../Task/Task';
import { useTaskStore } from '../../stores/storeContext';
import { useCallback } from 'react';

const TasksList = observer(() => {
  const taskStore = useTaskStore();
  const { filteredTasks } = taskStore;

  const rowRenderer: ListRowRenderer = useCallback(
    ({ index, key, style }) => {
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
    <div className="tasksContainer" style={{ height: '820px', padding: '0' }}>
      <AutoSizer>
        {({ width, height }) => (
          <List
            width={width}
            height={height}
            rowCount={filteredTasks.length}
            rowHeight={130}
            rowRenderer={rowRenderer}
            overscanRowCount={5}
            style={{
              paddingTop: 20, 
              paddingBottom: 40,
              boxSizing: 'border-box',
            }}
          />
        )}
      </AutoSizer>
    </div>
  );
});

export default TasksList;
