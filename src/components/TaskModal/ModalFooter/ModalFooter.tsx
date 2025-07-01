import {useTaskStore} from '../../../stores/storeContext';
import Button from '../../Button/Button';
import styles from './ModalFooter.module.css';

interface ButtonConfig {
    label: string;
    onClick: () => void;
    disabled?: boolean;
    variant?: 'primary' | 'secondary' | 'danger' | 'warning' | 'success' | 'link';
}

interface ModalFooterProps {
    onSubmit?: () => void;
    submitLabel?: string;
    closeLabel?: string;
    submitDisabled?: boolean;
    isViewMode?: boolean;
    isFilterMode?: boolean;
    viewModeButtons?: ButtonConfig[];
    filterModeButtons?: ButtonConfig[];
}

const ModalFooter: React.FC<ModalFooterProps> = ({
    submitLabel = 'Create',
    closeLabel = 'Cancel',
    onSubmit,
    submitDisabled = false,
    isViewMode = false,
    isFilterMode = false,
    viewModeButtons = [],
    filterModeButtons = [],
}) => {
    const taskStore = useTaskStore();

    const handleClose = () => {
        taskStore?.closeModal?.();
    };

    if (isViewMode) {
        return (
            <div className={styles.footer}>
                <div className={styles.buttonGroup}>
                    {viewModeButtons.map((btn, index) => (
                        <Button
                            key={index}
                            variant={btn.variant || 'secondary'}
                            onClick={btn.onClick}
                            disabled={btn.disabled}
                            size="medium"
                        >
                            {btn.label}
                        </Button>
                    ))}
                </div>
            </div>
        );
    }

    if (isFilterMode) {
        return (
            <div className={styles.footer}>
                <div className={styles.buttonGroup}>
                    {filterModeButtons.map((btn, index) => (
                        <Button
                            key={index}
                            variant={btn.variant || 'secondary'}
                            onClick={btn.onClick}
                            disabled={btn.disabled}
                            size="medium"
                        >
                            {btn.label}
                        </Button>
                    ))}
                </div>
            </div>
        );
    }

    const getSubmitVariant = () => {
        if (submitLabel === 'Create') return 'success';
        if (submitLabel === 'Save') return 'warning';
        return 'primary';
    };

    return (
        <div className={styles.footer}>
            <div className={styles.buttonGroup}>
                <Button
                    variant={getSubmitVariant()}
                    onClick={onSubmit}
                    disabled={submitDisabled}
                    size="medium"
                >
                    {submitLabel}
                </Button>
                <Button
                    variant="secondary"
                    onClick={handleClose}
                    size="medium"
                >
                    {closeLabel}
                </Button>
            </div>
        </div>
    );
};

export default ModalFooter;
