import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from 'react-router-dom';
import Number from './pages/Number';
import Auth from './pages/Auth';
import Logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import axios from 'axios';

const useLogin = (account) => {
  const localUser = localStorage.getItem("user")
  const [user, setUser] = useState(localUser);

  const setLogin = (login) => {
    if (login) {
      localStorage.setItem("user", login);
    } else {
      localStorage.removeItem("user");
    }

    setUser(login);
  };
  return [user, setLogin];
};

function App() {
  const [user, setUser] = useLogin();

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
    <Router>
      <nav>
        <ul>
        <li><Link to="/">Main</Link></li>
        <li><Link to="/page1">Page1</Link></li>
        <li><Link to="/page2">Page2</Link></li>
        <li>{ !!user ? <button onClick={logout}>Logout</button> : <button onClick={login}>Login</button> }</li>
        </ul>
        <div>{ !!user && <span>Logged in as {user}</span> }</div>
      </nav>
    <div className="App">
      <Switch>
        <Route exact path="/"><img alt="react" src={Logo}></img></Route>
        <Route exact path="/page1"><Number /></Route>
        <Route exact path="/page2">Page2</Route>
        <Route exact path="/auth/google"><Auth {...{setUser, user}} /></Route>
        <Route exact path="/404">Not found</Route>
        <Route><Redirect to="/404" /></Route>
      </Switch>
    </div>
    </Router>
  );
}

export default App;
