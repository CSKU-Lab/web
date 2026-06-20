import { atom } from "jotai";
import { generateId } from "~/utils/generate-id";
import type { TestCase, TestCaseGroup } from "~/features/cms/materials/types/CodeMaterial/types/testcase-group";
import { saveStatusAtom } from "~/features/cms/materials/types/CodeMaterial/stores/save-status.store";
import { isOwnerAtom } from "~/features/cms/materials/types/CodeMaterial/stores/owner.store";

export const testCaseGroupsAtom = atom<TestCaseGroup[]>([]);

export const selectedGroupIdsAtom = atom<string[]>([]);

export const selectedTestCaseIdsAtom = atom<Record<string, string[]>>({});

const getSelectedTestCaseIdsInGroup = (
  get: any,
  groupId: string,
): string[] => {
  return get(selectedTestCaseIdsAtom)[groupId] || [];
};

export const initialTestCaseGroupsAtom = atom(
  null,
  (_get, set, groups: TestCaseGroup[]) => {
    set(testCaseGroupsAtom, groups);
  },
);

const triggerUnSaved = (get: any, set: any) => {
  const isOwner = get(isOwnerAtom);
  if (isOwner) {
    set(saveStatusAtom, "UnSaved");
  }
};

export const addGroupAtom = atom(null, (get, set) => {
  const groups = get(testCaseGroupsAtom);
  const newGroup: TestCaseGroup = {
    id: generateId(),
    name: "Sample Tests",
    score: 1,
    order: groups.length,
    test_cases: [],
  };
  set(testCaseGroupsAtom, [...groups, newGroup]);
  triggerUnSaved(get, set);
});

export const removeGroupAtom = atom(null, (get, set, groupId: string) => {
  const groups = get(testCaseGroupsAtom);
  const filteredGroups = groups.filter((g) => g.id !== groupId);
  const reorderedGroups = filteredGroups.map((g, index) => ({
    ...g,
    order: index,
  }));
  set(testCaseGroupsAtom, reorderedGroups);
  set(selectedGroupIdsAtom, (prev: string[]) =>
    prev.filter((id) => id !== groupId),
  );
  set(selectedTestCaseIdsAtom, (prev: Record<string, string[]>) => {
    const { [groupId]: _, ...rest } = prev;
    return rest;
  });
  triggerUnSaved(get, set);
});

export const removeSelectedGroupsAtom = atom(null, (get, set) => {
  const selectedGroupIds = get(selectedGroupIdsAtom);
  if (selectedGroupIds.length === 0) return;

  const groups = get(testCaseGroupsAtom);
  const filteredGroups = groups.filter(
    (g) => !selectedGroupIds.includes(g.id),
  );
  const reorderedGroups = filteredGroups.map((g, index) => ({
    ...g,
    order: index,
  }));
  set(testCaseGroupsAtom, reorderedGroups);
  set(selectedGroupIdsAtom, []);
  set(selectedTestCaseIdsAtom, (prev: Record<string, string[]>) => {
    const newPrev = { ...prev };
    selectedGroupIds.forEach((id) => {
      delete newPrev[id];
    });
    return newPrev;
  });
  triggerUnSaved(get, set);
});

export const duplicateGroupAtom = atom(null, (get, set, groupId: string) => {
  const groups = get(testCaseGroupsAtom);
  const groupIndex = groups.findIndex((g) => g.id === groupId);
  if (groupIndex === -1) return;

  const originalGroup = groups[groupIndex];
  const duplicatedGroup: TestCaseGroup = {
    ...originalGroup,
    id: generateId(),
    name: `${originalGroup.name} (Copy)`,
    order: groups.length,
    test_cases: originalGroup.test_cases.map((tc) => ({
      ...tc,
      id: generateId(),
    })),
  };

  const newGroups = [...groups];
  newGroups.splice(groupIndex + 1, 0, duplicatedGroup);
  const reorderedGroups = newGroups.map((g, index) => ({
    ...g,
    order: index,
  }));
  set(testCaseGroupsAtom, reorderedGroups);
  triggerUnSaved(get, set);
});

export const updateGroupAtom = atom(
  null,
  (get, set, payload: { groupId: string; name?: string; score?: number }) => {
    const groups = get(testCaseGroupsAtom);
    const updatedGroups = groups.map((g) =>
      g.id === payload.groupId
        ? {
            ...g,
            ...(payload.name !== undefined && { name: payload.name }),
            ...(payload.score !== undefined && { score: payload.score }),
          }
        : g,
    );
    set(testCaseGroupsAtom, updatedGroups);
    triggerUnSaved(get, set);
  },
);

export const moveGroupAtom = atom(null, (get, set, payload: { fromIndex: number; toIndex: number }) => {
  const groups = get(testCaseGroupsAtom);
  const { fromIndex, toIndex } = payload;
  const movedGroups = [...groups];
  const [removed] = movedGroups.splice(fromIndex, 1);
  movedGroups.splice(toIndex, 0, removed);
  const reorderedGroups = movedGroups.map((g, index) => ({
    ...g,
    order: index,
  }));
  set(testCaseGroupsAtom, reorderedGroups);
  triggerUnSaved(get, set);
});

export const addTestCaseToGroupAtom = atom(
  null,
  (get, set, groupId: string) => {
    const groups = get(testCaseGroupsAtom);
    const groupIndex = groups.findIndex((g) => g.id === groupId);
    if (groupIndex === -1) return;

    const group = groups[groupIndex];
    const newTestCase: TestCase = {
      id: generateId(),
      order: group.test_cases.length + 1,
      input: "",
      output: "",
    };

    const updatedGroups = [...groups];
    updatedGroups[groupIndex] = {
      ...group,
      test_cases: [...group.test_cases, newTestCase],
    };
    set(testCaseGroupsAtom, updatedGroups);
    triggerUnSaved(get, set);
  },
);

export const removeTestCaseAtom = atom(
  null,
  (get, set, payload: { groupId: string; testCaseId: string }) => {
    const groups = get(testCaseGroupsAtom);
    const groupIndex = groups.findIndex((g) => g.id === payload.groupId);
    if (groupIndex === -1) return;

    const group = groups[groupIndex];
    const filteredTestCases = group.test_cases.filter(
      (tc) => tc.id !== payload.testCaseId,
    );
    const reorderedTestCases = filteredTestCases.map((tc, index) => ({
      ...tc,
      order: index + 1,
    }));

    const updatedGroups = [...groups];
    updatedGroups[groupIndex] = {
      ...group,
      test_cases: reorderedTestCases,
    };
    set(testCaseGroupsAtom, updatedGroups);
    set(selectedTestCaseIdsAtom, (prev: Record<string, string[]>) => ({
      ...prev,
      [payload.groupId]: getSelectedTestCaseIdsInGroup(get, payload.groupId).filter(
        (id) => id !== payload.testCaseId,
      ),
    }));
    triggerUnSaved(get, set);
  },
);

export const removeSelectedTestCasesAtom = atom(null, (get, set) => {
  const groups = get(testCaseGroupsAtom);
  const selectedTestCaseIds = get(selectedTestCaseIdsAtom);

  const updatedGroups = groups.map((group) => {
    const selectedIds = selectedTestCaseIds[group.id] || [];
    if (selectedIds.length === 0) return group;

    const filteredTestCases = group.test_cases.filter(
      (tc) => !selectedIds.includes(tc.id),
    );
    const reorderedTestCases = filteredTestCases.map((tc, index) => ({
      ...tc,
      order: index + 1,
    }));
    return { ...group, test_cases: reorderedTestCases };
  });

  set(testCaseGroupsAtom, updatedGroups);
  set(selectedTestCaseIdsAtom, {});
  triggerUnSaved(get, set);
});

export const duplicateTestCaseAtom = atom(
  null,
  (get, set, payload: { groupId: string; testCaseId: string }) => {
    const groups = get(testCaseGroupsAtom);
    const groupIndex = groups.findIndex((g) => g.id === payload.groupId);
    if (groupIndex === -1) return;

    const group = groups[groupIndex];
    const testCaseIndex = group.test_cases.findIndex(
      (tc) => tc.id === payload.testCaseId,
    );
    if (testCaseIndex === -1) return;

    const originalTestCase = group.test_cases[testCaseIndex];
    const duplicatedTestCase: TestCase = {
      ...originalTestCase,
      id: generateId(),
      order: group.test_cases.length + 1,
    };

    const updatedGroups = [...groups];
    updatedGroups[groupIndex] = {
      ...group,
      test_cases: [...group.test_cases, duplicatedTestCase],
    };
    set(testCaseGroupsAtom, updatedGroups);
    triggerUnSaved(get, set);
  },
);

export const duplicateSelectedTestCasesAtom = atom(null, (get, set) => {
  const groups = get(testCaseGroupsAtom);
  const selectedTestCaseIds = get(selectedTestCaseIdsAtom);

  const updatedGroups = groups.map((group) => {
    const selectedIds = selectedTestCaseIds[group.id] || [];
    if (selectedIds.length === 0) return group;

    const test_casesToDuplicate = group.test_cases.filter((tc) =>
      selectedIds.includes(tc.id),
    );
    const duplicatedTestCases: TestCase[] = test_casesToDuplicate.map((tc) => ({
      ...tc,
      id: generateId(),
      order: group.test_cases.length + 1,
    }));

    return {
      ...group,
      test_cases: [...group.test_cases, ...duplicatedTestCases],
    };
  });

  set(testCaseGroupsAtom, updatedGroups);
  set(selectedTestCaseIdsAtom, {});
  triggerUnSaved(get, set);
});

export const moveTestCaseAtom = atom(
  null,
  (get, set, payload: { groupId: string; fromIndex: number; toIndex: number }) => {
    const groups = get(testCaseGroupsAtom);
    const groupIndex = groups.findIndex((g) => g.id === payload.groupId);
    if (groupIndex === -1) return;

    const group = groups[groupIndex];
    const { fromIndex, toIndex } = payload;
    const movedTestCases = [...group.test_cases];
    const [removed] = movedTestCases.splice(fromIndex, 1);
    movedTestCases.splice(toIndex, 0, removed);
    const reorderedTestCases = movedTestCases.map((tc, index) => ({
      ...tc,
      order: index + 1,
    }));

    const updatedGroups = [...groups];
    updatedGroups[groupIndex] = {
      ...group,
      test_cases: reorderedTestCases,
    };
    set(testCaseGroupsAtom, updatedGroups);
    triggerUnSaved(get, set);
  },
);

export const moveTestCaseToGroupAtom = atom(
  null,
  (get, set, payload: { fromGroupId: string; toGroupId: string; testCaseId: string }) => {
    const groups = get(testCaseGroupsAtom);
    const fromGroupIndex = groups.findIndex((g) => g.id === payload.fromGroupId);
    const toGroupIndex = groups.findIndex((g) => g.id === payload.toGroupId);
    if (fromGroupIndex === -1 || toGroupIndex === -1) return;

    const fromGroup = groups[fromGroupIndex];
    const toGroup = groups[toGroupIndex];
    const testCase = fromGroup.test_cases.find((tc) => tc.id === payload.testCaseId);
    if (!testCase) return;

    const updatedFromGroupTestCases = fromGroup.test_cases
      .filter((tc) => tc.id !== payload.testCaseId)
      .map((tc, index) => ({ ...tc, order: index + 1 }));

    const updatedToGroupTestCases = [
      ...toGroup.test_cases,
      { ...testCase, order: toGroup.test_cases.length + 1 },
    ];

    const updatedGroups = [...groups];
    updatedGroups[fromGroupIndex] = {
      ...fromGroup,
      test_cases: updatedFromGroupTestCases,
    };
    updatedGroups[toGroupIndex] = {
      ...toGroup,
      test_cases: updatedToGroupTestCases,
    };
    set(testCaseGroupsAtom, updatedGroups);
    set(selectedTestCaseIdsAtom, (prev: Record<string, string[]>) => ({
      ...prev,
      [payload.fromGroupId]: getSelectedTestCaseIdsInGroup(get, payload.fromGroupId).filter(
        (id) => id !== payload.testCaseId,
      ),
    }));
    triggerUnSaved(get, set);
  },
);

export const updateTestCaseAtom = atom(
  null,
  (get, set, payload: { groupId: string; testCaseId: string; input?: string; output?: string }) => {
    const groups = get(testCaseGroupsAtom);
    const groupIndex = groups.findIndex((g) => g.id === payload.groupId);
    if (groupIndex === -1) return;

    const group = groups[groupIndex];
    const testCaseIndex = group.test_cases.findIndex(
      (tc) => tc.id === payload.testCaseId,
    );
    if (testCaseIndex === -1) return;

    const updatedTestCases = [...group.test_cases];
    updatedTestCases[testCaseIndex] = {
      ...updatedTestCases[testCaseIndex],
      ...(payload.input !== undefined && { input: payload.input }),
      ...(payload.output !== undefined && { output: payload.output }),
    };

    const updatedGroups = [...groups];
    updatedGroups[groupIndex] = {
      ...group,
      test_cases: updatedTestCases,
    };
    set(testCaseGroupsAtom, updatedGroups);
    triggerUnSaved(get, set);
  },
);

export const toggleGroupSelectionAtom = atom(
  null,
  (get, set, groupId: string) => {
    const selected = get(selectedGroupIdsAtom);
    if (selected.includes(groupId)) {
      set(selectedGroupIdsAtom, selected.filter((id) => id !== groupId));
    } else {
      set(selectedGroupIdsAtom, [...selected, groupId]);
    }
  },
);

export const selectAllGroupsAtom = atom(null, (get, set) => {
  const groups = get(testCaseGroupsAtom);
  set(selectedGroupIdsAtom, groups.map((g) => g.id));
});

export const deselectAllGroupsAtom = atom(null, (_get, set) => {
  set(selectedGroupIdsAtom, []);
});

export const toggleTestCaseSelectionAtom = atom(
  null,
  (get, set, payload: { groupId: string; testCaseId: string }) => {
    const selected = get(selectedTestCaseIdsAtom);
    const groupSelected = selected[payload.groupId] || [];
    let newGroupSelected: string[];

    if (groupSelected.includes(payload.testCaseId)) {
      newGroupSelected = groupSelected.filter((id) => id !== payload.testCaseId);
    } else {
      newGroupSelected = [...groupSelected, payload.testCaseId];
    }

    set(selectedTestCaseIdsAtom, {
      ...selected,
      [payload.groupId]: newGroupSelected,
    });
  },
);

export const selectAllTestCasesInGroupAtom = atom(
  null,
  (get, set, groupId: string) => {
    const groups = get(testCaseGroupsAtom);
    const group = groups.find((g) => g.id === groupId);
    if (!group) return;

    set(selectedTestCaseIdsAtom, (prev: Record<string, string[]>) => ({
      ...prev,
      [groupId]: group.test_cases.map((tc) => tc.id),
    }));
  },
);

export const deselectAllTestCasesInGroupAtom = atom(
  null,
  (get, set, groupId: string) => {
    set(selectedTestCaseIdsAtom, (prev: Record<string, string[]>) => ({
      ...prev,
      [groupId]: [],
    }));
  },
);

export const selectAllTestCasesAtom = atom(null, (get, set) => {
  const groups = get(testCaseGroupsAtom);
  const allSelected: Record<string, string[]> = {};
  groups.forEach((group) => {
    allSelected[group.id] = group.test_cases.map((tc) => tc.id);
  });
  set(selectedTestCaseIdsAtom, allSelected);
});

export const deselectAllTestCasesAtom = atom(null, (_get, set) => {
  set(selectedTestCaseIdsAtom, {});
});
