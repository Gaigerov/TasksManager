import styles from './ModalFooter.module.css';

interface SecondaryButton {
    label: string;
    onClick: () => void;
    disabled?: boolean;
    variant?: 'primary' | 'secondary' | 'danger';
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
    closeLabel = 'Закрыть',
    onClose,
    onSubmit,
    submitDisabled = false,
    secondaryButton
}) => {

    return (
        <div className={styles.footer}>
            <div>
                {secondaryButton && (
                    <button
                        type="button"
                        className={`${styles.button} ${styles[secondaryButton.variant || 'secondary']}`}
                        onClick={secondaryButton.onClick}
                        disabled={secondaryButton.disabled}
                    >
                        {secondaryButton.label}
                    </button>
                )}
            </div>

            <div className={styles.rightGroup}>
                <button
                    type="button"
                    className={`${styles.button} ${styles.secondary}`}
                    onClick={onClose}
                >
                    {closeLabel}
                </button>
                <button
                    type="button"
                    className={`${styles.button} ${styles.primary}`}
                    onClick={onSubmit}
                    disabled={submitDisabled}
                >
                    {submitLabel}
                </button>
            </div>
        </div>
    );
};

export default ModalFooter;
