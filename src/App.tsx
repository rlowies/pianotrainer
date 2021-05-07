import './App.css';
import Staff from './components/Staff';
import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useLocation
} from 'react-router-dom';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/staff">Staff</Link>
            </li>
          </ul>
        </nav>
        <div className="App">
          <Switch>
            <Route path="/staff">
              <Staff reset={true} />
            </Route>
            <Route path="/">
              Home
          </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
