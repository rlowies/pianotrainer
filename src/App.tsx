import './App.css';
import Staff from './components/Staff';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch
} from 'react-router-dom';
import { generateNotes } from './services/Note.service';
import {staffX, staffY} from './services/Staff.service';
import Vex from 'vexflow';

function App() {
  return (
    <Router>
      <div>
        <div className="navbar">
          <Link to="/">Home</Link>
          <Link to="/noteTraining">Note Training</Link>
          <Link to="/warmup/warmup">Warm up</Link>
        </div>
        <Switch>
          <Route path="/noteTraining">
            <NoteTraining />
          </Route>
          <Route path="/warmup/:level">
            <Staff clef={"treble"} initialStaffConfig={{
              staff: new Vex.Flow.Stave(staffX, staffY, 500),
              currentNoteIndex: 0,
              playableNotes: generateNotes(false, 16, "treble", "warmup"),
            }} />
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
          <Staff reset={true} clef={props.clef} initialStaffConfig={{
            staff: new Vex.Flow.Stave(staffX, staffY, 400),
            currentNoteIndex: 0,
            playableNotes: generateNotes(false, 4, "bass", "easy"),
          }} />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
