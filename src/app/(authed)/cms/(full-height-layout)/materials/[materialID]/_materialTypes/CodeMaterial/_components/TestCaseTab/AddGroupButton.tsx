import { Plus } from "lucide-react";
import { useSetAtom } from "jotai";
import { addGroupAtom } from "../../_stores/testcase-groups.store";
import { Button } from "~/components/commons/Button";

function AddGroupButton() {
  const onAddGroup = useSetAtom(addGroupAtom);

  return (
    <Button onClick={onAddGroup}>
      <Plus size="1rem" />
      Add Group
    </Button>
  );
}

export default AddGroupButton;
