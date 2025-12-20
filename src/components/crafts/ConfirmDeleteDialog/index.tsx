import { ChevronRight, Loader, Trash } from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";
import { Button } from "~/components/commons/Button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/commons/Dialog";
import useGetAffectedEntities from "~/hooks/useGetAffectedEntities";
import type {
  AffectedEntities,
  AffectedType,
} from "~/types/cms-affected-entities";
import Input from "../../commons/Input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../ui/collapsible";
import Loading from "../../commons/Loading";
import { cn } from "~/lib/utils";
import type { ChildrenProps } from "~/types/children-props";
import CopyButton from "./CopyButton";

interface Props extends ChildrenProps {
  type: AffectedType;
  entitiyDetail?: ReactNode;
  confirmText: string;
  id: string;
  onConfirm: () => void;
}

function ConfirmDeleteDialog({
  type,
  id,
  onConfirm,
  confirmText,
  entitiyDetail,
  children,
}: Props) {
  const [confirmInput, setConfirmInput] = useState("");
  const [isDeletable, setIsDeletable] = useState(false);

  const { data: affectedEntities, isFetching } = useGetAffectedEntities(
    type,
    id,
  );

  const handleOnConfirmDelete = () => {
    if (!isDeletable) return;
    onConfirm();
  };

  useEffect(() => {
    setIsDeletable(confirmInput === confirmText);
  }, [confirmInput, confirmText]);

  const renderAffectedEntities = (
    entity: AffectedEntities,
    depth: number = 0,
  ) => {
    if (entity.data.every((e) => e.children === null)) {
      return (
        <Collapsible
          key={entity.type}
          className={cn("text-(--gray-12)", depth === 0 ? "" : "ml-4")}
        >
          <CollapsibleTrigger className="flex items-center gap-1 mt-1 group">
            <ChevronRight
              size="1rem"
              className={`group-data-[state=open]:rotate-90 transition-transform`}
            />
            <h5 className="text-sm font-medium">{entity.type}</h5>
          </CollapsibleTrigger>
          <CollapsibleContent className="ml-5">
            <ul className="list-disc list-inside">
              {entity.data.map((childEntity) => (
                <li key={childEntity.name} className="text-sm text-(--gray-11)">
                  {childEntity.name}
                </li>
              ))}
            </ul>
          </CollapsibleContent>
        </Collapsible>
      );
    }

    return (
      <Collapsible
        key={entity.type}
        className={cn("text-(--gray-12)", depth === 0 ? "" : "ml-4")}
      >
        <CollapsibleTrigger className="flex items-center gap-1 mt-1 group">
          <ChevronRight
            size="1rem"
            className={`group-data-[state=open]:rotate-90 transition-transform`}
          />
          <h5 className="text-sm font-medium">{entity.type}</h5>
        </CollapsibleTrigger>
        <CollapsibleContent>
          {entity.data.map((childEntity) => (
            <Collapsible key={childEntity.name} className="ml-4">
              <CollapsibleTrigger className="flex items-center gap-1 mt-1 group">
                <ChevronRight
                  size="1rem"
                  className={`group-data-[state=open]:rotate-90 transition-transform`}
                />
                <h5 className="text-sm text-(--gray-11)">{childEntity.name}</h5>
              </CollapsibleTrigger>
              <CollapsibleContent>
                {childEntity.children?.map((data) =>
                  renderAffectedEntities(data, depth! + 1),
                )}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </CollapsibleContent>
      </Collapsible>
    );
  };

  return (
    <Dialog>
      {children}
      <DialogContent className="max-h-[500px]">
        <DialogHeader className="p-4">
          <DialogTitle>Confirm Delete ?</DialogTitle>
        </DialogHeader>
        <div className="space-y-1.5 p-4">
          {entitiyDetail}
          <h6 className="text-sm text-(--gray-11) font-medium mt-3">
            This will permanently delete the {type} itself and including:
          </h6>
          <Loading
            isLoading={isFetching}
            fallback={
              <div className="flex flex-col gap-2 items-center justify-center h-36 text-(--gray-12)">
                <Loader size="1rem" className="animate-spin" />
                <h6 className="text-xs">Loading...</h6>
              </div>
            }
          >
            {affectedEntities?.map((data) => renderAffectedEntities(data))}
          </Loading>
        </div>
        <DialogFooter className="sm:flex-col p-4">
          <div className="flex gap-1.5">
            <p className="text-(--gray-11) text-sm shrink-0">Please type</p>
            <CopyButton confirmText={confirmText} />
            <p className="text-(--gray-11) text-sm shrink-0">
              to confirm delete
            </p>
          </div>
          <Input
            placeholder={confirmText}
            value={confirmInput}
            onChange={(e) => setConfirmInput(e.target.value)}
          />
          <Button
            className="w-full h-9"
            variant="danger"
            disabled={!isDeletable || isFetching}
            onClick={handleOnConfirmDelete}
          >
            <Trash size="1rem" />
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const ConfirmDeleteDialogTrigger = DialogTrigger;

export default ConfirmDeleteDialog;
