import Vex from 'vexflow';
import { INote, generateNotes, bassClefEasy } from './Note.service';

const VF = Vex.Flow;
var staff: Vex.Flow.Stave;
var currentNoteIndex = 0;
var notes: Vex.Flow.StaveNote[];
var noteConfig: INote[];
var numNotes = 4;

export const Initialize = (playableNotes: INote[]) => {
    var div = document.getElementById("staff")!;
    var renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);
    renderer.resize(500, 500);
    var context = renderer.getContext();
    var stave = new VF.Stave(10, 40, 400);
    stave.addClef("bass").addTimeSignature("4/4");
    stave.setContext(context).draw();
    staff = stave;
    noteConfig = playableNotes;
    notes = noteConfig.map(x => x.note);
    updateStaff("");
}

export const updateStaff = (note: string) => {

    var red = { fillStyle: "#cc0000", strokeStyle: "#cc0000" };
    var green = { fillStyle: "#00cc00", strokeStyle: "#00cc00" };
    var black = { fillStyle: "#000000", strokeStyle: "#000000" };

    if (note !== "") {
        if(note === "C8") {
            window.location.reload(true);
            return;
        }

        //Dirty hack for now
        if(note == "init") {
            notes[0].setStyle(black);
            return;
        }

        var currentNoteToPlay:INote = noteConfig[currentNoteIndex];

        if (currentNoteIndex == currentNoteToPlay.order) {
            if (note === currentNoteToPlay.name) {
                notes[currentNoteIndex].setStyle(green);
                currentNoteIndex++;
            } else {
                notes[currentNoteIndex].setStyle(red);
            }
        }
    } 

    var voice = new VF.Voice({ num_beats: 4, beat_value: 4 });
    voice.addTickables(notes);
    console.log("index", currentNoteIndex)
    // Format and justify the notes to 400 pixels.
    var formatter = new VF.Formatter().joinVoices([voice]).format([voice], 400);
    voice.draw(staff.getContext(), staff);
}