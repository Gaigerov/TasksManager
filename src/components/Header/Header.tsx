import React from 'react';
import styles from './Header.module.css';
import SearchIcon from '@mui/icons-material/Search';
import Input from '../Input/Input';
import Button from '../Button/Button';

interface HeaderProps {
    onOpenModal?: () => void;
}

const Header: React.FC<HeaderProps> = ({onOpenModal}) => {
    return (
        <header className={styles.header}>
            <Input
                placeholder="Search..."
                startIcon={<SearchIcon />}
                className={styles.searchInput}
                variant="headerInput"
                size='small'
                onFocus={() => console.log('Focused')}
                fullWidth
            />

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
