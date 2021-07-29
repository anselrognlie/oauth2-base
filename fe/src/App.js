import {
  Switch,
  Route,
  Link,
  Redirect
} from 'react-router-dom';
import Number from './pages/Number';
import Auth from './pages/Auth';
import Logo from './logo.svg';
import './App.css';
import { useCallback } from 'react';
import useLogin from './hooks/login';
import axios from 'axios';
import {
  useHistory
} from 'react-router-dom';

function App() {
  const [user, setUser] = useLogin();
  const history = useHistory();

  const onUserLoggedIn = useCallback((user) => {
    setUser(user);
    history.push("/");
  }, [setUser, history]);

  const logout = () => {
    setUser(null);
  };

  const loginRedirect = async () => {
    const response = await axios.get('/api/login')

    window.location.replace(response.data.redirect_uri);
  };

  const login = () => {
    loginRedirect();
  };

  return (
    <>
      <nav>
        <ul>
        <li><Link to="/">Main</Link></li>
        <li><Link to="/page1">Page1</Link></li>
        <li><Link to="/page2">Page2</Link></li>
        <li>{ !!user ? <button onClick={logout}>Logout</button> : <button onClick={login}>Login</button> }</li>
        </ul>
        <div>{ !!user && <span>Logged in as {user.profile.full_name}</span> }</div>
      </nav>
    <div className="App">
      <Switch>
        <Route exact path="/"><img alt="react" src={Logo}></img></Route>
        <Route exact path="/page1"><Number token={user?.token} /></Route>
        <Route exact path="/page2">Page2</Route>
        <Route exact path="/auth/google"><Auth {...{onUserLoggedIn, user}} /></Route>
        <Route exact path="/404">Not found</Route>
        <Route><Redirect to="/404" /></Route>
      </Switch>
    </div>
    </>
  );
}

export default App;
