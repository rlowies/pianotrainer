import { useEffect, useState } from 'react';
import WebMidi, { InputEventNoteon } from 'webmidi';
import Vex from 'vexflow';
import { bassClefEasy, bassClefMedium, generateNotes, INote, randomSort, trebleClefMedium } from '../services/Note.service';
import * as StaffService from '../services/Staff.service';
import { StaffConfig } from '../services/Staff.service';

const VF = Vex.Flow;
const initialNotes: INote[] = generateNotes(bassClefEasy, false, 4, "bass");

const initialStaffConfig: StaffConfig = {
    staff: new Vex.Flow.Stave(10, 40, 400),
    currentNoteIndex: 0,
    numNotes: 4,
    playableNotes: initialNotes,
    notes: initialNotes.map(x => x.note),
}

export default function Staff() {
    const [note, setNote] = useState<string>("");
    const [init, setInit] = useState<boolean>(false);
    const [hideButtons, setHideButtons] = useState<boolean>(false);
    const [staffConfig, setStaffConfig] = useState<StaffConfig>(initialStaffConfig);
    const [clefType, setClefType] = useState<string>("bass");

    useEffect(() => {
        var { staff, notes } = staffConfig;

        const resetStaff = (type: string, config: StaffConfig) => {
            config.playableNotes = generateNotes(type === "bass" ? bassClefMedium : trebleClefMedium, true, 4, clefType);
            config.notes = config.playableNotes.map(x => x.note);
            config.staff = new Vex.Flow.Stave(10, 40, 400);
            staff.getContext().clear();
            config.staff.addClef(type).addTimeSignature("4/4");
            config.staff.setContext(staff.getContext()).draw();
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
            renderer.resize(500, 500);
            var context = renderer.getContext();
            staff.addClef(clefType).addTimeSignature("4/4");
            staff.setContext(context).draw();

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
    }, [note, init, staffConfig, clefType])

    return (
        <>
            <div id='staff' />
            {hideButtons && staffConfig.playableNotes.map((x: INote, i: number) => <button key={i} onClick={() => setNote(x.name)}> Send {x.name}</button>).sort(randomSort)}
            <hr/>
            <button onClick={() => { setNote("C8") }}> Reset</button>
            <button onClick={() => {
                clefType === "bass" ? setClefType("treble") : setClefType("bass");
                setNote("C8");
            }}> Change Clef</button>
            <button onClick={() => { setHideButtons(!hideButtons); }}> Piano Mode</button>
        </>
    );

}
