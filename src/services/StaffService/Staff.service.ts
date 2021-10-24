import { generateNotes, INote } from '../NoteService/Note.service';
import Vex from 'vexflow';
import { Level } from '../../types/levelType';
import { StaffMeasure } from '../../types/staffMeasure';

export const VF = Vex.Flow;

export enum Clef {
    Bass = "bass",
    Treble = "treble",
}

export interface StaffConfig {
    staffs: StaffMeasure[];
    currentNoteIndex: number;
}

export const staffX = 10;
export const staffY = 100;

export const updateVoice = (
    { staffs }: StaffConfig
) => {
    staffs.forEach(staff => {
        const notes = staff.playableNotes;
        var voice = new VF.Voice({ num_beats: notes.length, beat_value: 4 });
        voice.addTickables(notes.map(x => x.note));
        // Format and justify the notes to 400 pixels.
        new VF.Formatter().joinVoices([voice]).format([voice], 400);
        voice.draw(staff.staff.getContext(), staff.staff);
    });
}

export const updateNotes = (
    playableNotes: INote[],
    currentNoteIndex: number,
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
    var context = config.staffs[0].staff.getContext();
    context.clear();

    config.staffs.forEach((staffType: StaffMeasure, i: number) => {
        staffType.playableNotes = generateNotes(level !== Level.Warmup, numNotes, type, level);
        staffType.staff = new Vex.Flow.Stave(staffX, i === 0 ? staffY : staffY + 100, staffWidth);

        if (i === 0) {
            staffType.staff.addClef(type).addTimeSignature(timeSignature);
        }

        staffType.staff.setContext(context).draw();
        config.currentNoteIndex = 0;
    });

    return config;
}

export const getMeasures = (
    width: number,
    level: Level,
    numNotes: number,
    clef: Clef,
    numMeasures: number
): StaffMeasure[] => {
    let measures: StaffMeasure[] = [
        {
            staff: new VF.Stave(staffX, staffY, width),
            playableNotes: generateNotes(level !== Level.Warmup, numNotes, clef, level)
        }
    ]

    if (numMeasures > 1) {
        measures.push({
            staff: new VF.Stave(staffX, staffY + 100, width),
            playableNotes: generateNotes(level !== Level.Warmup, numNotes, clef, level)
        });
    }

    return measures;
};