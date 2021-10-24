import Vex from 'vexflow'
import { Level } from '../../types/levelType';
import { Clef } from '../StaffService/Staff.service';

export interface INote {
    note: Vex.Flow.StaveNote;
    name: string;
    order: number;
}

export const generateNotes = (
    random: boolean = false,
    count: number,
    clef: Clef,
    level: Level
): INote[] => {
    var res: INote[] = [];
    const VF = Vex.Flow;
    var allNotes = setupLevel(clef, level).split(",");

    if (random) {
        allNotes = allNotes.sort(randomSort)
    }

    for (var i = 0; i < count; i++) {
        var currentKey = allNotes[i];

        var noteToAdd: Vex.Flow.StaveNote = new VF.StaveNote({ clef: clef, keys: [currentKey], duration: "q", auto_stem: true });
        if (currentKey.codePointAt(1) === 35) {
            noteToAdd.addAccidental(0, new VF.Accidental("#"));
        }

        if (currentKey.codePointAt(1) === 98) {
            noteToAdd.addAccidental(0, new VF.Accidental("b"));
        }

        res.push({
            note: noteToAdd,
            name: currentKey.replace("/", "").toUpperCase(),
            order: i
        });
    }

    return res;
}

export const randomSort = () => 0.5 - Math.random();

const clefIsTreble = (clef: Clef) => {
    return clef === Clef.Treble;
}

const setupLevel = (clef: Clef, level: string): string => {
    if (level === Level.Warmup) return clefIsTreble(clef) ? warmUpTreble : warmUpBass;
    if (level === Level.C_Major) return clefIsTreble(clef) ? buildNoteString(8, "c", 4, false) : buildNoteString(8, "c", 2, false);
    if (level === Level.G_Major) return clefIsTreble(clef) ? buildNoteString(8, "g", 4, false, "#", [7]) : buildNoteString(8, "g", 2, false, "#", [7]);
    if (level === Level.D_Major) return clefIsTreble(clef) ? buildNoteString(8, "d", 4, false, "#", [3,7]) : buildNoteString(8, "d", 2, false, "#", [3,7]);
   
    if (level === Level.Easy) {
        return clefIsTreble(clef) ? trebleClefEasy : bassClefEasy;
    } else if (level === Level.Medium) {
        return clefIsTreble(clef) ? trebleClefMedium : bassClefMedium;
    } else {
        return clefIsTreble(clef) ? trebleClefHard : bassClefHard;
    }
}

export const buildNoteString = (
    numNotes: number,
    initialNote: "a" | "b" | "c" | "d" | "e" | "f" | "g",
    octave: number,
    skip: boolean = false,
    accidental: "#" | "b" | undefined = undefined,
    accidentalLocations: number[] | "all" = "all",
): string => {
    const ASCII_a = 97;
    const ASCII_g = 103;
    let result = "";
    const startNote = initialNote.charCodeAt(0);
    numNotes = skip ? numNotes * 2 : numNotes;
    octave = String.fromCharCode(startNote) === "c" ? octave - 1 : octave;
    for (let i = 0; i < numNotes; i++) {
        const noteIndex = (startNote + (i % 7)) % ASCII_g;

        let decimalNote = 0;

        if (noteIndex === 0) {
            decimalNote = ASCII_g;
        } else if (noteIndex < ASCII_a) {
            decimalNote += ASCII_a + noteIndex - 1;
        } else {
            decimalNote = noteIndex;
        }

        const asciiNote = String.fromCharCode(decimalNote);

        if (asciiNote === "c") {
            octave++;
        }

        let shouldAddAccidental = false;
        if (accidental) {
            if (accidentalLocations === "all") {
                shouldAddAccidental = true;
            } else {
                if (accidentalLocations.includes(i + 1)) {
                    shouldAddAccidental = true;
                }
            }
        }

        const noteString = `${asciiNote}${shouldAddAccidental ? accidental : ""}/${octave}`;
        result += numNotes === i + 1 ? noteString : `${noteString},`;
    }

    if (skip) {
        let temp = result.split(",");
        let newResult = "";
        for (let i = 0; i < temp.length; i += 2) {

            newResult += i === temp.length - 2 ? temp[i] : `${temp[i]},`;
        }

        result = newResult;
    }

    return result;
}

// const bassClefSharps = buildNoteString(10, "c", 3, true, "#");
// const bassClefFlats = buildNoteString(10, "c", 3, true, "b");

const bassClefInLines: string = buildNoteString(10, "g", 2, true);
const bassClefInSpaces: string = buildNoteString(10, "a", 2, true);
const bassClefEasy: string = buildNoteString(4, "a", 2, true) + "," + buildNoteString(5, "g", 2, true);
const bassClefMedium: string = buildNoteString(15, "c", 3)
const bassClefHard: string = bassClefInLines + "," + bassClefInSpaces;

const trebleClefInLines: string = buildNoteString(9, "a", 3, true);
const trebleClefInSpaces: string = buildNoteString(8, "b", 3, true);
const trebleClefEasy = buildNoteString(5, "e", 4, true) + "," + buildNoteString(4, "f", 4, true);
const trebleClefMedium = trebleClefInLines + "," + trebleClefInSpaces;
const trebleClefHard = buildNoteString(28, "c", 4);

const warmUpTreble: string = buildNoteString(16, "g", 3);
const warmUpBass: string = buildNoteString(16, "b", 1);