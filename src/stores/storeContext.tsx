import { createContext, useContext, ReactNode, useRef } from "react";
import TaskStore from "./TaskStore";
import { useNotification } from "../components/Notification/NotificationContext";

type TaskStoreContextType = TaskStore | null;

export const StoreContext = createContext<TaskStoreContextType>(null);

interface TaskStoreProviderProps {
    children: ReactNode;
}

export function TaskStoreProvider({ children }: TaskStoreProviderProps) {
    const showNotification = useNotification();
    const storeRef = useRef<TaskStore | null>(null);

    if (!storeRef.current) {
        storeRef.current = new TaskStore(showNotification);
    }

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
