import { INote } from "../services/NoteService/Note.service";

export interface StaffConfig {
    staff: Vex.Flow.Stave,
    playableNotes: INote[]
    currentStaffNoteIndex: number;
}
