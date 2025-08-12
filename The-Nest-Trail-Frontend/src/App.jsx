import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import GameScreen from './pages/GameScreen';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/GameScreen" element={<GameScreen/>} />
      </Routes>
    </Router>
  )
}

export default App;
