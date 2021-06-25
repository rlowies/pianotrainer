import { useEffect, useState } from 'react';
import WebMidi, { InputEventNoteon } from 'webmidi';
import Vex from 'vexflow';
import * as NoteService from '../services/Note.service'
import { INote } from '../services/Note.service';
import * as StaffService from '../services/Staff.service';
import { StaffConfig } from '../services/Staff.service';
import { useParams } from 'react-router-dom';
import './Staff.css'

const VF = Vex.Flow;
const initialNotes: INote[] = NoteService.generateNotes(false, 4, "bass", "easy");
const staffX = 10;
const staffY = 100;

const initialStaffConfig: StaffConfig = {
    staff: new Vex.Flow.Stave(staffX, staffY, 400),
    currentNoteIndex: 0,
    numNotes: 4,
    playableNotes: initialNotes,
    notes: initialNotes.map(x => x.note),
}

const canEnableMidi = navigator.userAgent.indexOf("Chrome") !== -1;

export default function Staff(props: any) {
    const [note, setNote] = useState<string>("");
    const [init, setInit] = useState<boolean>(false);
    const [hideButtons, setHideButtons] = useState<boolean>(false);
    const [staffConfig, setStaffConfig] = useState<StaffConfig>(initialStaffConfig);
    const [clefType, setClefType] = useState<string>("bass");
    let { level } = useParams<any>();

    useEffect(() => {
        var { staff, notes } = staffConfig;

        const resetStaff = (type: string, config: StaffConfig) => {
            config.playableNotes = NoteService.generateNotes(true, 4, clefType, level);
            config.notes = config.playableNotes.map(x => x.note);
            config.staff = new Vex.Flow.Stave(staffX, staffY, 400);
            var context = staff.getContext();
            context.clear();
            config.staff.addClef(type).addTimeSignature("4/4");
            config.staff.setContext(context).draw();
            config.currentNoteIndex = 0;
            setStaffConfig(config)
        }

        const updateStaff = () => {
            if (note !== "") {
                let staffConfigUpdate: StaffConfig = {
                    ...staffConfig
                }

                if (note === "C8") {
                    resetStaff(clefType, staffConfigUpdate)
                    return;
                }

                var isCorrect = StaffService.updateNotes(staffConfig, note);
                if (isCorrect) {
                    staffConfigUpdate.currentNoteIndex++;
                    setStaffConfig(staffConfigUpdate)
                }
            }
        }

        const Initialize = () => {
            var div = document.getElementById("staff")!;
            var renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);
            renderer.resize(420, 300);
            var context = renderer.getContext();
            staff.addClef(clefType).addTimeSignature("4/4");
            staff.setContext(context).draw();

            if(canEnableMidi) {
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
            StaffService.initVoice(notes, staff);
        }

        setNote("");
        updateStaff();
    }, [note, init, staffConfig, clefType, level])

    useEffect(() => {
        setClefType(props.clef);
        setNote("C8");
        if(canEnableMidi) {
            return () => {
                WebMidi.disable()
            }
        }
    }, [props])

    return (
        <>
            <div className="all-staff">
                <div id='staff' className="App" />
                <div className="staff-buttons">
                    {!hideButtons && staffConfig.playableNotes.map((x: INote, i: number) => <button key={i} onClick={() => setNote(x.name)}> Send {x.name}</button>).sort(NoteService.randomSort)}
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
