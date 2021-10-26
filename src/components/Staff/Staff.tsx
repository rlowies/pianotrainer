import { useEffect, useState, useRef } from 'react';
import WebMidi, { InputEventNoteon } from 'webmidi';
import { randomSort, INote } from './../../services/NoteService/Note.service'
import { updateNotes, updateVoice, StaffConfig, getMeasures, resetStaff, VF, Clef, getBassAndTrebleClef, renderGrandStaff } from './../../services/StaffService/Staff.service';
import { useParams } from 'react-router-dom';
import './Staff.css'
import { usePrevious } from '../../hooks/usePreviousHook';
import { LevelType } from './../../types/levelType';
import { RESET_NOTE } from './../../types/constants';
import { StaffMeasure } from '../../types/staffMeasure';

const canEnableMidi = navigator.userAgent.indexOf("Chrome") !== -1;

interface StaffProps {
    width: number;
    rendererWidth: number;
    numNotes: number;
    initialClef: Clef;
    numMeasures: number;
    rendererHeight?: number;
}

export const Staff = ({
    width,
    numNotes,
    initialClef,
    numMeasures,
    rendererWidth,
    rendererHeight
}: StaffProps) => {
    const [note, setNote] = useState<string>("");
    const [hideButtons, setHideButtons] = useState<boolean>(false);
    const [clefType, setClefType] = useState<Clef>(initialClef === Clef.Grand ? Clef.Treble : initialClef);
    let { level } = useParams<LevelType>();
    const [staffConfig, setStaffConfig] = useState<StaffConfig>({
        staffs: initialClef === Clef.Grand
            ? getBassAndTrebleClef(width, level, numNotes)
            : getMeasures(width, level, numNotes, clefType, numMeasures),
        currentNoteIndex: 0,
    });
    const staffRef = useRef(null);
    var { staffs } = staffConfig;
    const notesPerMeasure = numNotes / numMeasures;
    const timeSignature = `${initialClef === Clef.Grand ? numNotes : notesPerMeasure}/4`;
    const previousNote = usePrevious(note);

    //This is just initializing
    useEffect(() => {
        var renderer = new VF.Renderer(staffRef.current!, VF.Renderer.Backends.SVG);
        renderer.resize(rendererWidth, rendererHeight ?? 300);
        var context = renderer.getContext();
        staffs.forEach(({ staff }: StaffMeasure, i: number) => {
            if (i === 0) {
                staff.addClef(clefType).addTimeSignature(timeSignature);
            }
            if (i === 1 && initialClef === Clef.Grand) {
                staff.addClef(Clef.Bass).addTimeSignature(timeSignature);
                renderGrandStaff(context, staffs);
            }
            staff.setContext(context).draw();
        });


        if (canEnableMidi) {
            WebMidi.enable(function (err) {
                if (err) {
                    console.log("WebMidi could not be enabled.", err);
                } else {
                    var midiInput = WebMidi.getInputByName("Roland Digital Piano");
                    if (midiInput) {
                        midiInput.addListener('noteon', "all", function (e: InputEventNoteon) {
                            var noteValue = e.note.name + e.note.octave;
                            setNote(noteValue);
                            console.log(`Received: "${noteValue}"`)
                        });
                    }
                    console.log("WebMidi enabled!", WebMidi.inputs);
                }
            });
        }

        if (canEnableMidi) {
            return () => {
                WebMidi.disable()
            }
        }
        // eslint-disable-next-line 
    }, [])

    //Updates the staff when a note is sent
    useEffect(() => {
        if (note === RESET_NOTE) {
            const newConfig = resetStaff(initialClef === Clef.Grand ? initialClef : clefType, staffConfig, width, numNotes, level, timeSignature, numMeasures)
            setStaffConfig(newConfig)
            updateVoice(newConfig);
            setNote("");
            return;
        }
        if (note !== "" && note !== previousNote) {
            let currentStaffIndex = 0;
            let isCorrect = false;
            if (initialClef !== Clef.Grand) {
                if (numMeasures > 1) {
                    currentStaffIndex = staffConfig.currentNoteIndex >= notesPerMeasure ? 1 : 0;
                }
                isCorrect = updateNotes(staffConfig.staffs[currentStaffIndex].playableNotes, staffConfig.currentNoteIndex % notesPerMeasure, note);
            } else {
                const currentOctave = +note.substr(1, 1);
                const currentStaff = staffConfig.staffs[currentOctave >= 4 ? 0 : 1];
                isCorrect = updateNotes(currentStaff.playableNotes, currentStaff.currentStaffNoteIndex, note)

                if (isCorrect) {
                    currentStaff.currentStaffNoteIndex += 1;
                }
            }

            if (isCorrect) {
                setStaffConfig({ ...staffConfig, currentNoteIndex: staffConfig.currentNoteIndex + 1 })
            }
            setNote(""); //Clear note for next note
        }
        updateVoice(staffConfig);
    }, [note, staffConfig, clefType, level, numNotes, width, timeSignature, previousNote, numMeasures, notesPerMeasure, initialClef])

    return (
        <div className="all-staff">
            <div ref={staffRef} />
            <div className="staff-buttons">
                {!hideButtons &&

                    staffConfig.staffs.map((staff: StaffMeasure) => staff.playableNotes.map((x: INote, i: number) =>
                        <button
                            key={i}
                            onClick={() => setNote(x.name)}> Send {x.name}
                        </button>
                    ))
                    // .sort(randomSort)
                }
                <hr />
                <button onClick={() => { setNote(RESET_NOTE) }}> Reset</button>
                <button onClick={() => {
                    clefType === Clef.Bass ? setClefType(Clef.Treble) : setClefType(Clef.Bass);
                    setNote(RESET_NOTE);
                }}> Change Clef</button>
                <button onClick={() => { setHideButtons(!hideButtons); }}> {`${!hideButtons ? "Piano" : "Manual"} Mode`}</button>
            </div>
        </div>
    );
}

export default Staff;