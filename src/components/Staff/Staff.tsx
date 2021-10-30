import { useEffect, useState, useRef } from "react";
import WebMidi, { InputEventNoteon } from "webmidi";
import { /*randomSort,*/ INote } from "./../../services/NoteService/Note.service";
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
  black,
} from "./../../services/StaffService/Staff.service";
import { useParams } from "react-router-dom";
import "./Staff.css";
import { usePrevious } from "../../hooks/usePreviousHook";
import { LevelType } from "./../../types/levelType";
import { RESET_NOTE, SCALE_LEVELS } from "./../../types/constants";
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
  let { level } = useParams<LevelType>();
  const notesPerMeasure = initialClef === Clef.Grand ? numNotes : numNotes / numMeasures;
  const [staffConfig, setStaffConfig] = useState<StaffConfig[]>(
    initialClef === Clef.Grand
      ? buildGrandStaff(width, level, numNotes)
      : buildBassOrTrebleStaff(width, level, notesPerMeasure, clefType, numMeasures)
  );
  const staffRef = useRef(null);
  const timeSignature = `${notesPerMeasure}/4`;
  const previousNote = usePrevious(note);

  const currentStaffIndex = determineStaffIndex(level, +note.substr(1, 1), staffConfig);

  //This is just initializing
  useEffect(() => {
    const renderer = new VF.Renderer(staffRef.current!, VF.Renderer.Backends.SVG);
    renderer.resize(rendererWidth, rendererHeight ?? 300);
    const context = renderer.getContext();
    staffConfig.forEach(({ staff }: StaffConfig, i: number) => {
      if (i === 0) {
        staff.addClef(clefType).addTimeSignature(timeSignature);
      }
      if (i === 1 && initialClef === Clef.Grand) {
        staff.addClef(Clef.Bass).addTimeSignature(timeSignature);
        renderGrandStaff(context, staffConfig);
      }
      staff.setContext(context).draw();
    });

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
    // eslint-disable-next-line
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
        numMeasures
      );
      setStaffConfig(newConfig);
      updateVoice(newConfig);
      setNote("");
      return;
    }
    if (note !== "" && note !== previousNote) {
      const currentStaff = staffConfig[currentStaffIndex];
      const isCorrect = updateNotes(currentStaff, note);

      if (isCorrect) {
        currentStaff.currentStaffNoteIndex += 1;
        const firstMeasure = staffConfig[0];
        const secondMeasure = staffConfig?.[1];
        const firstMeasureComplete = firstMeasure.currentStaffNoteIndex === notesPerMeasure;
        //Reset note validation
        if (
          (numMeasures === 1 && firstMeasureComplete) ||
          (firstMeasureComplete && secondMeasure.currentStaffNoteIndex === notesPerMeasure)
        ) {
          const newConfig = resetStaff(
            initialClef === Clef.Grand ? initialClef : clefType,
            staffConfig,
            width,
            notesPerMeasure,
            level,
            timeSignature,
            numMeasures,
            SCALE_LEVELS.includes(level)
              ? [firstMeasure.playableNotes.concat(secondMeasure?.playableNotes)]
              : [firstMeasure.playableNotes, secondMeasure?.playableNotes]
          );
          const notes = [
            ...firstMeasure.playableNotes.map((x) => x.note),
            ...(secondMeasure?.playableNotes?.map((x) => x.note) ?? []),
          ];
          notes.forEach((note) => note.setStyle(black));
          setStaffConfig(newConfig);
          updateVoice(staffConfig);
          setNote(""); //Clear note for next note
          return;
        }
      }
      setNote(""); //Clear note for next note
    }
    updateVoice(staffConfig);
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
  ]);

  return (
    <div className="all-staff">
      <div ref={staffRef} />
      <div className="staff-buttons">
        {
          !hideButtons &&
            staffConfig.map((staff: StaffConfig) =>
              staff.playableNotes.map((x: INote, i: number) => (
                <button key={i} onClick={() => setNote(x.name)}>
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
        <button
          onClick={() => {
            clefType === Clef.Bass ? setClefType(Clef.Treble) : setClefType(Clef.Bass);
            setNote(RESET_NOTE);
          }}
        >
          Change Clef
        </button>
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
