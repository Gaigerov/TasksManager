import React, {useState, useRef, useEffect, useCallback} from 'react';
import styles from './Header.module.css';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import CloseIcon from '@mui/icons-material/Close';
import Input from '../Input/Input';
import Button from '../Button/Button';

interface HeaderProps {
    onOpenModal?: () => void;
}

const Header: React.FC<HeaderProps> = ({onOpenModal}) => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const searchContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isSearchOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isSearchOpen]);

    useEffect(() => {
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
    }, [isSearchOpen]);

    const handleSearchToggle = () => {
        setIsSearchOpen(true);
    };

    const handleCloseSearch = useCallback(() => {
        setIsSearchOpen(false);
        setSearchValue('');
    }, []);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };

    return (
        <header className={styles.header}>
            <div ref={searchContainerRef} className={styles.searchArea}>
                {isSearchOpen ? (
                    <Input
                        ref={inputRef}
                        value={searchValue}
                        onChange={handleSearchChange}
                        placeholder="Search..."
                        className={styles.searchInput}
                        variant="headerInput"
                        inputSize="large"
                        fullWidth
                        endIcon={<CloseIcon />}
                        onEndIconClick={handleCloseSearch}
                    />
                ) : (
                    <div className={styles.iconContainers}>
                        <div
                            className={styles.searchIconContainer}
                            onClick={handleSearchToggle}
                        >
                            <SearchIcon />
                        </div>
                        <div
                            className={styles.searchIconContainer}
                            // onClick={handleSearchToggle}
                        >
                            <FilterAltOutlinedIcon />
                        </div>
                    </div>
                )}
            </div>

            <Button
                variant="primary"
                className={styles.createButton}
                onClick={() => onOpenModal && onOpenModal()}
            >
                Create
            </Button>
        </header>
    );
};

export default Header;
