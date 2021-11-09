import { Chord, Level } from "../../../types/levelType";
import { StaffConfig } from "../../../types/staffConfig";
import { generateNotes, INote } from "../../NoteService/Note.service";
import {
  buildBassOrTrebleStaff,
  buildGrandStaff,
  Clef,
  determineStaffIndex,
  resetNoteValidation,
  updateNotes,
  VF,
} from "../Staff.service";

import Vex from "vexflow";

const width = 300;
let level: Level;
let notesPerMeasure: number;
let numMeasures: number;
const green = "#00cc00";
const red = "#cc0000";
const black = "#000000";

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
    const trebleNotes = generateNotes(false, notesPerMeasure, Clef.Treble, level, undefined, false);
    const bassNotes = generateNotes(false, notesPerMeasure, Clef.Bass, level, undefined, false);
    const prevNotes: INote[][] = [trebleNotes, bassNotes];

    const staffConfig = buildGrandStaff(width, level, notesPerMeasure, undefined, prevNotes);

    const firstMeasure = staffConfig[0].playableNotes.map((x) => x.name);
    const secondMeasure = staffConfig[1].playableNotes.map((x) => x.name);
    expect(firstMeasure).toEqual(trebleNotes.map((x) => x.name));
    expect(secondMeasure).toEqual(bassNotes.map((x) => x.name));
  });
});

describe("When updating notes", () => {
  let staffConfig: StaffConfig;
  beforeEach(() => {
    staffConfig = {
      staff: new VF.Stave(0, 0, 0),
      playableNotes: generateNotes(false, 2, Clef.Treble, Level.C_Major),
      currentStaffNoteIndex: 0,
    };
  });

  it("Should correctly modify staff config when correct notes are played", () => {
    updateNotes(staffConfig, "C4");

    expect((staffConfig.playableNotes.map((x) => x.note)[0] as any)?.style?.fillStyle).toEqual(green);
    expect(staffConfig.currentStaffNoteIndex).toEqual(1);
    const result = updateNotes(staffConfig, "D4");

    expect((staffConfig.playableNotes.map((x) => x.note)[1] as any)?.style?.fillStyle).toEqual(green);
    expect(result).toEqual(true);
  });

  it("Should correctly modify staff config when incorrect notes are played", () => {
    const result = updateNotes(staffConfig, "C2");

    expect((staffConfig.playableNotes.map((x) => x.note)[0] as any)?.style?.fillStyle).toEqual(red);
    expect(staffConfig.currentStaffNoteIndex).toEqual(0);
    expect(result).toEqual(false);
  });
});

describe("When determining staff index", () => {
  let level: Level;
  let note: string;
  let staffs: StaffConfig[];
  let initialClef: Clef;

  beforeEach(() => {
    level = Level.Easy;
    note = "C4";
    staffs = [];
    initialClef = Clef.Treble;
  });

  it("Should correctly determine index for Chord level Grand staff", () => {
    level = Level.Chord;
    const chord = Chord.C_Major;
    initialClef = Clef.Grand;
    staffs = [
      {
        staff: new VF.Stave(0, 0, 0),
        playableNotes: generateNotes(false, 1, Clef.Treble, level, chord),
        currentStaffNoteIndex: 0,
      },
      {
        staff: new VF.Stave(0, 0, 0),
        playableNotes: generateNotes(false, 1, Clef.Treble, level, chord),
        currentStaffNoteIndex: 0,
      },
      {
        staff: new VF.Stave(0, 0, 0),
        playableNotes: generateNotes(false, 1, Clef.Bass, level, chord),
        currentStaffNoteIndex: 0,
      },
      {
        staff: new VF.Stave(0, 0, 0),
        playableNotes: generateNotes(false, 1, Clef.Bass, level, chord),
        currentStaffNoteIndex: 0,
      },
    ];

    note = "E4";
    let staffIndex = determineStaffIndex(level, note, staffs, initialClef);
    expect(staffIndex).toEqual(0);

    updateNotes(staffs[0], note);
    staffIndex = determineStaffIndex(level, note, staffs, initialClef);
    expect(staffIndex).toEqual(1);

    note = "C2";
    staffIndex = determineStaffIndex(level, note, staffs, initialClef);
    expect(staffIndex).toEqual(2);

    updateNotes(staffs[2], note);
    staffIndex = determineStaffIndex(level, note, staffs, initialClef);
    expect(staffIndex).toEqual(3);
  });

  it("Should correctly determine index for Scale levels", () => {
    level = Level.C_Major;
    note = "C4";
    staffs = [
      {
        staff: new VF.Stave(0, 0, 0),
        playableNotes: generateNotes(false, 1, Clef.Treble, level),
        currentStaffNoteIndex: 0,
      },
      {
        staff: new VF.Stave(0, 0, 0),
        playableNotes: generateNotes(false, 1, Clef.Treble, level),
        currentStaffNoteIndex: 0,
      },
    ];

    let staffIndex = determineStaffIndex(level, note, staffs, initialClef);
    expect(staffIndex).toEqual(0);

    updateNotes(staffs[0], note);
    staffIndex = determineStaffIndex(level, note, staffs, initialClef);
    expect(staffIndex).toEqual(1);
  });

  it("Should correctly determine index for Basic levels", () => {
    level = Level.Easy;
    note = "C4";
    staffs = [];

    let staffIndex = determineStaffIndex(level, note, staffs, initialClef);
    expect(staffIndex).toEqual(0);
  });
});

describe("When resetting staff", () => {
  let staffConfig: StaffConfig[];
  let notesPerMeasure: number;
  let initialClef: Clef;
  let clefType: Clef;
  let width: number;
  let level: Level;
  let timeSignature: string;
  let numMeasures: number;
  let chord: Chord;

  const renderer = new VF.Renderer(document.createElement("div"), VF.Renderer.Backends.SVG);
  const mockStave = new VF.Stave(0, 0, 0);
  const mockStaveContext = renderer.getContext();
  mockStave.setContext(mockStaveContext);

 jest.spyOn(Vex.Flow, "Stave").mockImplementation(() => {
    const originalModule = jest.requireActual('vexflow');
    return {
      ...originalModule,
      getContext: jest.fn(() => renderer.getContext()),
      addClef: jest.fn(() => mockStave),
      addTimeSignature: jest.fn(),
      setContext: jest.fn(() => mockStave),
      getYForNote: jest.fn(() => mockStave.getYForNote()),
      getYForLine: jest.fn(() => mockStave.getYForLine(0)),
      getNumLines: jest.fn(() => mockStave.getNumLines()),
      getNoteStartX: jest.fn(() => mockStave.getNoteStartX()),
      getSpacingBetweenLines: jest.fn(() => mockStave.getSpacingBetweenLines()),
      getStyle: jest.fn(() => {}),
    };
  });

  beforeEach(() => {
    level = Level.C_Major;
    initialClef = Clef.Treble;
    clefType = Clef.Treble;
    width = 0;
    notesPerMeasure = 4;
    timeSignature = `${notesPerMeasure}/4`;
    numMeasures = 1;
    chord = undefined!;

    staffConfig = [
      {
        staff: new VF.Stave(0, 0, 0),
        playableNotes: generateNotes(false, 8, Clef.Treble, level),
        currentStaffNoteIndex: 0,
      },
    ];
  });

  it("Should correctly reset note validation for single measure", () => {
    updateNotes(staffConfig[0], "C4")

    expect((staffConfig[0].playableNotes.map((x) => x.note)[0] as any)?.style?.fillStyle).toEqual(green);
    resetNoteValidation(staffConfig, notesPerMeasure, initialClef, clefType, width, level, timeSignature, numMeasures, chord);
    expect((staffConfig[0].playableNotes.map((x) => x.note)[0] as any)?.style?.fillStyle).toEqual(black);
  });
});
