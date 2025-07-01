import {createContext, useContext, ReactNode, useRef, useEffect} from "react";
import TaskStore from "./TaskStore";
import {useNotification} from "../components/Notification/NotificationContext";
import Cookies from "js-cookie";

type TaskStoreContextType = TaskStore | null;

export const StoreContext = createContext<TaskStoreContextType>(null);

interface TaskStoreProviderProps {
    children: ReactNode;
}

export function TaskStoreProvider({children}: TaskStoreProviderProps) {
    const showNotification = useNotification();
    const storeRef = useRef<TaskStore | null>(null);

    if (!storeRef.current) {
        storeRef.current = new TaskStore(showNotification);
    }

    useEffect(() => {
        const initializeTasks = async () => {
            try {
                const user = Cookies.get('user');
                if (user) {
                    await storeRef.current?.initializeTasks(user);
                }
            } catch (error) {
                console.error("Error initializing task store:", error);
            }
        };

        initializeTasks();

        return () => {
            if (storeRef.current) {
                storeRef.current.clearAllData();
            }
        };
    }, []);

    return (
        <StoreContext.Provider value={storeRef.current}>
            {children}
        </StoreContext.Provider>
    );
}

export function useTaskStore(): TaskStore {
    const store = useContext(StoreContext);

    if (store === null) {
        throw new Error(
            "useTaskStore must be used within a TaskStoreProvider"
        );
    }

    return store;
}
