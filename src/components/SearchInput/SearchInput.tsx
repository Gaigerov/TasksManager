import {observer} from 'mobx-react-lite';
import CloseIcon from '@mui/icons-material/Close';
import Input from '../Input/Input';
import {useTaskStore} from '../../stores/storeContext';
import {useCallback, useEffect, useRef, useState} from 'react';
import styles from '../Header/Header.module.css';

const SearchInput = observer(() => {
    const taskStore = useTaskStore();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const searchContainerRef = useRef<HTMLDivElement>(null);
    const handleClear = () => {
        taskStore.setSearchQuery('');
    };

    const handleCloseSearch = useCallback(() => {
        setIsSearchOpen(false);
    }, []);

    useEffect(() => {
        if (isSearchOpen && inputRef.current) {
            inputRef.current.focus();
        }

        const handleClickOutside = (event: MouseEvent) => {
            if (isSearchOpen &&
                searchContainerRef.current &&
                !searchContainerRef.current.contains(event.target as Node)) {
                handleCloseSearch();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isSearchOpen, handleCloseSearch]);

    return (
        <Input
            ref={inputRef}
            value={taskStore.searchQuery}
            onChange={(e) => taskStore.setSearchQuery(e.target.value)}
            placeholder="Search..."
            className={styles.searchInput}
            variant="headerInput"
            inputSize="medium"
            fullWidth
            endIcon={taskStore.searchQuery ? <CloseIcon /> : undefined}
            onEndIconClick={handleClear}

        />
    );
});

export default SearchInput;
