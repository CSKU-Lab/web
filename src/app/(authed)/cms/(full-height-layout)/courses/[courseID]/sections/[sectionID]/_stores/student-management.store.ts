import { atom } from "jotai";
import type { Student } from "~/types/cms-section";

const internalSelectedStudentAtom = atom<Student[]>([]);

export const selectedStudentAtom = atom(
  (get) => get(internalSelectedStudentAtom),
  // Toggle student ID in the selected list
  (get, set, selectedStudent: Student) => {
    const current = get(internalSelectedStudentAtom);

    if (current.some((student) => student.id === selectedStudent.id)) {
      set(
        internalSelectedStudentAtom,
        current.filter((student) => student.id !== selectedStudent.id),
      );
      return;
    }

    set(internalSelectedStudentAtom, [...current, selectedStudent]);
  },
);

export const toggleSelectAllStudentsAtom = atom(
  (get) => get(internalSelectedStudentAtom),
  // Select or deselect all students
  (get, set, allStudents: Student[]) => {
    const current = get(internalSelectedStudentAtom);

    if (current.length === allStudents.length) {
      set(internalSelectedStudentAtom, []);
      return;
    }

    set(internalSelectedStudentAtom, allStudents);
  },
);

export const clearSelectedStudentsAtom = atom(null, (_, set) => {
  set(internalSelectedStudentAtom, []);
});
