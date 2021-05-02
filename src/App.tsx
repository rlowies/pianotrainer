import './App.css';
import WebMidi, { InputEventNoteon } from 'webmidi';
import React, { useEffect, useState } from 'react';
import * as StaffService from './Staff';


function App() {
  const [note, setNote] = useState<string>("");

  useEffect(() => {
    StaffService.Staff();
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

  useEffect(() => {
    StaffService.updateStaff(note);
    setNote(""); //Clear state to register for next note if correct
  }, [note])


  return (
    <>
      <div className="App">
        <div id='staff' />
        <button onClick={() => setNote("A2")}> Send A2</button>
        <button onClick={() => setNote("C3")}> Send C3</button>
        <button onClick={() => setNote("E3")}> Send E3</button>
        <button onClick={() => setNote("G3")}> Send G3</button>

      </div>
    </>
  );
}

export default App;
