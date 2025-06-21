import React from 'react';
import styles from './ModalHeader.module.css';
import {useTaskStore} from '../../../stores/storeContext';

interface ModalHeaderProps {
    title: string;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({title}) => {
    const taskStore = useTaskStore();

    const handleClose = () => {
        if (taskStore && typeof taskStore.closeModal === 'function') {
            taskStore.closeModal();
        }
    };

    return (
        <header className={styles.header}>
            <h2 className={styles.title}>{title}</h2>
            <button
                className={styles.closeButton}
                onClick={handleClose}
                aria-label="Close modal"
            >
                <span className={styles.closeIcon}>&times;</span>
            </button>
        </header>
    );
};

export default ModalHeader;
