import {createContext, useContext, useEffect, useState, FC, ReactNode} from 'react';

export enum APP_LIFECYCLE_STATUS {
    INITIALIZATION = 'INITIALIZATION',
    READY = 'READY',
    ERROR = 'ERROR'
}

interface AppLifecycleContextType {
    lifecycleStatus: APP_LIFECYCLE_STATUS;
}
 
export const AppLifecycleContext = createContext<AppLifecycleContextType | undefined>(undefined);

interface Props {
    children: ReactNode;
}

export const AppLifecycleProvider: FC<Props> = ({children}) => {
    const [lifecycleStatus, setLifecycleStatus] = useState<APP_LIFECYCLE_STATUS>(APP_LIFECYCLE_STATUS.INITIALIZATION);
    const [isLoading, setIsLoading] = useState(true);

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
