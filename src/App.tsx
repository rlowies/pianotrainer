import "./App.css";
import Staff from "./components/Staff/Staff";
import { BrowserRouter as Router, Switch, Route, Link, useRouteMatch } from "react-router-dom";
import { Clef } from "./services/StaffService/Staff.service";
import { Level } from "./types/levelType";

function App() {
  return (
    <Router>
      <div className="navbar">
        <Link to="/">Home</Link>
        <Link to="/noteTraining">Note Training</Link>
        <Link to={`/warmup/${Level.Warmup}`}>Warm up</Link>
        <Link to="/scales">Scales</Link>
        <Link to={`/grand/${Level.Chord}`}>Grand Chord</Link>
      </div>
      <Switch>
        <Route path="/noteTraining">
          <NoteTraining />
        </Route>
        <Route
          path="/warmup/:level"
          component={() => <Staff initialClef={Clef.Treble} width={500} numNotes={16} numMeasures={1} rendererWidth={550} />}
        ></Route>
        <Route path="/scales">
          <ScaleTraining />
        </Route>
        <Route path="/grand/:level" component={() => <ChordTraining />}></Route>
        <Route path="/">Home</Route>
      </Switch>
    </Router>
  );
}

const GrandStaff = () => (
  <Staff initialClef={Clef.Grand} width={400} numNotes={8} numMeasures={4} rendererWidth={850} rendererHeight={500} />
);

const NoteTraining = () => {
  let { url } = useRouteMatch();

  return (
    <>
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
    </>
  );
};

const ChordTraining = () => {
  let { url, path } = useRouteMatch();
  return (
    <Switch>
      <Route
        exact
        path={path}
        component={() => (
          <>
            <div className="training-buttons">
              <ScaleLinks url={url} />
            </div>
          </>
        )}
      ></Route>
      <Route exact path={`${path}/:chord`} component={() => <GrandStaff />}></Route>
    </Switch>
  );
};

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
          <Staff initialClef={props.clef} width={400} rendererWidth={450} numNotes={4} numMeasures={1} />
        </Route>
      </Switch>
    </div>
  );
}

const ScaleTraining = () => {
  let { url } = useRouteMatch();

  return (
    <>
      <div className="training-buttons">
        <Link to={`${url}/${Clef.Treble}`}>Treble</Link>
        <Link to={`${url}/${Clef.Bass}`}>Bass</Link>
        <Link to={`${url}/${Clef.Grand}`}>Grand</Link>
      </div>
      <Switch>
        <Route path={`${url}/${Clef.Treble}`}>
          <Scales clef={Clef.Treble} />
        </Route>
        <Route path={`${url}/${Clef.Bass}`}>
          <Scales clef={Clef.Bass} />
        </Route>
        <Route path={`${url}/${Clef.Grand}`}>
          <Scales clef={Clef.Grand} />
        </Route>
      </Switch>
    </>
  );
};

function Scales(props: { clef: Clef }) {
  let { path, url } = useRouteMatch();
  const { clef } = props;

  return (
    <div>
      <Switch>
        <Route exact path={path}>
          <div className="training-buttons">
            <h3>Please select a level.</h3>
            <ScaleLinks url={url} />
          </div>
        </Route>
        <Route path={`${path}/:level`}>
          {clef === Clef.Grand ? (
            <GrandStaff />
          ) : (
            <Staff initialClef={clef} width={350} rendererWidth={800} numNotes={16} numMeasures={2} />
          )}
        </Route>
      </Switch>
    </div>
  );
}

const ScaleLinks = (props: { url: string }) => {
  const { url } = props;

  return (
    <>
      <Link to={`${url}/${Level.C_Major}`}>C Major</Link>
      <Link to={`${url}/${Level.G_Major}`}>G Major</Link>
      <Link to={`${url}/${Level.D_Major}`}>D Major</Link>
      <Link to={`${url}/${Level.A_Major}`}>A Major</Link>
      <Link to={`${url}/${Level.E_Major}`}>E Major</Link>
      <Link to={`${url}/${Level.B_Major}`}>B Major</Link>
      <Link to={`${url}/${Level.F_Sharp_Major}`}>F# Major</Link>
      <Link to={`${url}/${Level.G_Flat_Major}`}>Gb Major</Link>
      <Link to={`${url}/${Level.D_Flat_Major}`}>Db Major</Link>
      <Link to={`${url}/${Level.C_Sharp_Major}`}>C# Major</Link>
      <Link to={`${url}/${Level.A_Flat_Major}`}>Ab Major</Link>
      <Link to={`${url}/${Level.E_Flat_Major}`}>Eb Major</Link>
      <Link to={`${url}/${Level.B_Flat_Major}`}>Bb Major</Link>
      <Link to={`${url}/${Level.F_Major}`}>F Major</Link>
    </>
  );
};

export default App;
