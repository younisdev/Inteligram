import './App.css';
import Home from './pages/home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Logout from './pages/logout';
import ModalPrev from './pages/ModalPrev';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/account/login"
          element={<LoginPage />}
          caseSensitive={true}
        />
        <Route
          path="/Account/login"
          element={<Navigate to={'/account/login'} replace />}
        />
        <Route path="/test" element={<ModalPrev />} />
        <Route path="/account/register" element={<RegisterPage />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </Router>
  );
}

export default App;
