import { useEffect, useState, useRef } from "react";
import WebMidi, { InputEventNoteon } from "webmidi";
import { /*randomSort,*/ getNoteValue, INote } from "./../../services/NoteService/Note.service";
import {
  updateNotes,
  updateVoice,
  buildBassOrTrebleStaff,
  resetStaff,
  VF,
  Clef,
  buildGrandStaff,
  renderGrandStaff,
  determineStaffIndex,
  resetNoteValidation,
} from "./../../services/StaffService/Staff.service";
import { useParams } from "react-router-dom";
import "./Staff.css";
import { usePrevious } from "../../hooks/usePreviousHook";
import { LevelType } from "./../../types/levelType";
import { RESET_NOTE } from "./../../types/constants";
import { StaffConfig } from "../../types/staffConfig";

const canEnableMidi = navigator.userAgent.indexOf("Chrome") !== -1;

interface StaffProps {
  width: number;
  rendererWidth: number;
  numNotes: number;
  initialClef: Clef;
  numMeasures: number;
  rendererHeight?: number;
}

export const Staff = ({ width, numNotes, initialClef, numMeasures, rendererWidth, rendererHeight }: StaffProps) => {
  const [note, setNote] = useState<string>("");
  const [hideButtons, setHideButtons] = useState<boolean>(false);
  const [clefType, setClefType] = useState<Clef>(initialClef === Clef.Grand ? Clef.Treble : initialClef);
  let { level, chord } = useParams<LevelType>();
  const notesPerMeasure = initialClef === Clef.Grand ? numNotes : numNotes / numMeasures;
  const [staffConfig, setStaffConfig] = useState<StaffConfig[]>(
    initialClef === Clef.Grand
      ? buildGrandStaff(width, level, numNotes, chord)
      : buildBassOrTrebleStaff(width, level, notesPerMeasure, clefType, numMeasures)
  );
  const staffRef = useRef(null);
  const timeSignature = `${notesPerMeasure}/4`;
  const previousNote = usePrevious(note);
  const currentStaffIndex = determineStaffIndex(level, note, staffConfig, initialClef);

  //This is just initializing
  useEffect(() => {
    const renderer = new VF.Renderer(staffRef.current!, VF.Renderer.Backends.SVG);
    renderer.resize(rendererWidth, rendererHeight ?? 300);
    const context = renderer.getContext();
    staffConfig.forEach(({ staff }: StaffConfig, i: number) => {
      if (i === 0) {
        staff.addClef(clefType).addTimeSignature(timeSignature);
      }
      if (i === 2 && initialClef === Clef.Grand) {
        staff.addClef(Clef.Bass).addTimeSignature(timeSignature);
        renderGrandStaff(context, staffConfig);
      }
      staff.setContext(context).draw();
    });
    
    updateVoice(staffConfig, level, initialClef);
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (canEnableMidi) {
      WebMidi.enable(function (err) {
        if (err) {
          console.log("WebMidi could not be enabled.", err);
        } else {
          const midiInput = WebMidi.getInputByName("Roland Digital Piano");
          if (midiInput) {
            midiInput.addListener("noteon", "all", function (e: InputEventNoteon) {
              const noteValue = e.note.name + e.note.octave;
              setNote(noteValue);
              console.log(`Received: "${noteValue}"`);
            });
          }
          console.log("WebMidi enabled!", WebMidi.inputs);
        }
      });
    }

    if (canEnableMidi) {
      return () => {
        WebMidi.disable();
      };
    }
  }, []);

  //Updates the staff when a note is sent
  useEffect(() => {
    if (note === RESET_NOTE) {
      const newConfig = resetStaff(
        initialClef === Clef.Grand ? initialClef : clefType,
        staffConfig,
        width,
        notesPerMeasure,
        level,
        timeSignature,
        numMeasures,
        chord
      );
      setStaffConfig(newConfig);
    }
    if (note !== "" && note !== previousNote && note !== RESET_NOTE) {
      const currentStaff = staffConfig[currentStaffIndex];
      const isCorrect = updateNotes(currentStaff, note);

      if (isCorrect) {
        //Reset note validation
        if (staffConfig.every((measure) => measure.currentStaffNoteIndex === notesPerMeasure)) {
          const newConfig = resetNoteValidation(
            staffConfig,
            notesPerMeasure,
            initialClef,
            clefType,
            width,
            level,
            timeSignature,
            numMeasures,
            chord
          );

          setStaffConfig(newConfig);
        }
      }
      updateVoice(staffConfig, level, initialClef);
      setNote(""); //Clear note for next note
    }
  }, [
    note,
    staffConfig,
    clefType,
    level,
    numNotes,
    width,
    timeSignature,
    previousNote,
    numMeasures,
    notesPerMeasure,
    initialClef,
    currentStaffIndex,
    chord,
  ]);

  return (
    <div className="all-staff">
      <div ref={staffRef} />
      <div className="staff-buttons">
        {
          !hideButtons &&
            staffConfig.map((staff: StaffConfig) =>
              staff.playableNotes.map((x: INote, i: number) => (
                <button key={i} onClick={() => setNote(getNoteValue(x.name.toLocaleLowerCase()).toUpperCase())}>
                  Send {x.name}
                </button>
              ))
            )
          // .sort(randomSort)
        }
        <hr />
        <button
          onClick={() => {
            setNote(RESET_NOTE);
          }}
        >
          Reset
        </button>
        {initialClef !== Clef.Grand && <button
          onClick={() => {
            clefType === Clef.Bass ? setClefType(Clef.Treble) : setClefType(Clef.Bass);
            setNote(RESET_NOTE);
          }}
        >
          Change Clef
        </button>}
        <button
          onClick={() => {
            setHideButtons(!hideButtons);
          }}
        >
          {`${!hideButtons ? "Piano" : "Manual"} Mode`}
        </button>
      </div>
    </div>
  );
};

export default Staff;
