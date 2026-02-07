"use client";

import { useAtomValue } from "jotai";
import HeaderItem from "~/components/crafts/DetailSection/HeaderItem";
import { renderStatus } from "./renderStatus";
import SubmitButton from "./SubmitButton";
import { submissionStatusAtom } from "../../_stores/submission.store";

interface DetailSectionProps {
  sectionID: string;
  labID: string;
  materialID: string;
}

function DetailSection({ sectionID, labID, materialID }: DetailSectionProps) {
  const submissionStatus = useAtomValue(submissionStatusAtom);

  return (
    <div className="border border-l-0 2xl:border-l pl-4 pr-2 py-3 w-full flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <HeaderItem label="Name" value="Blackjack (Easy)" />
        <HeaderItem label="Status" value={renderStatus(submissionStatus)} />
      </div>
      <SubmitButton
        sectionID={sectionID}
        labID={labID}
        materialID={materialID}
      />
    </div>
  );
}

export default DetailSection;
