import React from 'react';
import styles from './Footer.module.css';
import Button from '../Button/Button';

const Footer: React.FC = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.buttonGroup}>
                <Button
                    variant="secondary"
                    className={styles.footerButton}
                >
                    Tasks
                </Button>
                <Button
                    variant="secondary"
                    className={styles.footerButton}
                >
                    Calendar
                </Button>
                <Button
                    variant="secondary"
                    className={styles.footerButton}
                >
                    Board
                </Button>
            </div>
        </footer>
    );
};

export default Footer;
