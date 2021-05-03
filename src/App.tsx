import './App.css';
import WebMidi, { InputEventNoteon } from 'webmidi';
import { useEffect, useState } from 'react';
import * as StaffService from './services/Staff.service';
import { bassClefEasy, generateNotes, INote, playableNotes, randomSort } from './services/Note.service';


function App() {
  const [note, setNote] = useState<string>("");

  useEffect(() => {
    StaffService.Initialize(generateNotes(bassClefEasy, true, 4));

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
    setNote("init"); 
    });
  }, [])

  useEffect(() => {
    StaffService.updateStaff(note);
    setNote(""); //Clear state to register for next note if correct
  }, [note])


  return (
    <>
      <div className="App">
        <div id='staff' />
        {playableNotes.map(x => <button onClick={() => setNote(x)}> Send {x}</button>).sort(randomSort)}
        <button onClick={() => { setNote("C8") }}> Reset</button>
      </div>
    </>
  );
}

export default App;
