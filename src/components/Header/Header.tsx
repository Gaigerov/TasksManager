import React, {useState, useRef, useEffect, useCallback} from 'react';
import styles from './Header.module.css';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import Button from '../Button/Button';
import SearchInput from '../SearchInput/SearchInput';

interface HeaderProps {
    onOpenModal?: () => void;
}

const Header: React.FC<HeaderProps> = ({onOpenModal}) => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const searchContainerRef = useRef<HTMLDivElement>(null);

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
                        <div
                            className={styles.searchIconContainer}
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
