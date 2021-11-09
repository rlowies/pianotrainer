import { generateNotes, INote } from "../NoteService/Note.service";
import Vex from "vexflow";
import { Chord, Level } from "../../types/levelType";
import { StaffConfig } from "../../types/staffConfig";
import { BASIC_LEVELS, RANDOMIZE_LEVELS, SCALE_LEVELS } from "../../types/constants";

export const VF = Vex.Flow;

export enum Clef {
  Bass = "bass",
  Treble = "treble",
  Grand = "grand",
}

export const staffX = 10;
export const staffY = 100;

const red = { fillStyle: "#cc0000", strokeStyle: "#cc0000" };
const green = { fillStyle: "#00cc00", strokeStyle: "#00cc00" };
const black = { fillStyle: "#000000", strokeStyle: "#000000" };

export const updateVoice = (config: StaffConfig[], level: Level, clef: Clef, refreshContext: boolean = false) => {
  const context = config[0].staff.getContext();
  
  if(refreshContext) {
    context.clear();
    renderGrandStaff(context, config);
  }

  config.forEach((staff) => {
    if (refreshContext) {
      staff.staff.setContext(context).draw();
    }
    const notes = staff.playableNotes;
    const voice = new VF.Voice({ num_beats: notes.length, beat_value: 4 });
    voice.addTickables(notes.map((x) => x.note));
    // Format and justify the notes to 400 pixels.
    new VF.Formatter().joinVoices([voice]).format([voice], getNoteSpacing(level, clef));
    voice.draw(staff.staff.getContext(), staff.staff);
  });
};

const getNoteSpacing = (level: Level, clef: Clef) => {
  if (clef === Clef.Grand) {
    return 350;
  }
  if (SCALE_LEVELS.includes(level)) {
    return 300;
  }

  return 400;
};

export const updateNotes = (staff: StaffConfig, note: string): boolean => {
  const { playableNotes, currentStaffNoteIndex } = staff;
  const numNotes = playableNotes.length;
  const currentNoteIndex = currentStaffNoteIndex % numNotes;
  const currentNoteToPlay: INote = playableNotes[currentNoteIndex];
  const notes = playableNotes.map((x) => x.note);

  if (notes.every((n: any) => n?.style?.fillStyle === green.fillStyle)) return false;

  if (currentNoteIndex < numNotes && currentNoteIndex === currentNoteToPlay.order % numNotes) {
    if (note === currentNoteToPlay.value) {
      notes[currentNoteIndex].setStyle(green);
      staff.currentStaffNoteIndex += 1;
      return true;
    } else {
      notes[currentNoteIndex].setStyle(red);
    }
  }

  return false;
};

export const resetStaff = (
  clef: Clef,
  config: StaffConfig[],
  staffWidth: number,
  numNotes: number,
  level: Level,
  timeSignature: string,
  numMeasures: number,
  chord: Chord,
  prevNotes?: INote[][]
): StaffConfig[] => {
  const context = config[0].staff.getContext();
  context.clear();
  const measures =
    clef === Clef.Grand
      ? buildGrandStaff(staffWidth, level, numNotes, chord, prevNotes)
      : buildBassOrTrebleStaff(staffWidth, level, numNotes, clef, numMeasures, prevNotes);

  config.forEach((staffType: StaffConfig, i: number) => {
    staffType.playableNotes = measures[i].playableNotes;
    staffType.staff = measures[i].staff;

    if (i === 0) {
      staffType.staff.addClef(clef === Clef.Grand ? Clef.Treble : clef).addTimeSignature(timeSignature);
    }

    if (i === 2 && clef === Clef.Grand) {
      staffType.staff.addClef(Clef.Bass).addTimeSignature(timeSignature);
      renderGrandStaff(context, config);
    }

    staffType.currentStaffNoteIndex = 0;
    staffType.staff.setContext(context).draw();
  });

  updateVoice(config, level, clef, false);
  return config;
};

export const buildBassOrTrebleStaff = (
  width: number,
  level: Level,
  numNotes: number,
  clef: Clef,
  numMeasures: number,
  prevNotes?: INote[][]
): StaffConfig[] => {
  const measures: StaffConfig[] = [];
  for (let measure = 0; measure < numMeasures; measure++) {
    measures.push({
      staff: new VF.Stave(measure === 0 ? staffX : staffX + width, staffY, width),
      playableNotes: getNotesForLevel(level, numNotes, clef, numMeasures, measure, prevNotes),
      currentStaffNoteIndex: 0,
    });
  }
  return measures;
};

const getNotesForLevel = (
  level: Level,
  numNotes: number,
  clef: Clef,
  numMeasures: number,
  currentMeasure: number,
  prevNotes?: INote[][]
): INote[] => {
  const isRandomLevel = RANDOMIZE_LEVELS.includes(level);
  const allNotes = prevNotes?.[0] ?? generateNotes(isRandomLevel, numNotes, clef, level);
  const half = Math.ceil(allNotes.length / 2);
  const firstHalf = allNotes.slice(0, half);
  const secondHalf = allNotes.slice(0, half).reverse();

  const isScaleLevel = SCALE_LEVELS.includes(level);
  if (isScaleLevel) {
    if (currentMeasure === 0) {
      return generateNotes(isRandomLevel, numNotes, clef, level);
    } else {
      return generateNotes(isRandomLevel, numNotes, clef, level, undefined, true);
    }
  }

  if (currentMeasure === 0) {
    return numMeasures > 1 ? firstHalf : prevNotes?.[0] ?? allNotes;
  }

  return prevNotes?.[1] ?? secondHalf;
};

export const buildGrandStaff = (
  width: number,
  level: Level,
  numNotes: number,
  chord?: Chord,
  prevNotes?: INote[][]
): StaffConfig[] => {
  const isRandomLevel = RANDOMIZE_LEVELS.includes(level);
  const measures: StaffConfig[] = [
    {
      staff: new VF.Stave(staffX, staffY, width),
      playableNotes: prevNotes?.[0] ?? generateNotes(isRandomLevel, numNotes, Clef.Treble, level, chord),
      currentStaffNoteIndex: 0,
    },
    {
      staff: new VF.Stave(staffX + width, staffY, width),
      playableNotes: prevNotes?.[1] ?? generateNotes(isRandomLevel, numNotes, Clef.Treble, level, chord, true),
      currentStaffNoteIndex: 0,
    },
    {
      staff: new VF.Stave(staffX, staffY + 100, width),
      playableNotes: prevNotes?.[2] ?? generateNotes(isRandomLevel, numNotes, Clef.Bass, level, chord),
      currentStaffNoteIndex: 0,
    },
    {
      staff: new VF.Stave(staffX + width, staffY + 100, width),
      playableNotes: prevNotes?.[3] ?? generateNotes(isRandomLevel, numNotes, Clef.Bass, level, chord, true),
      currentStaffNoteIndex: 0,
    },
  ];

  return measures;
};

export const renderGrandStaff = (context: Vex.IRenderContext, staffs: StaffConfig[]) => {
  const topStaff = staffs[0].staff;
  const topStaff2 = staffs[1].staff;
  const bottomStaff = staffs[2].staff;
  const bottomStaff2 = staffs[3].staff;

  const brace = new VF.StaveConnector(topStaff, bottomStaff);
  const lineRight = new VF.StaveConnector(topStaff2, bottomStaff2).setType(0);
  const lineLeft = new VF.StaveConnector(topStaff, bottomStaff).setType(1);

  brace.setContext(context).draw();
  lineRight.setContext(context).draw();
  lineLeft.setContext(context).draw();
};

export const determineStaffIndex = (level: Level, note: string, staffs: StaffConfig[], initialClef: Clef) => {
  const o = note.substr(1, 1);
  const currentOctave = o === "#" || o === "B" ? +note.substr(2, 2) : +note.substr(1, 1);

  if (initialClef === Clef.Grand) return getGrandStaffIndex(currentOctave, staffs);
  if (SCALE_LEVELS.includes(level))
    return staffs.some((s) => s.playableNotes.map((x) => x.note).every((n: any) => n?.style?.fillStyle === green.fillStyle))
      ? 1
      : 0;
  if (BASIC_LEVELS.includes(level)) return 0;

  return 0;
};

const getGrandStaffIndex = (octave: number, staffs: StaffConfig[]): number => {
  if (octave >= 4) {
    return staffs.some(
      (s, i) => i < 2 && s.playableNotes.map((x) => x.note).every((n: any) => n?.style?.fillStyle === green.fillStyle)
    )
      ? 1
      : 0;
  } else {
    return staffs.some(
      (s, i) => i >= 2 && s.playableNotes.map((x) => x.note).every((n: any) => n?.style?.fillStyle === green.fillStyle)
    )
      ? 3
      : 2;
  }
};

export const resetNoteValidation = (
  staffConfig: StaffConfig[],
  notesPerMeasure: number,
  initialClef: Clef,
  clefType: Clef,
  width: number,
  level: Level,
  timeSignature: string,
  numMeasures: number,
  chord: Chord
): StaffConfig[] => {
    const newConfig = resetStaff(
      initialClef === Clef.Grand ? initialClef : clefType,
      staffConfig,
      width,
      notesPerMeasure,
      level,
      timeSignature,
      numMeasures,
      chord,
      SCALE_LEVELS.includes(level) ? [] : [...staffConfig.map((staff) => staff.playableNotes)]
    );
    const allNotes = staffConfig.map((measure) => measure.playableNotes.map((x) => x.note));
    allNotes.forEach((staff) => staff.forEach((note) => note.setStyle(black)));
    return newConfig;

};
