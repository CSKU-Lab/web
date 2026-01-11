import { Plus, Trash2, Copy, CheckSquare, Square } from "lucide-react";
import { Button } from "~/components/commons/Button";
import TestCaseBlock, { type TestCaseProps } from "./TestCaseBlock";
import { Fragment } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import {
  addTestCaseAtom,
  testCasesAtom,
  selectedTestCaseOrdersAtom,
  removeSelectedTestCasesAtom,
  duplicateSelectedTestCasesAtom,
  selectAllTestCasesAtom,
  deselectAllTestCasesAtom,
} from "../../_stores/testcases.store";

function TestCaseTab() {
  const testcases = useAtomValue(testCasesAtom);
  const selectedOrders = useAtomValue(selectedTestCaseOrdersAtom);
  const handleAddTestCase = useSetAtom(addTestCaseAtom);
  const onRemoveSelected = useSetAtom(removeSelectedTestCasesAtom);
  const onDuplicateSelected = useSetAtom(duplicateSelectedTestCasesAtom);
  const onSelectAll = useSetAtom(selectAllTestCasesAtom);
  const onDeselectAll = useSetAtom(deselectAllTestCasesAtom);

  const isAllSelected =
    testcases.length > 0 && selectedOrders.length === testcases.length;

  return (
    <div className="p-2">
      <div className="flex justify-between items-center gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          {testcases.length > 0 && (
            <button
              onClick={isAllSelected ? onDeselectAll : onSelectAll}
              className="flex items-center gap-1.5 text-sm text-gray-11 hover:text-gray-12 transition-colors"
            >
              {isAllSelected ? (
                <>
                  <CheckSquare size="1rem" />
                  Deselect all
                </>
              ) : (
                <>
                  <Square size="1rem" />
                  Select all
                </>
              )}
            </button>
          )}
          {selectedOrders.length > 0 && (
            <span className="text-sm text-gray-10">
              {selectedOrders.length} selected
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {selectedOrders.length > 0 && (
            <>
              <Button variant="ghost" onClick={onDuplicateSelected}>
                <Copy size="1rem" />
                Duplicate
              </Button>
              <Button variant="danger" onClick={onRemoveSelected}>
                <Trash2 size="1rem" />
                Delete
              </Button>
              <div className="w-px h-6 bg-gray-4 mx-1" />
            </>
          )}
          <Button onClick={handleAddTestCase}>
            <Plus size="1rem" />
            Add Test case
          </Button>
        </div>
      </div>
      <div className="space-y-4 mt-4">
        {testcases.map((testcase, index) => (
          <Fragment key={testcase.order}>
            <TestCaseBlock
              {...testcase}
              isSelected={selectedOrders.includes(testcase.order)}
            />
            {index !== testcases.length - 1 ? (
              <div className="h-1 border-b border-gray-3" />
            ) : null}
          </Fragment>
        ))}
        {testcases.length === 0 && (
          <div className="text-center py-12 text-gray-10">
            <p>No test cases yet</p>
            <p className="text-sm mt-1">
              Click "Add Test case" to create your first test case
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TestCaseTab;
