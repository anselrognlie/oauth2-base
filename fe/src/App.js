import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from 'react-router-dom';
import Number from './pages/Number';
import AuthPage from './pages/Auth';
import Lobby from './pages/Lobby';
import Logo from './logo.svg';
import './App.css';
import { useCallback, useEffect, useState } from 'react';
import useLogin from './hooks/login';
import axios from 'axios';
import {
  useHistory
} from 'react-router-dom';
import Cookies from 'js-cookie';
import { Auth } from './components/AuthContext';

function Main() {
  const [user, setUser, token] = useLogin();
  const [auth, setAuth] = useState({});
  const history = useHistory();

  useEffect(() => setAuth({user, token}), [user, token]);

  const onUserLoggedIn = useCallback((user) => {
    setUser(user);
    history.push("/");
  }, [setUser, history]);

  const onLoginFailed = useCallback(() => {
    history.push("/");
  }, [history]);

  const logout = () => {
    setUser(null);
  };

  const loginRedirect = async () => {
    const response = await axios.get('/api/login')

    window.location.replace(response.data.redirect_uri);
  };

  const login = () => {
    Cookies.remove('register');
    loginRedirect();
  };

  const register = () => {
    Cookies.set('register', JSON.stringify(true));
    loginRedirect();
  };

  return (
    <Auth value={auth}>
      <nav>
        <ul>
        <li><Link to="/">Main</Link></li>
        <li><Link to="/page1">Page1</Link></li>
        <li><Link to="/page2">Page2</Link></li>
        { !!user ? (
          <>
            <li><Link to="/lobby">Lobby</Link></li>
            <li><button onClick={logout}>Logout</button></li>
          </>) : (
          <>
            <li><button onClick={register}>Register</button></li>
            <li><button onClick={login}>Login</button></li>
          </>)}
        </ul>
        <div>{ !!user && <span>Logged in as {user.name}</span> }</div>
      </nav>
      <div className="App">
        <Switch>
          <Route exact path="/"><img alt="react" src={Logo}></img></Route>
          <Route exact path="/page1"><Number /></Route>
          <Route exact path="/page2">Page2</Route>
          { !!user && <Route exact path="/lobby"><Lobby /></Route> }
          <Route exact path="/auth/google"><AuthPage {...{onUserLoggedIn, onLoginFailed}} /></Route>
          <Route exact path="/404">Not found</Route>
          <Route><Redirect to="/404" /></Route>
        </Switch>
      </div>
    </Auth>
  );
}

const App = () => {
  return <Router><Main /></Router>
};

export default App;
