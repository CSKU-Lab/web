import { atom } from "jotai";
import type { TestCase } from "../_types/testcase";

export const testcasesAtom = atom<TestCase[]>([]);

export const removeTestCaseAtom = atom(null, (get, set, order: number) => {
  const currentTestCases = get(testcasesAtom);
  const otherTestCases = currentTestCases.filter((tc) => tc.order !== order);
  const reorderedTestCases = otherTestCases.map((tc, index) => ({
    ...tc,
    order: currentTestCases.length - index - 1,
  }));
  set(testcasesAtom, reorderedTestCases);
});

export const addTestCaseAtom = atom(null, (get, set) => {
  const currentTestCases = get(testcasesAtom);
  const newTestCase: TestCase = {
    order: currentTestCases.length + 1,
    input: "",
    output: "",
  };
  set(testcasesAtom, [newTestCase, ...currentTestCases]);
});

export const updateTestCaseInputAtom = atom(
  null,
  (get, set, payload: { order: number; newInput: string }) => {
    const currentTestCases = get(testcasesAtom);
    const updatedTestCases = currentTestCases.map((tc) =>
      tc.order === payload.order ? { ...tc, input: payload.newInput } : tc,
    );
    set(testcasesAtom, updatedTestCases);
  },
);
