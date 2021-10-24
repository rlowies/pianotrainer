import { generateNotes, INote } from '../NoteService/Note.service';
import Vex from 'vexflow';
import { Level } from '../../types/levelType';

export const VF = Vex.Flow;

export enum Clef {
    Bass = "bass",
    Treble = "treble",
}

export interface StaffConfig {
    staff: Vex.Flow.Stave;
    currentNoteIndex: number;
    playableNotes: INote[];
}

export const staffX = 10;
export const staffY = 100;

export const updateVoice = (
    { playableNotes: notes, staff }: StaffConfig
) => {
    var voice = new VF.Voice({ num_beats: notes.length, beat_value: 4 });
    voice.addTickables(notes.map(x => x.note));
    // Format and justify the notes to 400 pixels.
    new VF.Formatter().joinVoices([voice]).format([voice], 400);
    voice.draw(staff.getContext(), staff);
}

export const updateNotes = (
    { playableNotes, currentNoteIndex }: StaffConfig,
    note: string
): boolean => {
    var red = { fillStyle: "#cc0000", strokeStyle: "#cc0000" };
    var green = { fillStyle: "#00cc00", strokeStyle: "#00cc00" };

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
    type: Clef,
    config: StaffConfig,
    staffWidth: number,
    numNotes: number,
    level: Level,
    timeSignature: string
): StaffConfig => {
    config.playableNotes = generateNotes(level !== Level.Warmup, numNotes, type, level);
    var context = config.staff.getContext();
    config.staff = new Vex.Flow.Stave(staffX, staffY, staffWidth);
    context.clear();
    config.staff.addClef(type).addTimeSignature(timeSignature);
    config.staff.setContext(context).draw();
    config.currentNoteIndex = 0;
    return config;
}