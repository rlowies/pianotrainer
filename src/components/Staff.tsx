import { useEffect, useState, useRef } from 'react';
import WebMidi, { InputEventNoteon } from 'webmidi';
import Vex from 'vexflow';
import { generateNotes, randomSort, INote } from '../services/Note.service'
import { updateNotes, initVoice, StaffConfig, staffX, staffY, resetStaff } from '../services/Staff.service';
import { useParams } from 'react-router-dom';
import './Staff.css'

const VF = Vex.Flow;
const canEnableMidi = navigator.userAgent.indexOf("Chrome") !== -1;

interface StaffProps {
    width: number;
    numNotes: number;
    clef: string;
}

export const Staff = ({width, numNotes, clef}: StaffProps) => {
    const [note, setNote] = useState<string>("");
    const [init, setInit] = useState<boolean>(false);
    const [hideButtons, setHideButtons] = useState<boolean>(false);
    const [clefType, setClefType] = useState<string>("treble");
    let { level } = useParams<any>();
    const [staffConfig, setStaffConfig] = useState<StaffConfig>({
        staff: new Vex.Flow.Stave(staffX, staffY, width),
        currentNoteIndex: 0,
        playableNotes: generateNotes(false, numNotes, clef, level)
    });
    const staffRef = useRef(null);

    useEffect(() => {
        const timeSignature = `${numNotes}/4`;
        var { staff, playableNotes } = staffConfig;

        const updateStaff = () => {
            if (note !== "") {
                if (note === "C8") {
                    const newConfig = resetStaff(clefType, staffConfig, width, numNotes, level, timeSignature)
                    setStaffConfig(newConfig)
                    return;
                }

                var isCorrect = updateNotes(staffConfig, note);
                if (isCorrect) {
                    setStaffConfig({ ...staffConfig, currentNoteIndex: staffConfig.currentNoteIndex + 1 })
                }
            }
        }

        const Initialize = () => {
            var renderer = new VF.Renderer(staffRef.current!, VF.Renderer.Backends.SVG);
            renderer.resize(staffConfig.staff.getWidth() + 50, 300);
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
            setInit(true);
        }

        if (!init) {
            Initialize();
        }

        if (note === "") {
            initVoice(playableNotes.map(x => x.note), staff);
        }

        setNote("");
        updateStaff();
    }, [note, init, staffConfig, clefType, level, numNotes, width])

    useEffect(() => {
        setClefType(clef);
        setNote("C8");
        if (canEnableMidi) {
            return () => {
                WebMidi.disable()
            }
        }
    }, [clef])

    return (
        <>
            <div className="all-staff">
                <div className="App" ref={staffRef} />
                <div className="staff-buttons">
                    {!hideButtons && staffConfig.playableNotes.map((x: INote, i: number) => <button key={i} onClick={() => setNote(x.name)}> Send {x.name}</button>).sort(randomSort)}
                    <hr />
                    <button onClick={() => { setNote("C8") }}> Reset</button>
                    <button onClick={() => {
                        clefType === "bass" ? setClefType("treble") : setClefType("bass");
                        setNote("C8");
                    }}> Change Clef</button>
                    <button onClick={() => { setHideButtons(!hideButtons); }}> {`${!hideButtons ? "Piano" : "Manual"} Mode`}</button>
                </div>
            </div>
        </>
    );
}

export default Staff;