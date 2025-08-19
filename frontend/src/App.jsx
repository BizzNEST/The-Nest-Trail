import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ChatTestPage from './pages/GameplayPage';

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/chat-test" element={<ChatTestPage/>} />
      </Routes>
    </Router>
  )
}

export default App;
