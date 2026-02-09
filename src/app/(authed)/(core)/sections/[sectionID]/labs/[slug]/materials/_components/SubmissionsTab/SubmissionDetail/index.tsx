import TestcaseTable from "./TestcaseTable";
import { SubmissionCard } from "../SubmissionList/SubmissionCard/SubmissionCard";
import BackButton from "./BackButton";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Loading from "./Loading";
import CodeBlock from "./CodeBlock";

function Submission() {
  const { materialID } = useParams<{ materialID: string }>();
  const [isFetching, setIsFetching] = useState(false);

  if (isFetching) return <Loading />;

  return (
    <>
      <BackButton />
      <SubmissionCard
        id="example"
        order={1}
        status="passed"
        createdAt={new Date().toISOString()}
        totalCase={20}
        materialID={materialID}
        onClick={() => {}}
      />
      <CodeBlock />
      <TestcaseTable isLoading={false} />
    </>
  );
}

export default Submission;
