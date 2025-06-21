import {HashRouter} from 'react-router-dom';
import MainPage from './components/MainPage/MainPage';

function App() {
    return (
        <HashRouter basename="/tasksmanager">
            <div className="App">
                <MainPage />
            </div>
        </HashRouter>
    );
}

export default App;
