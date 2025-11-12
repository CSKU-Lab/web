import { Plus } from "lucide-react";
import { Button } from "~/components/commons/Button";
import TestCaseBlock from "./TestCaseBlock";
import { Fragment } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { addTestCaseAtom, testcasesAtom } from "../../_stores/testcases.store";

function TestCaseTab() {
  const testcases = useAtomValue(testcasesAtom);
  const handleAddTestCase = useSetAtom(addTestCaseAtom);

  return (
    <div className="p-2">
      <div className="flex justify-end gap-2">
        <Button onClick={handleAddTestCase}>
          <Plus size="1rem" />
          Add Test case
        </Button>
      </div>
      <div className="space-y-4 mt-4">
        {testcases.map((testcase, index) => (
          <Fragment key={testcase.order}>
            <TestCaseBlock {...testcase} />
            {index !== testcases.length - 1 ? (
              <div className="h-1 border-b"></div>
            ) : null}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export default TestCaseTab;
