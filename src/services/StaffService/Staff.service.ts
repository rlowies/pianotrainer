import { generateNotes, INote } from '../NoteService/Note.service';
import Vex from 'vexflow';
import { Level } from '../../types/levelType';
import { StaffMeasure } from '../../types/staffMeasure';
import { RANDOMIZE_LEVELS } from '../../types/constants';

export const VF = Vex.Flow;

export enum Clef {
    Bass = "bass",
    Treble = "treble",
    Grand = "grand",
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
    clef: Clef,
    config: StaffConfig,
    staffWidth: number,
    numNotes: number,
    level: Level,
    timeSignature: string,
    numMeasures: number,
    prevNotes?: INote[][]
): StaffConfig => {
    var context = config.staffs[0].staff.getContext();
    context.clear();
    const measures = clef === Clef.Grand 
        ? getBassAndTrebleClef(staffWidth, level, numNotes, prevNotes) 
        : getMeasures(staffWidth, level, numNotes, clef, numMeasures);

    config.staffs.forEach((staffType: StaffMeasure, i: number) => {
        staffType.playableNotes = measures[i].playableNotes;
        staffType.staff = measures[i].staff;

        if (i === 0) {
            staffType.staff.addClef(clef === Clef.Grand ? Clef.Treble : clef).addTimeSignature(timeSignature);
            staffType.currentStaffNoteIndex = 0;
        }

        if (i === 1 && clef === Clef.Grand) {
            staffType.staff.addClef(Clef.Bass).addTimeSignature(timeSignature);
            staffType.currentStaffNoteIndex = 0;
            renderGrandStaff(context, config.staffs);
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
            playableNotes: numMeasures > 1 ? [a, b, c, d] : allNotes,
            currentStaffNoteIndex: 0,
        }
    ]

    if (numMeasures > 1) {
        measures.push({
            staff: new VF.Stave(staffX + width, staffY, width),
            playableNotes: [e, f, g, h], 
            currentStaffNoteIndex: 0,
        });
    }
    return measures;
};

export const getBassAndTrebleClef = (
    width: number,
    level: Level,
    numNotes: number,
    prevNotes?: INote[][],
): StaffMeasure[] => {
    let measures: StaffMeasure[] = [{
        staff: new VF.Stave(staffX, staffY, width),
        playableNotes: prevNotes?.[0] ?? generateNotes(RANDOMIZE_LEVELS.includes(level), numNotes, Clef.Treble, level),
        currentStaffNoteIndex: 0,
    },
    {
        staff: new VF.Stave(staffX, staffY + 100, width),
        playableNotes: prevNotes?.[1] ?? generateNotes(RANDOMIZE_LEVELS.includes(level), numNotes, Clef.Bass, level),
        currentStaffNoteIndex: 0,
    }
    ];

    return measures;
};

export const renderGrandStaff = (context: Vex.IRenderContext, staffs: StaffMeasure[]) => {
    let topStaff = staffs[0].staff;
    let bottomStaff = staffs[1].staff;
    var brace = new VF.StaveConnector(topStaff, bottomStaff);
    var lineRight = new VF.StaveConnector(topStaff, bottomStaff).setType(0);
    var lineLeft = new VF.StaveConnector(topStaff, bottomStaff).setType(1);
    brace.setContext(context).draw();
    lineRight.setContext(context).draw();
    lineLeft.setContext(context).draw();
}