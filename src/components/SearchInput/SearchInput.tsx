import {observer} from 'mobx-react-lite';
import CloseIcon from '@mui/icons-material/Close';
import Input from '../Input/Input';
import {useTaskStore} from '../../stores/storeContext';
import styles from '../Header/Header.module.css';

const SearchInput = observer(() => {
    const taskStore = useTaskStore();

    const handleClear = () => {
        taskStore.setSearchQuery('');
    };

    return (
        <Input
            value={taskStore.searchQuery}
            onChange={(e) => taskStore.setSearchQuery(e.target.value)}
            placeholder="Поиск задач..."
            className={styles.searchInput}
            variant="headerInput"
            inputSize="medium"
            fullWidth
            endIcon={taskStore.searchQuery ? <CloseIcon /> : undefined}
            onEndIconClick={handleClear}
            autoFocus
        />
    );
});

export default SearchInput;
