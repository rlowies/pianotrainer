import Vex from 'vexflow'

export interface INote {
    note: Vex.Flow.StaveNote;
    name: string;
    order: number;
}

export const generateNotes = (
    random: boolean = false,
    count: number,
    clef: string,
    level: string
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

const clefIsTreble = (clef: string) => {
    return clef === "treble";
}

const setupLevel = (clef: string, level: string): string => {
    if (level === "warmup") return clefIsTreble(clef) ? warmUpTreble : warmUpBass;

    if (level === "easy") {
        return clefIsTreble(clef) ? trebleClefEasy : bassClefEasy;
    } else if (level === "medium") {
        return clefIsTreble(clef) ? trebleClefMedium : bassClefMedium;
    } else {
        return clefIsTreble(clef) ? trebleClefHard : bassClefHard;
    }
}

export const buildNoteString = (
    numNotes: number,
    initialNote: string,
    octave: number,
    skip: boolean = false,
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

        const noteString = `${asciiNote}/${octave}`;
        result += numNotes === i + 1 ? noteString : `${noteString},`;
    }

    if (skip) {
        let temp = result.split(",");
        let newResult = "";
        for (let i = 0; i < temp.length; i+=2) {
            
            newResult += i === temp.length - 2 ? temp[i] : `${temp[i]},`;
        }

        result = newResult;
    }

    return result;
}

const bassClefInSpaces: string = buildNoteString(10, "a", 2, true);
const bassClefInLines: string = buildNoteString(10, "g", 2, true);

const bassClefHard: string = bassClefInLines + "," + bassClefInSpaces;
const bassClefEasy: string = "a/2,c/3,e/3,g/3,g/2,b/2,d/3,f/3,a/3";

const trebleClefInLines: string = buildNoteString(9, "a", 3, true);//2 above and below ledger 
const trebleClefInSpaces: string = buildNoteString(8, "b", 3, true);//2 above and below ledger 
const trebleClefEasy = "e/4,g/4,b/4,d/5,f/5,f/4,a/4,c/5,e/5";
const trebleClefMedium = trebleClefInLines + "," + trebleClefInSpaces;
const trebleClefHard = buildNoteString(28, "c", 4); //not including C8(used for reset)


const bassClefMedium: string = buildNoteString(15, "c", 3)
// const bassClefSharps = "c#/1,d#/1,f#/1,g#/1,a#/1,c#/2,d#/2,f#/2,g#/2,a#/2,c#/3,d#/3,f#/3,g#/3,a#/3";
// const bassClefFlats = "db/1,eb/1,gb/1,ab/1,bb/1,db/2,eb/2,gb/2,ab/2,bb/2,db/3,eb/3,gb/3,ab/3,bb/3";
// const bassClefAll = bassClefHard + "," + bassClefFlats + "," + bassClefSharps;

const warmUpTreble: string = buildNoteString(16, "g", 3);
const warmUpBass: string = buildNoteString(16, "b", 1);