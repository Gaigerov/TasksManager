import {createContext, useContext, ReactNode} from "react";
import TaskStore from "./TaskStore";

type TaskStoreContextType = TaskStore | null;

export const StoreContext = createContext<TaskStoreContextType>(null);

interface TaskStoreProviderProps {
    children: ReactNode;
}

export function TaskStoreProvider({children}: TaskStoreProviderProps) {
    const store = new TaskStore();

    return (
        <StoreContext.Provider value={store}>
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
