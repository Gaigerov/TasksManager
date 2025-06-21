import MainPage from './components/MainPage/MainPage';
import {BrowserRouter} from 'react-router-dom';
import './App.css';

function App() {

    return (
        <BrowserRouter basename="/tasksmanager">
            <div className="App">
                <MainPage />
            </div>
        </BrowserRouter>
    );
}

export default App;
