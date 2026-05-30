import { Tags } from "lucide-react";
import { Button } from "~/components/commons/Button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/commons/Dialog";
import { Dialog, DialogTrigger } from "~/components/ui/dialog";
import GroupSection from "./GroupSection";

function GroupManagementDialog() {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <Tags size="1rem" />
            Group Management
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader className="p-4">
            <DialogTitle>Group Management</DialogTitle>
          </DialogHeader>
          <GroupSection />
        </DialogContent>
      </Dialog>
    </>
  );
}

export default GroupManagementDialog;
