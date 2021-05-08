import Vex from 'vexflow'

export interface INote {
    note: Vex.Flow.StaveNote;
    name: string;
    order: number;
}

export const generateNotes = (random: boolean = false, count: number, clef: string, level: string): INote[] => {
    var res: INote[] = [];
    var allNotes = setupLevel(clef, level).split(",");
    const VF = Vex.Flow;

    if (random) {
        allNotes = allNotes.sort(randomSort)
    }

    for (var i = 0; i < count; i++) {
        var currentKey = allNotes[i];

        var noteToAdd: Vex.Flow.StaveNote = new VF.StaveNote({ clef: clef, keys: [currentKey], duration: "q", auto_stem: true });
        if(currentKey.codePointAt(1) === 35) {
            noteToAdd.addAccidental(0, new VF.Accidental("#"));
        }

        if(currentKey.codePointAt(1) === 98) {
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
    if (level === "easy") {
        return clefIsTreble(clef) ? trebleClefEasy : bassClefEasy;
    } else if (level === "medium") {
        return clefIsTreble(clef) ? trebleClefMedium : bassClefMedium;
    } else {
        return clefIsTreble(clef) ? trebleClefHard : bassClefHard;
    }
}

const bassClefInSpaces: string = "a/2,b/1,b/3,c/1,c/3,d/2,e/1,e/3,g/1,g/3";
const bassClefInLines: string = "a/1,a/3,c/2,c/4,b/2,d/1,d/3,e/2,f/1,g/2";

const bassClefHard: string = bassClefInLines + "," + bassClefInSpaces;
const bassClefEasy: string = "a/2,c/3,e/3,g/3,g/2,b/2,d/3,f/3,a/3";

const trebleClefInLines: string = "a/3,c/4,e/4,g/4,b/4,d/5,f/5,a/5,c/6";//2 above and below ledger 
const trebleClefInSpaces: string = "b/3,d/4,f/4,a/4,c/5,e/5,g/5,b/5";//2 above and below ledger 
const trebleClefEasy = "e/4,g/4,b/4,d/5,f/5,f/4,a/4,c/5,e/5";
const trebleClefMedium = trebleClefInLines + "," + trebleClefInSpaces;

const trebleClefHard = "c/4,d/4,e/4,f/4,g/4,a/4,b/4,c/5,d/5,e/5,f/5,g/5,a/5,b/5,c/6,d/6,e/6,f/6,g/6,a/6,b/6,c/7,d/7,e/7,f/7,g/7,a/7,b/7"; //not including C8(used for reset)


const bassClefMedium: string = "c/2,d/2,e/2,f/2,g/2,a/2,b/2,c/3,d/3,e/3,f/3,g/3,a/3,b/3,c/4";
// const bassClefSharps = "c#/1,d#/1,f#/1,g#/1,a#/1,c#/2,d#/2,f#/2,g#/2,a#/2,c#/3,d#/3,f#/3,g#/3,a#/3";
// const bassClefFlats = "db/1,eb/1,gb/1,ab/1,bb/1,db/2,eb/2,gb/2,ab/2,bb/2,db/3,eb/3,gb/3,ab/3,bb/3";
// const bassClefAll = bassClefHard + "," + bassClefFlats + "," + bassClefSharps;

// cdefgab2
// cdefgab3