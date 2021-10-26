import { INote } from "../services/NoteService/Note.service";

export interface StaffMeasure {
    staff: Vex.Flow.Stave,
    playableNotes: INote[]
    currentStaffNoteIndex: number;
}
