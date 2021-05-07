import { INote } from './Note.service';
import Vex from 'vexflow';

const VF = Vex.Flow;

export interface StaffConfig {
    staff: Vex.Flow.Stave;
    currentNoteIndex: number;
    numNotes: number;
    playableNotes: INote[];
    notes: Vex.Flow.StaveNote[];
}

var red = { fillStyle: "#cc0000", strokeStyle: "#cc0000" };
var green = { fillStyle: "#00cc00", strokeStyle: "#00cc00" };

export const initVoice = (notes: Vex.Flow.StaveNote[], staff: Vex.Flow.Stave) => {
    var voice = new VF.Voice({ num_beats: 4, beat_value: 4 });
    voice.addTickables(notes);
    // Format and justify the notes to 400 pixels.
    new VF.Formatter().joinVoices([voice]).format([voice], 400);
    voice.draw(staff.getContext(), staff);
}

export const updateNotes = ({playableNotes, currentNoteIndex, numNotes, notes}: StaffConfig, note: string): boolean => {
    var currentNoteToPlay: INote = playableNotes[currentNoteIndex];

    if (currentNoteIndex < numNotes && currentNoteIndex === currentNoteToPlay.order) {
        if (note === currentNoteToPlay.name) {
            notes[currentNoteIndex].setStyle(green);
            return true;
        } else {
            notes[currentNoteIndex].setStyle(red);
        }
    }

    return false;
}