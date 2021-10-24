import './App.css';
import Staff from './components/Staff/Staff';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch
} from 'react-router-dom';
import { Clef } from './services/StaffService/Staff.service';
import { Level } from './types/levelType';

function App() {
  return (
    <Router>
        <div className="navbar">
          <Link to="/">Home</Link>
          <Link to="/noteTraining">Note Training</Link>
          <Link to={`/warmup/${Level.Warmup}`}>Warm up</Link>
        </div>
        <Switch>
          <Route path="/noteTraining">
            <NoteTraining />
          </Route>
          <Route path="/warmup/:level">
            <Staff
              clef={Clef.Treble}
              width={500}
              numNotes={16} />
          </Route>
          <Route path="/">
            Home
          </Route>
        </Switch>
    </Router>
  );
}

function NoteTraining() {
  let { url } = useRouteMatch();

  return (
    <Router>
        <div className="training-buttons">
          <Link to={`${url}/${Clef.Treble}`}>Treble</Link>
          <Link to={`${url}/${Clef.Bass}`}>Bass</Link>
        </div>
        <Switch>
          <Route path={`${url}/${Clef.Treble}`}>
            <Levels clef={Clef.Treble} />
          </Route>
          <Route path={`${url}/${Clef.Bass}`}>
            <Levels clef={Clef.Bass} />
          </Route>
        </Switch>
    </Router>
  );

}

function Levels(props: {clef: Clef}) {
  let { path, url } = useRouteMatch();

  return (
    <div>
      <Switch>
        <Route exact path={path}>
          <div className="training-buttons">
            <h3>Please select a level.</h3>
            <Link to={`${url}/${Level.Easy}`}>Easy</Link>
            <Link to={`${url}/${Level.Medium}`}>Medium</Link>
            <Link to={`${url}/${Level.Hard}`}>Hard</Link>
          </div>
        </Route>
        <Route path={`${path}/:level`}>
          <Staff
            clef={props.clef}
            width={400}
            numNotes={4} />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
