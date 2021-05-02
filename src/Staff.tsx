import Vex from 'vexflow'

const VF = Vex.Flow;
const G3 = new VF.StaveNote({ clef: "bass", keys: ["g/3"], duration: "q" });
const E3 = new VF.StaveNote({ clef: "bass", keys: ["e/3"], duration: "q" });
const C3 = new VF.StaveNote({ clef: "bass", keys: ["c/3"], duration: "q" });
const A2 = new VF.StaveNote({ clef: "bass", keys: ["a/2"], duration: "q" });
var staff: Vex.Flow.Stave;
var currentNoteIndex = 0;

export const Staff = () => {
    var div = document.getElementById("staff")!;
    var renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);
    renderer.resize(500, 500);
    var context = renderer.getContext();
    var stave = new VF.Stave(10, 40, 400);
    stave.addClef("bass").addTimeSignature("4/4");
    stave.setContext(context).draw();
    staff = stave;
    updateStaff("");
}

export const updateStaff = (note: string) => {
    var notes = [
        A2,
        C3,
        E3,
        G3,
    ];

    var red = { fillStyle: "#cc0000", strokeStyle: "#cc0000" };
    var green = { fillStyle: "#00cc00", strokeStyle: "#00cc00" };
    var black = { fillStyle: "#000000", strokeStyle: "#000000" };

    if (note !== "") {
        if (currentNoteIndex == 0) {
            if (note === "A2") {
                //   noteState[currentNoteIndex].isComplete = true;
                notes[0].setStyle(green);
                currentNoteIndex++;
            } else {
                notes[0].setStyle(red);
            }
        }

        else if (currentNoteIndex == 1) {

            if (note === "C3") {
                //   noteState[currentNoteIndex].isComplete = true;
                notes[1].setStyle(green);
                currentNoteIndex++;

            } else {
                notes[1].setStyle(red);
            }
        }
        else if (currentNoteIndex == 2) {

            if (note === "E3") {
                //   noteState[currentNoteIndex].isComplete = true;
                notes[2].setStyle(green);
                currentNoteIndex++;

            } else {
                notes[2].setStyle(red);
            }
        }
        else if (currentNoteIndex == 3) {


            if (note === "G3") {
                //   noteState[currentNoteIndex].isComplete = true;
                notes[3].setStyle(green);
                currentNoteIndex++;

            } else {
                notes[3].setStyle(red);
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