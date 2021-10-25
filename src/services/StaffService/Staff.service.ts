import { generateNotes, INote } from '../NoteService/Note.service';
import Vex from 'vexflow';
import { Level } from '../../types/levelType';
import { StaffMeasure } from '../../types/staffMeasure';
import { RANDOMIZE_LEVELS } from '../../types/constants';

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
    { staffs }: StaffConfig,
) => {
    staffs.forEach(staff => {
        const notes = staff.playableNotes;
        var voice = new VF.Voice({ num_beats: notes.length, beat_value: 4 });
        voice.addTickables(notes.map(x => x.note));
        // Format and justify the notes to 400 pixels.
        new VF.Formatter().joinVoices([voice]).format([voice], staffs.length > 1 ? 300 : 400);
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
    //fixes bug with currentNoteToPlay.order, if another note is sent after final note.
    if (notes.every((n: any) => n?.style?.fillStyle === green.fillStyle)) return true;

    const numNotes = playableNotes.length;
    if (currentNoteIndex < numNotes && currentNoteIndex === currentNoteToPlay.order % numNotes) {
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
    timeSignature: string,
    numMeasures: number,
): StaffConfig => {
    var context = config.staffs[0].staff.getContext();
    context.clear();
    const measures = getMeasures(staffWidth, level, numNotes, type, numMeasures);

    config.staffs.forEach((staffType: StaffMeasure, i: number) => {
        staffType.playableNotes = measures[i].playableNotes;
        staffType.staff = measures[i].staff;

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
    let allNotes = generateNotes(RANDOMIZE_LEVELS.includes(level), numNotes, clef, level);
    let [a, b, c, d, e, f, g, h] = allNotes;

    let measures: StaffMeasure[] = [
        {
            staff: new VF.Stave(staffX, staffY, width),
            playableNotes: numMeasures > 1 ? [a, b ,c, d] : allNotes
        }
    ]

    if (numMeasures > 1) {
        measures.push({
            staff: new VF.Stave(staffX + width, staffY, width),
            playableNotes: [e, f, g, h]
        });
    }

    return measures;
};