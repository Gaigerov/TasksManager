import React, {useState, useRef, useEffect, useCallback} from 'react';
import styles from './Header.module.css';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import Button from '../Button/Button';
import SearchInput from '../SearchInput/SearchInput';
import {VALID_MODE} from '../../config/constant';
import {useTaskStore} from '../../stores/storeContext';
import Badge from '@mui/material/Badge';
import {styled} from '@mui/material';


const RedBadge = styled(Badge)(({theme}) => ({
    '& .MuiBadge-badge': {
        backgroundColor: theme.palette.error.main,
        color: theme.palette.error.contrastText,
        zIndex: 100,
        '&::after': {
            position: 'absolute',
            top: 0,
            left: 0,
            borderRadius: '50%',
            content: '""',
        },
    },
}));

interface HeaderProps {
    onOpenModal?: () => void;
}

const Header: React.FC<HeaderProps> = ({onOpenModal}) => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const searchContainerRef = useRef<HTMLDivElement>(null);
    const taskStore = useTaskStore();

    const filterCount =
        (taskStore.filters.status ? 1 : 0) +
        (taskStore.filters.date ? 1 : 0);

    const handleCloseSearch = useCallback(() => {
        setIsSearchOpen(false);
    }, []);

    useEffect(() => {
        if (!isSearchOpen) {
            taskStore.setSearchQuery('');
        }
    }, [isSearchOpen, taskStore]);

    const handleOpenFilter = () => {
        taskStore.openModal(VALID_MODE.FILTER);
    };

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

    const handleSearchToggle = () => {
        setIsSearchOpen(true);
    };

    return (
        <header className={styles.header}>
            <div ref={searchContainerRef} className={styles.searchArea}>
                {isSearchOpen ? (
                    <SearchInput />
                ) : (
                    <div className={styles.iconContainers}>
                        <div
                            className={styles.searchIconContainer}
                            onClick={handleSearchToggle}
                        >
                            <SearchIcon />
                        </div>
                        <div className={styles.filterIconContainer} onClick={handleOpenFilter}>
                            <RedBadge
                                badgeContent={filterCount}
                                color="error"
                                invisible={filterCount === 0}
                                overlap="circular"
                            >
                                <FilterAltOutlinedIcon />
                            </RedBadge>
                        </div>
                    </div>
                )}
            </div>

            <Button
                variant="primary"
                className={styles.createButton}
                onClick={() => onOpenModal && onOpenModal()}
            >
                Создать
            </Button>
        </header>
    );
};

export default Header;
