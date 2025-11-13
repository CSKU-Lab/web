import { atom } from "jotai";
import type { TestCase } from "../_types/testcase";
import { saveStatusAtom } from "./save-status.store";

export const testCasesAtom = atom<TestCase[]>([]);

export const initialTestCasesAtom = atom(
  null,
  (_get, set, testCases: TestCase[]) => {
    set(testCasesAtom, testCases);
  },
);

export const removeTestCaseAtom = atom(null, (get, set, order: number) => {
  const currentTestCases = get(testCasesAtom);
  const otherTestCases = currentTestCases.filter((tc) => tc.order !== order);
  const reorderedTestCases = otherTestCases.map((tc, index) => ({
    ...tc,
    order: currentTestCases.length - index - 1,
  }));
  set(testCasesAtom, reorderedTestCases);
  set(saveStatusAtom, "UnSaved");
});

export const addTestCaseAtom = atom(null, (get, set) => {
  const currentTestCases = get(testCasesAtom);
  const newTestCase: TestCase = {
    order: currentTestCases.length + 1,
    input: "",
    output: "",
  };
  set(testCasesAtom, [newTestCase, ...currentTestCases]);
  set(saveStatusAtom, "UnSaved");
});

export const updateTestCaseInputAtom = atom(
  null,
  (get, set, payload: { order: number; newInput: string }) => {
    const currentTestCases = get(testCasesAtom);
    const updatedTestCases = currentTestCases.map((tc) =>
      tc.order === payload.order ? { ...tc, input: payload.newInput } : tc,
    );
    set(testCasesAtom, updatedTestCases);
    set(saveStatusAtom, "UnSaved");
  },
);
