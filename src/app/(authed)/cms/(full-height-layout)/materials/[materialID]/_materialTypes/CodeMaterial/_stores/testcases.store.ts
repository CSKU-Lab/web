import { atom } from "jotai";
import type { TestCase } from "../_types/testcase";
import { saveStatusAtom } from "./save-status.store";

export const testCasesAtom = atom<TestCase[]>([]);

export const selectedTestCaseOrdersAtom = atom<number[]>([]);

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
  set(selectedTestCaseOrdersAtom, (prev) => prev.filter((o) => o !== order));
  set(saveStatusAtom, "UnSaved");
});

export const removeSelectedTestCasesAtom = atom(null, (get, set) => {
  const selectedOrders = get(selectedTestCaseOrdersAtom);
  if (selectedOrders.length === 0) return;

  const currentTestCases = get(testCasesAtom);
  const filteredTestCases = currentTestCases.filter(
    (tc) => !selectedOrders.includes(tc.order),
  );
  const reorderedTestCases = filteredTestCases.map((tc, index) => ({
    ...tc,
    order: filteredTestCases.length - index - 1,
  }));
  set(testCasesAtom, reorderedTestCases);
  set(selectedTestCaseOrdersAtom, []);
  set(saveStatusAtom, "UnSaved");
});

export const duplicateSelectedTestCasesAtom = atom(null, (get, set) => {
  const selectedOrders = get(selectedTestCaseOrdersAtom);
  if (selectedOrders.length === 0) return;

  const currentTestCases = get(testCasesAtom);
  const selectedTestCases = currentTestCases.filter((tc) =>
    selectedOrders.includes(tc.order),
  );

  const newTestCases: TestCase[] = selectedTestCases.map((tc) => ({
    ...tc,
    order: currentTestCases.length + 1,
  }));

  set(testCasesAtom, [...newTestCases, ...currentTestCases]);
  set(selectedTestCaseOrdersAtom, []);
  set(saveStatusAtom, "UnSaved");
});

export const selectAllTestCasesAtom = atom(null, (get, set) => {
  const testCases = get(testCasesAtom);
  set(selectedTestCaseOrdersAtom, testCases.map((tc) => tc.order));
});

export const deselectAllTestCasesAtom = atom(null, (_get, set) => {
  set(selectedTestCaseOrdersAtom, []);
});

export const toggleTestCaseSelectionAtom = atom(
  null,
  (get, set, order: number) => {
    const selectedOrders = get(selectedTestCaseOrdersAtom);
    if (selectedOrders.includes(order)) {
      set(selectedTestCaseOrdersAtom, selectedOrders.filter((o) => o !== order));
    } else {
      set(selectedTestCaseOrdersAtom, [...selectedOrders, order]);
    }
  },
);

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
