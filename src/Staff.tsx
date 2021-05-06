import { useEffect, useState } from 'react';
import Vex from 'vexflow';
import { bassClefEasy, bassClefMedium, generateNotes, INote, randomSort, trebleClefMedium } from './services/Note.service';

interface StaffConfig {
    VF: typeof Vex.Flow;
    staff: Vex.Flow.Stave;
    currentNoteIndex: number;
    numNotes: number;
}

const initialStaffConfig: StaffConfig = {
    VF: Vex.Flow,
    staff: new Vex.Flow.Stave(10, 40, 400),
    currentNoteIndex: 0,
    numNotes: 4,
}

export default function Staff(props: any) {
    const [note, setNote] = useState<string>("");
    const [init, setInit] = useState<boolean>(false);
    const [staffConfig, setStaffConfig] = useState<StaffConfig>(initialStaffConfig);
    const [clefType, setStaffType] = useState<string>("bass");
    const [playableNotes, setPlayableNotes] = useState<INote[]>(generateNotes(bassClefEasy, true, 4, clefType));
    const [notes, setNotes] = useState<Vex.Flow.StaveNote[]>(playableNotes.map(x => x.note));

    useEffect(() => {
        var { VF, staff, currentNoteIndex, numNotes } = staffConfig;

        const initVoice = () => {
            var voice = new VF.Voice({ num_beats: 4, beat_value: 4 });
            voice.addTickables(notes);
            // Format and justify the notes to 400 pixels.
            new VF.Formatter().joinVoices([voice]).format([voice], 400);
            voice.draw(staff.getContext(), staff);
        }

        const resetStaff = (type: string, config: StaffConfig) => {
            var newNotes = generateNotes(type === "bass" ? bassClefMedium : trebleClefMedium, true, 4, clefType);
            setPlayableNotes(newNotes);
            setNotes(newNotes.map(x => x.note));
            config.staff = new Vex.Flow.Stave(10, 40, 400);
            staff.getContext().clear();
            config.staff.addClef(type).addTimeSignature("4/4");
            config.staff.setContext(staff.getContext()).draw();
            config.currentNoteIndex = 0;
            setStaffConfig(config)
        }

        const updateStaff = () => {
            var red = { fillStyle: "#cc0000", strokeStyle: "#cc0000" };
            var green = { fillStyle: "#00cc00", strokeStyle: "#00cc00" };

            if (note !== "") {
                let staffConfigUpdate: StaffConfig = {
                    ...staffConfig
                }
                if (note === "C8") {
                    resetStaff(clefType, staffConfigUpdate)
                    return;
                }

                var currentNoteToPlay: INote = playableNotes[currentNoteIndex];

                if (currentNoteIndex < numNotes && currentNoteIndex === currentNoteToPlay.order) {
                    if (note === currentNoteToPlay.name) {
                        notes[currentNoteIndex].setStyle(green);
                        staffConfigUpdate.currentNoteIndex++;
                    } else {
                        notes[currentNoteIndex].setStyle(red);
                    }
                }
                setStaffConfig(staffConfigUpdate)
            }

            initVoice();
        }

        const Initialize = () => {
            var div = document.getElementById("staff")!;
            var renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);
            renderer.resize(500, 500);
            var context = renderer.getContext();
            staff.addClef(clefType).addTimeSignature("4/4");
            staff.setContext(context).draw();
            updateStaff();
            setInit(true);
        }

        if (!init) {
            Initialize();
        }
        setNote(props.note);
        updateStaff();
    }, [props.note, playableNotes, note, init, staffConfig, clefType, notes])

    return (
        <>
            <div id='staff' />
            {playableNotes.map((x: INote, i: number) => <button key={i} onClick={() => setNote(x.name)}> Send {x.name}</button>).sort(randomSort)}
            <button onClick={() => { setNote("C8") }}> Reset</button>
            <button onClick={() => {
                if (clefType === "bass") {
                    setStaffType("treble");
                }
                else {
                    setStaffType("bass");
                }
                setNote("C8");
            }
            }> Change Staff</button>
        </>
    );

}
