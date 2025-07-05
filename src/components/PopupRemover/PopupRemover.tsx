import React from 'react';
import styles from './PopupRemover.module.css';
import Button from '../Button/Button';

interface PopupRemoverProps {
    onRemove: () => void;
    onCancel: () => void;
}

const PopupRemover: React.FC<PopupRemoverProps> = ({onRemove, onCancel}) => {
    const handleRemove = () => {
        onRemove();
    };

    const handleCancel = () => {
        onCancel();
    };

    const stopPropagation = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <div
            className={styles.popper}
            onClick={stopPropagation}
        >
            <h2 className={styles.modalRemoveParagraph}>Remove the task?</h2>
            <div className={styles.buttonContainer}>
                <Button
                    variant={'danger'}
                    onClick={handleRemove}
                    size="medium"
                >
                    Remove
                </Button>
                <Button
                    variant={'secondary'}
                    onClick={handleCancel}
                    size="medium"
                >
                    Cancel
                </Button>
            </div>
        </div>
    );
};

export default PopupRemover;
