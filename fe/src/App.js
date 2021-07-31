import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from 'react-router-dom';
import Number from './pages/Number';
import Auth from './pages/Auth';
import Lobby from './pages/Lobby';
import Logo from './logo.svg';
import './App.css';
import { useCallback } from 'react';
import useLogin from './hooks/login';
import axios from 'axios';
import {
  useHistory
} from 'react-router-dom';
import Cookies from 'js-cookie';

function Main() {
  const [user, setUser, token] = useLogin();
  const history = useHistory();

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
    <>
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
        <Route exact path="/page1"><Number token={token} /></Route>
        <Route exact path="/page2">Page2</Route>
        { !!user && <Route exact path="/lobby"><Lobby user={user} token={token} /></Route> }
        <Route exact path="/auth/google"><Auth {...{onUserLoggedIn, onLoginFailed, user}} /></Route>
        <Route exact path="/404">Not found</Route>
        <Route><Redirect to="/404" /></Route>
      </Switch>
    </div>
    </>
  );
}

const App = () => {
  return <Router><Main /></Router>
};

export default App;
