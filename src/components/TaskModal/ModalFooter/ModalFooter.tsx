import styles from './ModalFooter.module.css';

interface SecondaryButton {
    label: string;
    onClick: () => void;
    disabled?: boolean;
    variant?: 'primary' | 'secondary' | 'danger' | 'warning';
}

interface ModalFooterProps {
    onClose: () => void;
    onSubmit: () => void;
    submitLabel?: string;
    closeLabel?: string;
    submitDisabled?: boolean;
    secondaryButton?: SecondaryButton;
}

const ModalFooter: React.FC<ModalFooterProps> = ({
    submitLabel = 'Создать',
    closeLabel = 'Выйти',
    onClose,
    onSubmit,
    submitDisabled = false,
}) => {
    // Определяем класс кнопки на основе submitLabel
    const getSubmitButtonClass = () => {
        if (submitLabel === 'Создать') {
            return `${styles.button} ${styles.success}`;
        } else if (submitLabel === 'Сохранить') {
            return `${styles.button} ${styles.warning}`;
        }
        // Возвращаем primary по умолчанию
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
                    onClick={onClose}
                >
                    {closeLabel}
                </button>
            </div>
        </div>
    );
};

export default ModalFooter;
