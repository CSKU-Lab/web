import { LogOutIcon, EllipsisVertical } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import useCoreSection from "../_hooks/useCoreSectionUnenroll";

interface CardOptionsProps {
  sectionID: string;
}

export default function CardOptions({ sectionID }: CardOptionsProps) {
  const { unenroll } = useCoreSection(sectionID);
  const handleUnenrollClick = async () => {
    unenroll.mutate();
  };
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            aria-label="More Options"
            className="rounded-full"
          >
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuGroup>
            <DropdownMenuItem
              variant="destructive"
              onClick={(e) => {
                e.stopPropagation();
                handleUnenrollClick();
              }}
            >
              <LogOutIcon />
              Unenroll
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
