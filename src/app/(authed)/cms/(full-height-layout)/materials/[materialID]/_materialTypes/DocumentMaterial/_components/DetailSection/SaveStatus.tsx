"use client";

import { useAtomValue } from "jotai";
import { saveStatusAtom } from "../../_stores/save-status.store";
import HeaderItem from "~/components/crafts/DetailSection/HeaderItem";

function SaveStatus() {
  const saveStatus = useAtomValue(saveStatusAtom);

  const renderStatus = () => {
    switch (saveStatus) {
      case "UnSaved":
        return (
          <div className="flex gap-1.5 items-center">
            <div className="w-2 h-2 rounded-full bg-(--gray-9)"></div>
            <h4 className="font-medium">Unsaved</h4>
          </div>
        );
      case "Saved":
        return (
          <div className="flex gap-1.5 items-center">
            <div className="w-2 h-2 rounded-full bg-(--grass-9)"></div>
            <h4 className="font-medium">Saved</h4>
          </div>
        );
      case "Saving":
        return (
          <div className="flex gap-1.5 items-center">
            <div className="w-2 h-2 rounded-full bg-(--amber-9) animate-pulse"></div>
            <h4 className="font-medium">Saving</h4>
          </div>
        );
      case "SaveFailed":
        return (
          <div className="flex gap-1.5 items-center">
            <div className="w-2 h-2 rounded-full bg-(--red-9)"></div>
            <h4 className="font-medium">Failed to save</h4>
          </div>
        );
      case "Offline":
        return (
          <div className="flex gap-1.5 items-center">
            <div className="w-2 h-2 rounded-full bg-(--gray-9)"></div>
            <h4 className="font-medium">Offline</h4>
          </div>
        );
    }
  };

  return <HeaderItem label="Status" value={renderStatus()} isLoading={false} />;
}

export default SaveStatus;
