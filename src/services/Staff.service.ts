import { generateNotes, INote } from './Note.service';
import Vex from 'vexflow';

const VF = Vex.Flow;

export interface StaffConfig {
    staff: Vex.Flow.Stave;
    currentNoteIndex: number;
    playableNotes: INote[];
}

export const staffX = 10;
export const staffY = 100;

var red = { fillStyle: "#cc0000", strokeStyle: "#cc0000" };
var green = { fillStyle: "#00cc00", strokeStyle: "#00cc00" };

export const updateVoice = (
    notes: Vex.Flow.StaveNote[],
    staff: Vex.Flow.Stave
) => {
    var voice = new VF.Voice({ num_beats: notes.length, beat_value: 4 });
    voice.addTickables(notes);
    // Format and justify the notes to 400 pixels.
    new VF.Formatter().joinVoices([voice]).format([voice], 400);
    voice.draw(staff.getContext(), staff);
}

export const updateNotes = (
    { playableNotes, currentNoteIndex }: StaffConfig,
    note: string
): boolean => {
    var currentNoteToPlay: INote = playableNotes[currentNoteIndex];
    const notes = playableNotes.map(x => x.note);
    const numNotes = playableNotes.length;

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

export const resetStaff = (
    type: string,
    config: StaffConfig,
    staffWidth: number,
    numNotes: number,
    level: string,
    timeSignature: string
): StaffConfig => {
    if (level === "warmup") {
        config.playableNotes = generateNotes(false, numNotes, type, level);
    } else {
        config.playableNotes = generateNotes(true, numNotes, type, level);
    }

    var context = config.staff.getContext();
    config.staff = new Vex.Flow.Stave(staffX, staffY, staffWidth);
    context.clear();
    config.staff.addClef(type).addTimeSignature(timeSignature);
    config.staff.setContext(context).draw();
    config.currentNoteIndex = 0;
    return config;
}