import { buildNoteString, generateNotes } from "./Note.service";

it("Should build notes a through g", () => {
    const result = buildNoteString(7, "a", 3);
    expect(result).toBe("a/3,b/3,c/4,d/4,e/4,f/4,g/4")
})

it("Should build notes a through g more than once", () => {
    const result = buildNoteString(16, "a", 3);
    expect(result).toBe("a/3,b/3,c/4,d/4,e/4,f/4,g/4,a/4,b/4,c/5,d/5,e/5,f/5,g/5,a/5,b/5")
})

it("Should build notes for warmup mode in treble clef", () => {
    const result = generateNotes(false, 16, "treble", "warmup");
    expect(result.map(e => e.name)).toEqual(["G3", "A3", "B3", "C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5", "D5", "E5", "F5", "G5", "A5"])
})

it("Should build notes for warmup mode in bass clef", () => {
    const result = generateNotes(false, 16, "bass", "warmup");
    expect(result.map(e => e.name)).toEqual(["B1", "C2", "D2", "E2", "F2", "G2", "A2", "B2", "C3", "D3", "E3", "F3", "G3", "A3", "B3", "C4"])
})

it("Should build notes for easy mode in bass clef", () => {
    const result = generateNotes(false, 9, "bass", "easy");
    expect(result.map(e => e.name)).toEqual(["A2", "C3", "E3", "G3", "G2", "B2", "D3", "F3", "A3"])
})

it("Should build notes for medium mode in bass clef", () => {
    const result = generateNotes(false, 15, "bass", "medium");
    expect(result.map(e => e.name)).toEqual(["C3", "D3", "E3", "F3", "G3", "A3", "B3", "C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"])
})

it("Should build notes for hard mode in bass clef", () => {
    const result = generateNotes(false, 20, "bass", "hard");
    expect(result.map(e => e.name)).toEqual(["G2", "B2", "D3", "F3", "A3", "C4", "E4", "G4", "B4", "D6", "A2", "C3", "E3", "G3", "B3", "D4", "F4", "A4", "C5", "E5"])
})

it("Should build notes for easy mode in treble clef", () => {
    const result = generateNotes(false, 9, "treble", "easy");
    expect(result.map(e => e.name)).toEqual(["E4", "G4", "B4", "D5", "F5", "F4", "A4", "C5", "E5"])
})

it("Should build notes for medium mode in treble clef", () => {
    const result = generateNotes(false, 17, "treble", "medium");
    expect(result.map(e => e.name)).toEqual(["A3", "C4", "E4", "G4", "B4", "D5", "F5", "A5", "C6", "B3", "D4", "F4", "A4", "C5", "E5", "G5", "B5"])
})

it("Should build notes for hard mode in treble clef", () => {
    const result = generateNotes(false, 28, "treble", "hard");
    expect(result.map(e => e.name)).toEqual(["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5", "D5", "E5", "F5", "G5", "A5", "B5", "C6", "D6", "E6", "F6", "G6", "A6", "B6", "C7", "D7", "E7", "F7", "G7", "A7", "B7"])
})

