import { useEffect, useState } from 'react';
import Vex from 'vexflow';
import { bassClefEasy, generateNotes, INote, randomSort } from './services/Note.service';

interface StaffConfig {
    VF: typeof Vex.Flow;
    staff: Vex.Flow.Stave;
    currentNoteIndex: number;
    noteConfig: INote;
    numNotes: number;
}

const initialStaffConfig: StaffConfig = {
    VF: Vex.Flow,
    staff: new Vex.Flow.Stave(10, 40, 400),
    currentNoteIndex: 0,
    noteConfig: {} as INote,
    numNotes: 4,
}

export default function Staff(props: any) {
    const [note, setNote] = useState<string>("");
    const [init, setInit] = useState<boolean>(false);
    const [playableNotes, setPlayableNotes] = useState<INote[]>(generateNotes(bassClefEasy, true, 4));
    const [staffConfig, setStaffConfig] = useState<StaffConfig>(initialStaffConfig);
    const [notes, setNotes] = useState<Vex.Flow.StaveNote[]>(playableNotes.map(x => x.note));

    useEffect(() => {
        var { VF, staff, currentNoteIndex, numNotes } = staffConfig;

        const updateStaff = () => {
            var red = { fillStyle: "#cc0000", strokeStyle: "#cc0000" };
            var green = { fillStyle: "#00cc00", strokeStyle: "#00cc00" };

            if (note !== "") {
                if (note === "C8") {
                    var newNotes = generateNotes(bassClefEasy, true, 4);
                    staff.getContext().clear();
                    staff.setContext(staff.getContext()).draw();

                    setPlayableNotes(newNotes);
                    setNotes(newNotes.map(x => x.note));
                    return;
                }

                let staffConfigUpdate: StaffConfig = {
                    ...staffConfig
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

            var voice = new VF.Voice({ num_beats: 4, beat_value: 4 });
            voice.addTickables(notes);
            // Format and justify the notes to 400 pixels.
            new VF.Formatter().joinVoices([voice]).format([voice], 400);
            voice.draw(staff.getContext(), staff);
        }

        const Initialize = () => {
            var div = document.getElementById("staff")!;
            var renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);
            renderer.resize(500, 500);
            var context = renderer.getContext();
            staff.addClef("bass").addTimeSignature("4/4");
            staff.setContext(context).draw();
            updateStaff();
            setInit(true);
        }

        if (!init) {
            Initialize();
        }
        setNote(props.note);
        updateStaff();
    }, [props.note, playableNotes, note, init, staffConfig])


    return (
        <>
            <div id='staff' />
            {playableNotes.map((x: INote, i: number) => <button key={i} onClick={() => setNote(x.name)}> Send {x.name}</button>).sort(randomSort)}
            <button onClick={() => { setNote("C8") }}> Reset</button>
        </>
    );

}
