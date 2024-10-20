import './App.css';
import LandingPage from './components/LandingPage';
import { Route, Routes } from 'react-router-dom';
import RegisterPage from './components/RegisterPage';
import VotingPage from './components/VotingPage';
import ResultsPage from './components/ResultsPage';

function App() {
  return (
      <div className="App">
        <Routes>
          <Route path='/' element={<LandingPage/>}/>
          <Route path='/register' element={<RegisterPage/>}/>
          <Route path='/vote' element={<VotingPage/>}/>
          <Route path='/results' element={<ResultsPage/>}/>
        </Routes>
      </div>
  );
}

export default App;
