import {
  BrowserRouter as Router,
  Switch,
  Route,
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
import NavBar from './components/NavBar';
import PrivateRoute from './components/PrivateRoute';

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
      <NavBar {...{ login, logout, register }}></NavBar>
      <div className="App">
        <Switch>
          <Route exact path="/"><img alt="react" src={Logo}></img></Route>
          <PrivateRoute isLoggedIn={!!user} exact path="/page1"><Number /></PrivateRoute>
          <Route exact path="/page2">Page2</Route>
          <PrivateRoute isLoggedIn={!!user} redirectTo="/" exact path="/lobby"><Lobby /></PrivateRoute>
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
