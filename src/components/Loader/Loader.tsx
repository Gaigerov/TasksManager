import {FC} from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import styles from './Loader.module.css';

type Props = {
    open: boolean;
}

export const Loader: FC<Props> = ({open}) => (
    <div className={styles.loader}>
        <Backdrop
            sx={(theme) => ({color: '#fff', zIndex: theme.zIndex.drawer + 1})}
            open={open}
        >
            <div className={styles.loader__animation}>
                <CircularProgress color="inherit" />
                <p>Loading...</p>
            </div>
        </Backdrop>
    </div>
);
