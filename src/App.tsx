import './App.css';
import Staff from './components/Staff';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch
} from 'react-router-dom';

function App() {
  return (
    <Router>
      <div>
        <div className="navbar">
          <Link to="/">Home</Link>
          <Link to="/noteTraining">Note Training</Link>
        </div>
        <Switch>
          <Route path="/noteTraining">
            <NoteTraining />
          </Route>
          <Route path="/">
            Home
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

function NoteTraining() {
  let { url } = useRouteMatch();

  return (
    <Router>
      <div>
        <div className="training-buttons">
          <Link to={`${url}/treble`}>Treble</Link>
          <Link to={`${url}/bass`}>Bass</Link>
        </div>
        <Switch>
          <Route path={`${url}/treble`}>
            <Levels clef="treble" />
          </Route>
          <Route path={`${url}/bass`}>
            <Levels clef="bass" />
          </Route>
        </Switch>
      </div>
    </Router>
  );

}

function Levels(props: any) {
  let { path, url } = useRouteMatch();

  return (
    <div>
      <Switch>
        <Route exact path={path}>
          <div className="training-buttons">
          <h3>Please select a level.</h3>
            <Link to={`${url}/easy`}>Easy</Link>
            <Link to={`${url}/medium`}>Medium</Link>
            <Link to={`${url}/hard`}>Hard</Link>
          </div>
        </Route>
        <Route path={`${path}/:level`}>
          <Staff reset={true} clef={props.clef} />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
