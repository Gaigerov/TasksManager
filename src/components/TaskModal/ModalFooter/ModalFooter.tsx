import {useTaskStore} from '../../../stores/storeContext';
import styles from './ModalFooter.module.css';

interface SecondaryButton {
    label: string;
    onClick: () => void;
    disabled?: boolean;
    variant?: 'primary' | 'secondary' | 'danger' | 'warning';
}

interface ModalFooterProps {
    onSubmit: () => void;
    submitLabel?: string;
    closeLabel?: string;
    submitDisabled?: boolean;
    secondaryButton?: SecondaryButton;
}

const ModalFooter: React.FC<ModalFooterProps> = ({
    submitLabel = 'Создать',
    closeLabel = 'Выйти',
    onSubmit,
    submitDisabled = false,
}) => {
    const taskStore = useTaskStore();
    
    const handleClose = () => {
        if (taskStore && typeof taskStore.closeModal === 'function') {
            taskStore.closeModal();
        }
    };

    const getSubmitButtonClass = () => {
        if (submitLabel === 'Создать') {
            return `${styles.button} ${styles.success}`;
        } else if (submitLabel === 'Сохранить') {
            return `${styles.button} ${styles.warning}`;
        }

        return `${styles.button} ${styles.primary}`;
    };

    return (
        <div className={styles.footer}>
            <div className={styles.buttonGroup}>
                <button
                    type="button"
                    className={getSubmitButtonClass()}
                    onClick={onSubmit}
                    disabled={submitDisabled}
                >
                    {submitLabel}
                </button>
                <button
                    type="button"
                    className={`${styles.button} ${styles.secondary}`}
                    onClick={handleClose}
                >
                    {closeLabel}
                </button>
            </div>
        </div>
    );
};

export default ModalFooter;
