import Vex from 'vexflow'

export interface INote {
    note: Vex.Flow.StaveNote;
    name: string;
    order: number;
}

export const generateNotes = (notes: string, random: boolean = false, count: number, clef: string): INote[] => {
    var res: INote[] = [];
    var allNotes = notes.split(",");
    const VF = Vex.Flow;

    if(random) {
        allNotes = allNotes.sort(randomSort)
    }

    for (var i = 0; i < count; i++) {
        var currentKey = allNotes[i];

        res.push({
            note: new VF.StaveNote({ clef: clef, keys: [currentKey], duration: "q", auto_stem: true }),
            name: currentKey.replace("/", "").toUpperCase(),
            order: i
        });
    }

    return res;
}

export const randomSort = () => 0.5 - Math.random();
const bassClefInSpaces:string = "a/2,b/1,b/3,c/1,c/3,d/2,e/1,e/3,g/1,g/3";
const bassClefInLines:string = "a/1,a/3,c/2,c/4,b/2,d/1,d/3,e/2,f/1,g/2";

export const bassCleffHard:string = bassClefInLines + "," + bassClefInSpaces;
export const bassClefEasy:string = "a/2,c/3,e/3,g/3,g/2,b/2,d/3,f/3,a/3";

export const trebleClefInLines:string = "a/3,c/4,e/4,g/4,b/4,d/5,f/5,a/5,c/6";//2 above and below ledger 
export const trebleClefInSpaces:string = "b/3,d/4,f/4,a/4,c/5,e/5,g/5,b/5";//2 above and below ledger 
export const trebleClefEasy = "e/4,g/4,b/4,d/5,f/5,f/4,a/4,c/5,e/5";
export const trebleClefMedium = trebleClefInLines + "," + trebleClefInSpaces;

export const bassClefMedium:string = "c/2,d/2,e/2,f/2,g/2,a/2,b/2,c/3,d/3,e/3,f/3,g/3,a/3,b/3,c/4";

// cdefgab2
// cdefgab3