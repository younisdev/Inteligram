import Login from '../components/auth/login/LoginForm';
import NavBar from '../components/nav';
import Tokenctr from '../components/tokenctr';
function LoginPage() {
  return (
    <Tokenctr>
      <NavBar />
      <Login />
    </Tokenctr>
  );
}

export default LoginPage;
