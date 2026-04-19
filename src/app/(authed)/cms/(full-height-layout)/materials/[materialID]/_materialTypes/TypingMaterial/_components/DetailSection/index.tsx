"use client";

import { titleFormatter } from "~/lib/formatters/titleFormatter";
import useGetMaterial from "../../../../_hooks/useGetMaterial";
import HeaderItem from "~/components/crafts/DetailSection/HeaderItem";
import { Eye, Globe, Lock, Pencil, Save } from "lucide-react";
import UserProfileImage from "~/components/Menus/UserProfileImage";
import { useAtom, useAtomValue } from "jotai";
import { saveStatusAtom, typingTextAtom, viewAtom } from "../../_stores/typing-text.store";
import { useParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cmsMaterialService } from "~/services/cms-material.service";
import { queryKeys } from "~/queryKeys";
import { isOwnerAtom } from "../../_stores/owner.store";
import { Button } from "~/components/commons/Button";
import SettingsButton from "./SettingsButton";

function SaveStatus() {
  const saveStatus = useAtomValue(saveStatusAtom);
  const dot = {
    UnSaved: "bg-(--gray-9)",
    Saved: "bg-(--grass-9)",
    Saving: "bg-(--amber-9) animate-pulse",
    SaveFailed: "bg-(--red-9)",
    Offline: "bg-(--gray-9)",
  }[saveStatus];
  const label = {
    UnSaved: "Unsaved",
    Saved: "Saved",
    Saving: "Saving",
    SaveFailed: "Failed to save",
    Offline: "Offline",
  }[saveStatus];
  return (
    <HeaderItem
      label="Status"
      value={
        <div className="flex gap-1.5 items-center">
          <div className={`w-2 h-2 rounded-full ${dot}`} />
          <h4 className="font-medium">{label}</h4>
        </div>
      }
      isLoading={false}
    />
  );
}

function SaveButton() {
  const text = useAtomValue(typingTextAtom);
  const [saveStatus, setSaveStatus] = useAtom(saveStatusAtom);
  const isOwner = useAtomValue(isOwnerAtom);
  const { data: material } = useGetMaterial();
  const { materialID } = useParams<{ materialID: string }>();
  const queryClient = useQueryClient();

  const save = useMutation({
    mutationFn: () => {
      setSaveStatus("Saving");
      return cmsMaterialService.update(materialID, {
        payload: { content: text },
        manual_score: material?.manual_score ?? 0,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.material.getById(materialID),
      });
      setSaveStatus("Saved");
    },
    onError: () => setSaveStatus("SaveFailed"),
  });

  if (!isOwner) return null;
  if (saveStatus === "Saved") return null;

  return (
    <Button variant="action" onClick={() => save.mutate()}>
      <Save size="1rem" />
      Save Changes
    </Button>
  );
}

function ViewToggle() {
  const [view, setView] = useAtom(viewAtom);
  return view === "editor" ? (
    <Button variant="ghost" onClick={() => setView("preview")}>
      <Eye size="1rem" />
      Preview
    </Button>
  ) : (
    <Button variant="ghost" onClick={() => setView("editor")}>
      <Pencil size="1rem" />
      Editor
    </Button>
  );
}

export default function TypingDetailSection() {
  const { data: detail, isLoading } = useGetMaterial();

  return (
    <div className="border border-l-0 2xl:border-l pl-4 pr-2 py-3 w-full flex items-center justify-between gap-4 mt-4">
      <div className="flex-1 flex gap-4 overflow-x-auto">
        <HeaderItem label="Name" value={detail?.name} isLoading={isLoading} />
        <HeaderItem
          label="Type"
          value={titleFormatter(detail?.type ?? "")}
          isLoading={isLoading}
        />
        <HeaderItem
          label="Created By"
          value={
            <div className="flex items-center gap-1.5">
              <UserProfileImage
                src={detail?.created_by?.profile_image}
                username={detail?.created_by?.username ?? ""}
                size="1.25rem"
              />
              <h4 className="font-medium">{detail?.created_by.display_name}</h4>
            </div>
          }
          isLoading={isLoading}
        />
        <HeaderItem
          label="Visibility"
          value={
            <div className="flex items-center gap-2">
              {detail?.visibility === "public" && <Globe size="0.9rem" />}
              {detail?.visibility === "private" && <Lock size="0.9rem" />}
              <h4 className="font-medium">{titleFormatter(detail?.visibility ?? "")}</h4>
            </div>
          }
          isLoading={isLoading}
        />
        <SaveStatus />
      </div>
      <div className="flex gap-2">
        <ViewToggle />
        <SaveButton />
        <SettingsButton />
      </div>
    </div>
  );
}
