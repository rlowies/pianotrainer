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
              <Link to="/treble">Treble</Link>
            </li>
            <li>
              <Link to="/bass">Bass</Link>
            </li>
          </ul>
        </nav>
        <div className="App">
          <Switch>
            <Route path="/treble">
              <Staff reset={true} clef={"treble"} />
            </Route>
            <Route path="/bass">
              <Staff reset={true} clef={"bass"} />
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
