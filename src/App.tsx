import './App.css';
import WebMidi, { InputEventNoteon } from 'webmidi';
import { useEffect, useState } from 'react';

function App() {
  // const [isMidiEnabled, setIsMidiEnabled] = useState(false);
  // const [input, setInput] = useState();
  const [note, setNote] = useState<string>();
  useEffect(() => {
    WebMidi.enable(function (err) {

      if (err) {
        console.log("WebMidi could not be enabled.", err);
      } else {
        // setIsMidiEnabled(true);
        var midiInput = WebMidi.getInputByName("Roland Digital Piano");
        if(midiInput){
          
          midiInput.addListener('noteon', "all", function (e: InputEventNoteon) {
            var noteValue: string = e.note.name + e.note.octave; 
            console.log(`Received: "${noteValue}"`)
            setNote(noteValue);
          });
        }
        console.log("WebMidi enabled!", WebMidi.inputs);
        // setInput(midiInput);
      }

    });
  }, [])



  return (
    <>
      <div className="App">
        {note}
      </div>
    </>
  );
}



export default App;
