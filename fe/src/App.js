import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from 'react-router-dom';
import Number from './pages/Number';
import Logo from './logo.svg';
import './App.css';

function App() {
  return (
    <Router>
      <nav>
        <ul>
        <li><Link to="/">Main</Link></li>
        <li><Link to="page1">Page1</Link></li>
        <li><Link to="page2">Page2</Link></li>
        </ul>
      </nav>
    <div className="App">
      <Switch>
        <Route exact path="/"><img src={Logo}></img></Route>
        <Route exact path="/page1"><Number /></Route>
        <Route exact path="/page2">Page2</Route>
        <Route exact path="/404">Not found</Route>
        <Route><Redirect to="/404" /></Route>
      </Switch>
    </div>
    </Router>
  );
}

export default App;
