import Vex from 'vexflow'

export interface INote {
    note: Vex.Flow.StaveNote;
    name: string;
    order: number;
}

export const generateNotes = (notes: string, random: boolean = false): INote[] => {
    var res: INote[] = [];
    var allNotes = notes.split(",");
    const VF = Vex.Flow;

    if(random) {
        allNotes = allNotes.sort((a,b) => 0.5 - Math.random())
    }


    for (var i = 0; i < allNotes.length; i++) {
        var currentKey = allNotes[i];

        res.push({
            note: new VF.StaveNote({ clef: "bass", keys: [currentKey], duration: "q" }),
            name: currentKey.replace("/", "").toUpperCase(),
            order: i
        });
    }


    return res;
}