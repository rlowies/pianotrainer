import { Level } from "../../../types/levelType";
import { generateNotes, INote } from "../../NoteService/Note.service";
import { buildBassOrTrebleStaff, buildGrandStaff, Clef } from "../Staff.service";
const width = 300;
let level: Level;
let notesPerMeasure: number;
let numMeasures: number;

describe("When building scale levels", () => {
  beforeEach(() => {
    level = Level.C_Major;
    notesPerMeasure = 8;
    numMeasures = 2;
  });

  it("Should correctly build two measures", () => {
    const staffConfig = buildBassOrTrebleStaff(width, level, notesPerMeasure, Clef.Treble, numMeasures);

    const firstMeasure = staffConfig[0].playableNotes.map((x) => x.name);
    const secondMeasure = staffConfig[1].playableNotes.map((x) => x.name);

    expect(firstMeasure).toEqual(["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"]);
    expect(secondMeasure).toEqual(["C5", "B4", "A4", "G4", "F4", "E4", "D4", "C4"]);
  });
});

describe("When building Note Training levels", () => {
  beforeEach(() => {
    level = Level.Easy;
    notesPerMeasure = 4;
    numMeasures = 1;
  });

  it("Should correctly build single measure", () => {
    const staffConfig = buildBassOrTrebleStaff(width, level, notesPerMeasure, Clef.Treble, numMeasures);

    expect(staffConfig[0].playableNotes.length).toEqual(notesPerMeasure);
  });
});

describe("When building Grand staff", () => {
  beforeEach(() => {
    level = Level.Grand;
    notesPerMeasure = 4;
    numMeasures = 2;
  });

  it("Should correctly build previous notes", () => {
    const trebleNotes = generateNotes(false, notesPerMeasure, Clef.Treble, level, false);
    const bassNotes = generateNotes(false, notesPerMeasure, Clef.Bass, level, false);
    const prevNotes: INote[][] = [trebleNotes, bassNotes];

    const staffConfig = buildGrandStaff(width, level, notesPerMeasure, prevNotes);

    const firstMeasure = staffConfig[0].playableNotes.map((x) => x.name);
    const secondMeasure = staffConfig[1].playableNotes.map((x) => x.name);
    expect(firstMeasure).toEqual(trebleNotes.map((x) => x.name));
    expect(secondMeasure).toEqual(bassNotes.map((x) => x.name));
  });
});
