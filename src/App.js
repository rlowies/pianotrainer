import './App.css';
import WebMidi from 'webmidi';
import React, { useEffect, useState } from 'react';

function App() {
  // const [isMidiEnabled, setIsMidiEnabled] = useState(false);
  // const [input, setInput] = useState();
  useEffect(() => {
    WebMidi.enable(function (err) {

      if (err) {
        console.log("WebMidi could not be enabled.", err);
      } else {
        // setIsMidiEnabled(true);
        var midiInput = WebMidi.getInputByName("Roland Digital Piano");
        midiInput.addListener('noteon', "all", function (e) {
          console.log("Received 'noteon' message (" + e.note.name + e.note.octave + ").")
        });
        console.log("WebMidi enabled!", WebMidi.inputs);
        // setInput(midiInput);
      }

    });
  }, [])



  return (
    <>
      <div className="App">
      </div>
    </>
  );
}



export default App;
