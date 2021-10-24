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
        <Link to ="/scales">Scales</Link>
      </div>
      <Switch>
        <Route path="/noteTraining">
          <NoteTraining />
        </Route>
        <Route path="/warmup/:level">
          <Staff
            clef={Clef.Treble}
            width={500}
            numNotes={16}
            numMeasures={1}
            rendererWidth={550}
          />
        </Route>
        <Route path="/scales">
          <ScaleTraining />
        </Route>
        <Route path="/">
          Home
        </Route>
      </Switch>
    </Router>
  );
}

const NoteTraining = () => {
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

function Levels(props: { clef: Clef }) {
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
            rendererWidth={450}
            numNotes={4} 
            numMeasures={1}
            />
        </Route>
      </Switch>
    </div>
  );
}

const ScaleTraining = () => {
  let { url } = useRouteMatch();

  return (
    <Router>
      <div className="training-buttons">
        <Link to={`${url}/${Clef.Treble}`}>Treble</Link>
        <Link to={`${url}/${Clef.Bass}`}>Bass</Link>
      </div>
      <Switch>
        <Route path={`${url}/${Clef.Treble}`}>
          <Scales clef={Clef.Treble} />
        </Route>
        <Route path={`${url}/${Clef.Bass}`}>
          <Scales clef={Clef.Bass} />
        </Route>
      </Switch>
    </Router>
  );

}

function Scales(props: { clef: Clef }) {
  let { path, url } = useRouteMatch();

  return (
    <div>
      <Switch>
        <Route exact path={path}>
          <div className="training-buttons">
            <h3>Please select a level.</h3>
            <Link to={`${url}/${Level.C_Major}`}>C Major</Link>
            <Link to={`${url}/${Level.G_Major}`}>G Major</Link> 
            <Link to={`${url}/${Level.D_Major}`}>D Major</Link> 
          </div>
        </Route>
        <Route path={`${path}/:level`}>
          <Staff
            clef={props.clef}
            width={350}
            rendererWidth={800}
            numNotes={8} 
            numMeasures={2}
            />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
