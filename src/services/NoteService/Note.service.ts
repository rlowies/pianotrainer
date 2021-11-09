import Vex from "vexflow";
import { SCALE_LEVELS } from "../../types/constants";
import { Chord, Level } from "../../types/levelType";
import { Clef } from "../StaffService/Staff.service";

const ASCII_a = 97;
const ASCII_g = 103;

export interface INote {
  note: Vex.Flow.StaveNote;
  name: string;
  value: string;
  order: number;
}

export const generateNotes = (
  random: boolean = false,
  count: number,
  clef: Clef,
  level: Level,
  chord?: Chord,
  reverse: boolean = false
): INote[] => {
  const res: INote[] = [];
  const VF = Vex.Flow;
  let allNotes = setupLevel(clef, level, chord!, reverse).split(",");

  if (random) {
    allNotes = allNotes.sort(randomSort);
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

    const noteName = currentKey.replace("/", "");

    res.push({
      note: noteToAdd,
      name: noteName.toUpperCase(),
      value: getNoteValue(noteName).toUpperCase(),
      order: i,
    });
  }

  return res;
};

export const getNoteValue = (noteName: string): string => {
  let resNote;
  const noteOctave = noteName.charAt(2);
  const noteWithoutOctave = noteName.substr(0, 2);

  if (noteName.codePointAt(1) === 98) {
    //for non major scales
    if (noteWithoutOctave === "fb") {
      resNote = `E${noteOctave}`;
      return resNote;
    }

    if (noteWithoutOctave === "cb") {
      resNote = `B${+noteOctave - 1}`;
      return resNote;
    }

    const asciiNote = noteName.charCodeAt(0);
    if (asciiNote === ASCII_a) {
      resNote = `G#${noteOctave}`;
    } else {
      resNote = `${String.fromCharCode(asciiNote - 1)}#${noteOctave}`;
    }
    return resNote;
  } else if (noteName.codePointAt(1) === 35) {
    //#
    if (noteWithoutOctave === "e#") {
      resNote = `F${noteOctave}`;
      return resNote;
    }

    if (noteWithoutOctave === "b#") {
      resNote = `C${+noteOctave + 1}`;
      return resNote;
    }
  }
  return noteName;
};

export const randomSort = () => 0.5 - Math.random();

const clefIsTreble = (clef: Clef) => {
  return clef === Clef.Treble;
};

const setupLevel = (clef: Clef, level: Level, chord: Chord, reverse: boolean = false): string => {
  const isTrebleClef = clefIsTreble(clef);

  if (level === Level.Chord) return grandLevel(isTrebleClef, chord, reverse);
  if (level === Level.Warmup) return isTrebleClef ? warmUpTreble : warmUpBass;

  if (SCALE_LEVELS.includes(level)) return scaleLevel(level, isTrebleClef, reverse);

  if (level === Level.Easy) {
    return isTrebleClef ? trebleClefEasy : bassClefEasy;
  } else if (level === Level.Medium) {
    return isTrebleClef ? trebleClefMedium : bassClefMedium;
  } else {
    return isTrebleClef ? trebleClefHard : bassClefHard;
  }
};

const grandLevel = (isTrebleClef: boolean, chord: Chord, reverse: boolean) => {
  const C_LEVEL = isTrebleClef
    ? scaleLevel(Level.E_Major, isTrebleClef, reverse)
    : scaleLevel(Level.C_Major, isTrebleClef, reverse);
  switch (chord) {
    case Chord.C_Major:
      return C_LEVEL;
    case Chord.G_Major:
      return isTrebleClef ? scaleLevel(Level.D_Major, isTrebleClef, reverse) : scaleLevel(Level.G_Major, isTrebleClef, reverse);
    case Chord.D_Major:
      return isTrebleClef
        ? scaleLevel(Level.F_Sharp_Major, isTrebleClef, reverse)
        : scaleLevel(Level.D_Major, isTrebleClef, reverse);
    case Chord.A_Major:
      return isTrebleClef
        ? scaleLevel(Level.C_Sharp_Major, isTrebleClef, reverse)
        : scaleLevel(Level.A_Major, isTrebleClef, reverse);
    case Chord.E_Major:
      return isTrebleClef
        ? scaleLevel(Level.A_Flat_Major, isTrebleClef, reverse)
        : scaleLevel(Level.E_Major, isTrebleClef, reverse);
    case Chord.B_Major:
      return isTrebleClef
        ? scaleLevel(Level.E_Flat_Major, isTrebleClef, reverse)
        : scaleLevel(Level.B_Major, isTrebleClef, reverse);
    case Chord.F_Sharp_Major:
      return isTrebleClef
        ? scaleLevel(Level.B_Flat_Major, isTrebleClef, reverse)
        : scaleLevel(Level.F_Sharp_Major, isTrebleClef, reverse);
    case Chord.G_Flat_Major:
      return isTrebleClef
        ? scaleLevel(Level.B_Flat_Major, isTrebleClef, reverse)
        : scaleLevel(Level.G_Flat_Major, isTrebleClef, reverse);
    case Chord.D_Flat_Major:
      return isTrebleClef
        ? scaleLevel(Level.F_Major, isTrebleClef, reverse)
        : scaleLevel(Level.D_Flat_Major, isTrebleClef, reverse);
    case Chord.C_Sharp_Major:
      return isTrebleClef
        ? scaleLevel(Level.F_Major, isTrebleClef, reverse)
        : scaleLevel(Level.C_Sharp_Major, isTrebleClef, reverse);
    case Chord.A_Flat_Major:
      return isTrebleClef
        ? scaleLevel(Level.C_Major, isTrebleClef, reverse)
        : scaleLevel(Level.A_Flat_Major, isTrebleClef, reverse);
    case Chord.E_Flat_Major:
      return isTrebleClef
        ? scaleLevel(Level.G_Major, isTrebleClef, reverse)
        : scaleLevel(Level.E_Flat_Major, isTrebleClef, reverse);
    case Chord.B_Flat_Major:
      return isTrebleClef
        ? scaleLevel(Level.D_Major, isTrebleClef, reverse)
        : scaleLevel(Level.B_Flat_Major, isTrebleClef, reverse);
    case Chord.F_Major:
      return isTrebleClef ? scaleLevel(Level.A_Major, isTrebleClef, reverse) : scaleLevel(Level.F_Major, isTrebleClef, reverse);
    default:
      return C_LEVEL;
  }
};

const scaleLevel = (level: Level, isTrebleClef: boolean, reverse: boolean = false): string => {
  const octave = isTrebleClef ? 4 : 2;
  switch (level) {
    case Level.C_Major:
      return buildNoteString(8, "c", octave, false, undefined, undefined, reverse);
    case Level.G_Major:
      return buildNoteString(8, "g", octave, false, "#", [7], reverse);
    case Level.D_Major:
      return buildNoteString(8, "d", octave, false, "#", [3, 7], reverse);
    case Level.A_Major:
      return buildNoteString(8, "a", octave, false, "#", [3, 6, 7], reverse);
    case Level.E_Major:
      return buildNoteString(8, "e", octave, false, "#", [2, 3, 6, 7], reverse);
    case Level.B_Major:
      return buildNoteString(8, "b", octave, false, "#", [2, 3, 5, 6, 7], reverse);
    case Level.F_Sharp_Major:
      return buildNoteString(8, "f", octave, false, "#", [1, 2, 3, 5, 6, 7, 8], reverse);
    case Level.G_Flat_Major:
      return buildNoteString(8, "g", octave, false, "b", [1, 2, 3, 4, 5, 6, 8], reverse);
    case Level.D_Flat_Major:
      return buildNoteString(8, "d", octave, false, "b", [1, 2, 4, 5, 6, 8], reverse);
    case Level.C_Sharp_Major:
      return buildNoteString(8, "c", octave, false, "#", "all", reverse);
    case Level.A_Flat_Major:
      return buildNoteString(8, "a", octave, false, "b", [1, 2, 4, 5, 8], reverse);
    case Level.E_Flat_Major:
      return buildNoteString(8, "e", octave, false, "b", [1, 4, 5, 8], reverse);
    case Level.B_Flat_Major: //D
      return buildNoteString(8, "b", octave, false, "b", [1, 4, 8], reverse);
    case Level.F_Major: //A
      return buildNoteString(8, "f", octave, false, "b", [4], reverse);
    default:
      return buildNoteString(8, "c", octave, false, undefined, undefined, reverse);
  }
};

export const buildNoteString = (
  numNotes: number,
  initialNote: "a" | "b" | "c" | "d" | "e" | "f" | "g",
  octave: number,
  skip: boolean = false,
  accidental: "#" | "b" | undefined = undefined,
  accidentalLocations: number[] | "all" = "all",
  reverse: boolean = false
): string => {
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

  return reverse ? result.split(",").reverse().join(",") : result;
};

const bassClefInLines = buildNoteString(10, "g", 2, true);
const bassClefInSpaces = buildNoteString(10, "a", 2, true);
const bassClefEasy = buildNoteString(4, "a", 2, true) + "," + buildNoteString(5, "g", 2, true);
const bassClefMedium = buildNoteString(15, "c", 3);
const bassClefHard = bassClefInLines + "," + bassClefInSpaces;

const trebleClefInLines = buildNoteString(9, "a", 3, true);
const trebleClefInSpaces = buildNoteString(8, "b", 3, true);
const trebleClefEasy = buildNoteString(5, "e", 4, true) + "," + buildNoteString(4, "f", 4, true);
const trebleClefMedium = trebleClefInLines + "," + trebleClefInSpaces;
const trebleClefHard = buildNoteString(28, "c", 4);

const warmUpTreble = buildNoteString(16, "g", 3);
const warmUpBass = buildNoteString(16, "b", 1);
