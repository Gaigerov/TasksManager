import {createContext, useContext, useEffect, useState, FC, ReactNode} from 'react';
import {APP_LIFECYCLE_STATUS, AppLifecycleStatus} from '../../config/constant';

interface AppLifecycleContextType {
    lifecycleStatus: AppLifecycleStatus;
}

export const AppLifecycleContext = createContext<AppLifecycleContextType | undefined>(undefined);

interface Props {
    children: ReactNode;
}

export const AppLifecycleProvider: FC<Props> = ({children}) => {
    const [lifecycleStatus, setLifecycleStatus] = useState<AppLifecycleStatus>(APP_LIFECYCLE_STATUS.INITIALIZATION); const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initializeApp = async () => {
            setIsLoading(true);
            try {
                setLifecycleStatus(APP_LIFECYCLE_STATUS.READY);
            } catch (error) {
                console.error('Ошибка при получении данных:', error);
                setLifecycleStatus(APP_LIFECYCLE_STATUS.ERROR);
            } finally {
                setIsLoading(false);
            }
        };

        initializeApp();
    }, []);

    return (
        <AppLifecycleContext.Provider value={{lifecycleStatus}}>
            {!isLoading && children}
        </AppLifecycleContext.Provider>
    );
};

export const useAppLifecycleStatus = () => {
    return useContext(AppLifecycleContext);
};
