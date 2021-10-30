import { Level } from "./levelType";

export const RESET_NOTE = "C8";
export const BASIC_LEVELS = [Level.Easy, Level.Medium, Level.Hard];
export const RANDOMIZE_LEVELS = [...BASIC_LEVELS, Level.Grand];
export const SCALE_LEVELS = [
  Level.C_Major,
  Level.G_Major,
  Level.D_Major,
  Level.A_Major,
  Level.E_Major,
  Level.B_Major,
  Level.F_Sharp_Major,
  Level.G_Flat_Major,
  Level.D_Flat_Major,
  Level.C_Sharp_Major,
  Level.A_Flat_Major,
  Level.E_Flat_Major,
  Level.B_Flat_Major,
  Level.F_Major,
];
