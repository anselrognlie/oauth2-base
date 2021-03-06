import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useLocation
} from 'react-router-dom';
import Number from './pages/Number';
import SocketIo from './pages/SocketIo';
import AuthPage from './pages/Auth';
import Lobby from './pages/Lobby';
import Logo from './logo.svg';
import './App.css';
import { useCallback, useRef, useEffect } from 'react';
import useLogin from './hooks/login';
import axios from 'axios';
import {
  useHistory
} from 'react-router-dom';
import Cookies from 'js-cookie';
import { Auth } from './components/AuthContext';
import NavBar from './components/NavBar';
import PrivateRoute from './components/PrivateRoute';
import { io } from "socket.io-client";

function AppInternal() {
  const [user, token, setToken] = useLogin();
  const socket = useRef(null);
  const history = useHistory();
  const location = useLocation();
  console.log(location.pathname);

  useEffect(() => {
    socket.current = new io(process.env.BASE_URL);

    socket.current.on('connect', () => {
      console.log('WebSocket Client Connected');
      // socket.current.emit('my_event', {data: 'I\'m connected!'});
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  const onUserLoggedIn = useCallback((token) => {
    setToken(token);
    history.push("/");
  }, [setToken, history]);

  const onLoginFailed = useCallback(() => {
    history.push("/");
  }, [history]);

  const logout = () => {
    setToken(null);
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
    <Auth value={{user, token}}>
      <NavBar {...{ login, logout, register }}></NavBar>
      <div className="App">
        <Switch>
          <Route exact path="/"><img alt="react" src={Logo}></img></Route>
          <PrivateRoute isLoggedIn={!!user} exact path="/page1"><Number /></PrivateRoute>
          <Route exact path="/page2">Page2</Route>
          <Route exact path="/page3"><SocketIo socket={socket.current} /></Route>
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
  return <Router><AppInternal /></Router>
};

export default App;
