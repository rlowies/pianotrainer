import { generateNotes, INote } from "../NoteService/Note.service";
import Vex from "vexflow";
import { Level } from "../../types/levelType";
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
export const black = { fillStyle: "#000000", strokeStyle: "#000000" };

export const updateVoice = (config: StaffConfig[]) => {
  config.forEach((staff) => {
    const notes = staff.playableNotes;
    const voice = new VF.Voice({ num_beats: notes.length, beat_value: 4 });
    voice.addTickables(notes.map((x) => x.note));
    // Format and justify the notes to 400 pixels.
    new VF.Formatter().joinVoices([voice]).format([voice], config.length > 1 ? 300 : 400);
    voice.draw(staff.staff.getContext(), staff.staff);
  });
};

export const updateNotes = (staff: StaffConfig, note: string): boolean => {
  const { playableNotes, currentStaffNoteIndex } = staff;
  const numNotes = playableNotes.length;
  const currentNoteIndex = currentStaffNoteIndex % numNotes;
  const currentNoteToPlay: INote = playableNotes[currentNoteIndex];
  const notes = playableNotes.map((x) => x.note);

  if (notes.every((n: any) => n?.style?.fillStyle === green.fillStyle)) return true;

  if (currentNoteIndex < numNotes && currentNoteIndex === currentNoteToPlay.order % numNotes) {
    if (note === currentNoteToPlay.name) {
      notes[currentNoteIndex].setStyle(green);
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
  prevNotes?: INote[][]
): StaffConfig[] => {
  const context = config[0].staff.getContext();
  context.clear();
  const measures =
    clef === Clef.Grand
      ? buildGrandStaff(staffWidth, level, numNotes, prevNotes)
      : buildBassOrTrebleStaff(staffWidth, level, numNotes, clef, numMeasures, prevNotes);

  config.forEach((staffType: StaffConfig, i: number) => {
    staffType.playableNotes = measures[i].playableNotes;
    staffType.staff = measures[i].staff;

    if (i === 0) {
      staffType.staff.addClef(clef === Clef.Grand ? Clef.Treble : clef).addTimeSignature(timeSignature);
    }

    if (i === 1 && clef === Clef.Grand) {
      staffType.staff.addClef(Clef.Bass).addTimeSignature(timeSignature);
      renderGrandStaff(context, config);
    }

    staffType.currentStaffNoteIndex = 0;
    staffType.staff.setContext(context).draw();
  });

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
  const allNotes = prevNotes?.[0] ?? generateNotes(RANDOMIZE_LEVELS.includes(level), numNotes, clef, level);
  const [a, b, c, d, e, f, g, h] = allNotes;

  const measures: StaffConfig[] = [
    {
      staff: new VF.Stave(staffX, staffY, width),
      playableNotes: numMeasures > 1 ? [a, b, c, d] : prevNotes?.[0] ?? allNotes,
      currentStaffNoteIndex: 0,
    },
  ];

  if (numMeasures > 1) {
    measures.push({
      staff: new VF.Stave(staffX + width, staffY, width),
      playableNotes: prevNotes?.[1] ?? [e, f, g, h],
      currentStaffNoteIndex: 0,
    });
  }
  return measures;
};

export const buildGrandStaff = (width: number, level: Level, numNotes: number, prevNotes?: INote[][]): StaffConfig[] => {
  const measures: StaffConfig[] = [
    {
      staff: new VF.Stave(staffX, staffY, width),
      playableNotes: prevNotes?.[0] ?? generateNotes(RANDOMIZE_LEVELS.includes(level), numNotes, Clef.Treble, level),
      currentStaffNoteIndex: 0,
    },
    {
      staff: new VF.Stave(staffX, staffY + 100, width),
      playableNotes: prevNotes?.[1] ?? generateNotes(RANDOMIZE_LEVELS.includes(level), numNotes, Clef.Bass, level),
      currentStaffNoteIndex: 0,
    },
  ];

  return measures;
};

export const renderGrandStaff = (context: Vex.IRenderContext, staffs: StaffConfig[]) => {
  const topStaff = staffs[0].staff;
  const bottomStaff = staffs[1].staff;
  const brace = new VF.StaveConnector(topStaff, bottomStaff);
  const lineRight = new VF.StaveConnector(topStaff, bottomStaff).setType(0);
  const lineLeft = new VF.StaveConnector(topStaff, bottomStaff).setType(1);
  brace.setContext(context).draw();
  lineRight.setContext(context).draw();
  lineLeft.setContext(context).draw();
};

export const determineStaffIndex = (level: Level, currentOctave: number, staffs: StaffConfig[]) => {
  if (level === Level.Grand) return currentOctave >= 4 ? 0 : 1;
  if (SCALE_LEVELS.includes(level))
    return staffs.some((s) => s.playableNotes.map((x) => x.note).every((n: any) => n?.style?.fillStyle === green.fillStyle))
      ? 1
      : 0;
  if (BASIC_LEVELS.includes(level)) return 0;

  return 0;
};
