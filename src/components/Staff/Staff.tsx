import { useEffect, useState, useRef } from 'react';
import WebMidi, { InputEventNoteon } from 'webmidi';
import { generateNotes, randomSort, INote } from './../../services/NoteService/Note.service'
import { updateNotes, updateVoice, StaffConfig, staffX, staffY, resetStaff, VF, Clef } from './../../services/StaffService/Staff.service';
import { useParams } from 'react-router-dom';
import './Staff.css'
import { usePrevious } from '../../hooks/usePreviousHook';
import { Level, LevelType } from './../../types/levelType';
import { RESET_NOTE } from './../../types/constants';

const canEnableMidi = navigator.userAgent.indexOf("Chrome") !== -1;

interface StaffProps {
    width: number;
    numNotes: number;
    clef: Clef;
}

export const Staff = ({ width, numNotes, clef }: StaffProps) => {
    const [note, setNote] = useState<string>("");
    const [hideButtons, setHideButtons] = useState<boolean>(false);
    const [clefType, setClefType] = useState<Clef>(clef);
    let { level } = useParams<LevelType>();
    const [staffConfig, setStaffConfig] = useState<StaffConfig>({
        staff: new VF.Stave(staffX, staffY, width),
        currentNoteIndex: 0,
        playableNotes: generateNotes(level !== Level.Warmup, numNotes, clef, level)
    });
    const staffRef = useRef(null);
    var { staff } = staffConfig;
    const timeSignature = `${numNotes}/4`;
    const previousNote = usePrevious(note);

    //This is just initializing
    useEffect(() => {
        var renderer = new VF.Renderer(staffRef.current!, VF.Renderer.Backends.SVG);
        renderer.resize(width + 50, 300);
        var context = renderer.getContext();
        staff.addClef(clefType).addTimeSignature(timeSignature);
        staff.setContext(context).draw();

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
            const newConfig = resetStaff(clefType, staffConfig, width, numNotes, level, timeSignature)
            setStaffConfig(newConfig)
            updateVoice(newConfig);
            setNote("");
            return;
        }
        if (note !== "" && note !== previousNote) {
            var isCorrect = updateNotes(staffConfig, note);
            if (isCorrect) {
                setStaffConfig({ ...staffConfig, currentNoteIndex: staffConfig.currentNoteIndex + 1 })
            }
        }
        updateVoice(staffConfig);
    }, [note, staffConfig, clefType, level, numNotes, width, timeSignature, previousNote])

    return (
        <div className="all-staff">
            <div ref={staffRef} />
            <div className="staff-buttons">
                {!hideButtons && staffConfig.playableNotes.map((x: INote, i: number) =>
                    <button
                        key={i}
                        onClick={() => setNote(x.name)}> Send {x.name}
                    </button>
                ).sort(randomSort)}
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