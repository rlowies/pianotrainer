import { Level } from "../../../types/levelType";
import { buildNoteString, generateNotes } from "../Note.service";
import { Clef } from "../../StaffService/Staff.service";

it("Should build notes a through g", () => {
  const result = buildNoteString(7, "a", 3);
  expect(result).toBe("a/3,b/3,c/4,d/4,e/4,f/4,g/4");
});

it("Should build notes a through g more than once", () => {
  const result = buildNoteString(16, "a", 3);
  expect(result).toBe("a/3,b/3,c/4,d/4,e/4,f/4,g/4,a/4,b/4,c/5,d/5,e/5,f/5,g/5,a/5,b/5");
});

it("Should build notes a c e g if skipping", () => {
  const result = buildNoteString(4, "a", 3, true);
  expect(result).toBe("a/3,c/4,e/4,g/4");
});

it("Should build notes with accidentals", () => {
  const result = buildNoteString(4, "a", 3, true, "#");
  expect(result).toBe("a#/3,c#/4,e#/4,g#/4");
});

it("Should build G scale notes with sharp on F", () => {
  const result = buildNoteString(8, "g", 4, false, "#", [7]);
  expect(result).toBe("g/4,a/4,b/4,c/5,d/5,e/5,f#/5,g/5");
});

it("Should build notes for warmup mode in treble clef", () => {
  const result = generateNotes(false, 16, Clef.Treble, Level.Warmup);
  expect(result.map((e) => e.name)).toEqual([
    "G3",
    "A3",
    "B3",
    "C4",
    "D4",
    "E4",
    "F4",
    "G4",
    "A4",
    "B4",
    "C5",
    "D5",
    "E5",
    "F5",
    "G5",
    "A5",
  ]);
});

it("Should build notes for warmup mode in bass clef", () => {
  const result = generateNotes(false, 16, Clef.Bass, Level.Warmup);
  expect(result.map((e) => e.name)).toEqual([
    "B1",
    "C2",
    "D2",
    "E2",
    "F2",
    "G2",
    "A2",
    "B2",
    "C3",
    "D3",
    "E3",
    "F3",
    "G3",
    "A3",
    "B3",
    "C4",
  ]);
});

it("Should build notes for easy mode in bass clef", () => {
  const result = generateNotes(false, 9, Clef.Bass, Level.Easy);
  expect(result.map((e) => e.name)).toEqual(["A2", "C3", "E3", "G3", "G2", "B2", "D3", "F3", "A3"]);
});

it("Should build notes for medium mode in bass clef", () => {
  const result = generateNotes(false, 15, Clef.Bass, Level.Medium);
  expect(result.map((e) => e.name)).toEqual([
    "C3",
    "D3",
    "E3",
    "F3",
    "G3",
    "A3",
    "B3",
    "C4",
    "D4",
    "E4",
    "F4",
    "G4",
    "A4",
    "B4",
    "C5",
  ]);
});

it("Should build notes for hard mode in bass clef", () => {
  const result = generateNotes(false, 20, Clef.Bass, Level.Hard);
  expect(result.map((e) => e.name)).toEqual([
    "G2",
    "B2",
    "D3",
    "F3",
    "A3",
    "C4",
    "E4",
    "G4",
    "B4",
    "D5",
    "A2",
    "C3",
    "E3",
    "G3",
    "B3",
    "D4",
    "F4",
    "A4",
    "C5",
    "E5",
  ]);
});

it("Should build notes for easy mode in treble clef", () => {
  const result = generateNotes(false, 9, Clef.Treble, Level.Easy);
  expect(result.map((e) => e.name)).toEqual(["E4", "G4", "B4", "D5", "F5", "F4", "A4", "C5", "E5"]);
});

it("Should build notes for medium mode in treble clef", () => {
  const result = generateNotes(false, 17, Clef.Treble, Level.Medium);
  expect(result.map((e) => e.name)).toEqual([
    "A3",
    "C4",
    "E4",
    "G4",
    "B4",
    "D5",
    "F5",
    "A5",
    "C6",
    "B3",
    "D4",
    "F4",
    "A4",
    "C5",
    "E5",
    "G5",
    "B5",
  ]);
});

it("Should build notes for hard mode in treble clef", () => {
  const result = generateNotes(false, 28, Clef.Treble, Level.Hard);
  expect(result.map((e) => e.name)).toEqual([
    "C4",
    "D4",
    "E4",
    "F4",
    "G4",
    "A4",
    "B4",
    "C5",
    "D5",
    "E5",
    "F5",
    "G5",
    "A5",
    "B5",
    "C6",
    "D6",
    "E6",
    "F6",
    "G6",
    "A6",
    "B6",
    "C7",
    "D7",
    "E7",
    "F7",
    "G7",
    "A7",
    "B7",
  ]);
});

it("Should build note values correctly for piano from flat to sharp", () => {
    const result = generateNotes(false, 8, Clef.Treble, Level.B_Flat_Major);
    expect(result.map((e) => e.value)).toEqual([
      "A#4",
      "C5",
      "D5",
      "D#5",
      "F5",
      "G5",
      "A5",
      "A#5"
    ]);
  });

  it("Should build note values correctly for sharp to flat", () => {
    const result = generateNotes(false, 8, Clef.Treble, Level.C_Sharp_Major);
    expect(result.map((e) => e.value)).toEqual([
      "C#4",
      "D#4",
      "F4",
      "F#4",
      "G#4",
      "A#4",
      "C5",
      "C#5"
    ]);
  });