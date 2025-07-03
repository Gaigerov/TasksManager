import React, {useState, useRef, useEffect, useCallback} from 'react';
import styles from './Header.module.css';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import Button from '../Button/Button';
import SearchInput from '../SearchInput/SearchInput';
import {VALID_MODE} from '../../config/constant';
import {useTaskStore} from '../../stores/storeContext';
import Badge from '@mui/material/Badge';
import {
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import MenuIcon from '@mui/icons-material/Menu';
import {useNavigate, useLocation} from 'react-router-dom';
import listCheckIcon from '../../images/list-check-2.svg';
import calendarCheckIcon from '../../images/calendar-todo-line.svg';
import boardCheckIcon from '../../images/web-board.svg';
import {useBreakpoint} from '../../hooks/useBreakpoints';

const RedBadge = Badge;

interface HeaderProps {
    onOpenModal?: () => void;
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({onOpenModal, onLogout}) => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const searchContainerRef = useRef<HTMLDivElement>(null);
    const taskStore = useTaskStore();
    const navigate = useNavigate();
    const location = useLocation();
    const breakpoint = useBreakpoint();

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

    const handleMenuOpen = (event: React.MouseEvent<HTMLDivElement>) => {
        setMenuAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
    };

    const handleMenuItemClick = (path: string) => {
        navigate(path);
        handleMenuClose();
    };

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    return (
        <header className={styles.header}>
            <div ref={searchContainerRef} className={styles.searchArea}>
                {isSearchOpen ? (
                    <SearchInput />
                ) : (
                    <div className={styles.iconContainers}>
                        {breakpoint === 'desktop' &&
                            <div
                                className={styles.menuIconContainer}
                                onClick={handleMenuOpen}
                            >
                                <MenuIcon />
                            </div>
                        }
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
            {breakpoint === 'desktop' &&
                <Menu
                    anchorEl={menuAnchorEl}
                    open={Boolean(menuAnchorEl)}
                    onClose={handleMenuClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    sx={{
                        '& .MuiPaper-root': {
                            borderRadius: '8px',
                        },
                        '& .MuiList-root': {
                            paddingTop: 0,
                            paddingBottom: 0,
                        },
                        '& .MuiMenuItem-root': {
                            minHeight: 'auto',
                            padding: '6px 12px',
                            borderRadius: 0,
                        },
                        '& .MuiListItemText-root': {
                            margin: 0,
                        },
                        '& .MuiListItemText-primary': {
                            fontSize: '0.875rem',
                        },
                        '& .Mui-selected': {
                            backgroundColor: 'transparent !important',
                        }
                    }}
                >
                    <MenuItem
                        onClick={() => handleMenuItemClick('/')}
                        selected={isActive('/')}
                    >
                        <ListItemIcon>
                            <img
                                src={listCheckIcon}
                                alt="Tasks"
                                className={`${styles.menuItemIcon} ${isActive('/') ? styles.menuItemIconActive : ''}`}
                            />
                        </ListItemIcon>
                        <ListItemText
                            className={isActive('/') ? styles.activeText : ''}
                        >
                            Tasks
                        </ListItemText>
                    </MenuItem>
                    <MenuItem
                        onClick={() => handleMenuItemClick('/calendar')}
                        selected={isActive('/calendar')}
                    >
                        <ListItemIcon>
                            <img
                                src={calendarCheckIcon}
                                alt="Calendar"
                                className={`${styles.menuItemIcon} ${isActive('/calendar') ? styles.menuItemIconActive : ''}`}
                            />
                        </ListItemIcon>
                        <ListItemText
                            className={isActive('/calendar') ? styles.activeText : ''}
                        >
                            Calendar
                        </ListItemText>
                    </MenuItem>
                    <MenuItem
                        onClick={() => handleMenuItemClick('/board')}
                        selected={isActive('/board')}
                    >
                        <ListItemIcon>
                            <img
                                src={boardCheckIcon}
                                alt="Board"
                                className={`${styles.menuItemIcon} ${isActive('/board') ? styles.menuItemIconActive : ''}`}
                            />
                        </ListItemIcon>
                        <ListItemText
                            className={isActive('/board') ? styles.activeText : ''}
                        >
                            Board
                        </ListItemText>
                    </MenuItem>
                </Menu>
            }
            <Button
                variant="primary"
                className={styles.createButton}
                onClick={() => onOpenModal && onOpenModal()}
            >
                Create
            </Button>
            <button
                className={styles.logoutButton}
                onClick={onLogout}
                title="Выйти"
            >
                <ExitToAppIcon />
            </button>
        </header>
    );
};

export default Header;
