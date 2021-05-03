import Vex from 'vexflow'

export interface INote {
    note: Vex.Flow.StaveNote;
    name: string;
    order: number;
}

export const playableNotes: string[] = [];

export const generateNotes = (notes: string, random: boolean = false, count: number): INote[] => {
    var res: INote[] = [];
    var allNotes = notes.split(",");
    const VF = Vex.Flow;

    if(random) {
        allNotes = allNotes.sort(randomSort)
    }

    for (var i = 0; i < count; i++) {
        var currentKey = allNotes[i];

        var noteName = currentKey.replace("/", "").toUpperCase();

        res.push({
            note: new VF.StaveNote({ clef: "bass", keys: [currentKey], duration: "q" }),
            name: noteName,
            order: i
        });

        playableNotes.push(noteName);
    }


    return res;
}

export const randomSort = () => 0.5 - Math.random();
const bassClefInSpaces:string = "a/2,b/1,b/3,c/1,c/3,d/2,e/1,e/3,g/1,g/3";
const bassClefInLines:string = "a/1,a/3,c/2,c/4,b/2,d/1,d/3,e/2,f/1,g/2";
export const bassClefEasy:string = "a/2,c/3,e/3,g/3,g/2,b/2,d/3,f/3,a/3";
