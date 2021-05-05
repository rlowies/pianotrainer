import './App.css';
import WebMidi, { InputEventNoteon } from 'webmidi';
import { useEffect, useState } from 'react';
import Staff from './Staff';

function App() {
  const [note, setNote] = useState<string>("");

  useEffect(() => {
    WebMidi.enable(function (err) {
      if (err) {
        console.log("WebMidi could not be enabled.", err);
      } else {
        var midiInput = WebMidi.getInputByName("Roland Digital Piano");
        if (midiInput) {
          midiInput.addListener('noteon', "all", function (e: InputEventNoteon) {
            var noteValue: string = e.note.name + e.note.octave;
            console.log(`Received: "${noteValue}"`)
            setNote(noteValue);
          });
        }
        console.log("WebMidi enabled!", WebMidi.inputs);
      }
    });
  }, [])

  return (
    <>
      <div className="App">
        <Staff note={note} />
      </div>
    </>
  );
}

export default App;
