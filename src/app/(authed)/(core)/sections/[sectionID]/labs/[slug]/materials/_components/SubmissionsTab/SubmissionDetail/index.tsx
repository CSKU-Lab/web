import TestcaseTable from "./TestcaseTable";
import { PassedCard } from "../SubmissionList/SubmissionCard";
import BackButton from "./BackButton";
import { useEffect, useState } from "react";
import Loading from "./Loading";
import CodeBlock from "./CodeBlock";

function Submission() {
  const [isFetching, setIsFetching] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    const getData = async () => {
      setIsFetching(true);
      await fetch(`${process.env.PUBLIC_URL}/api/timeout-request`, {
        method: "POST",
        body: JSON.stringify({
          timeout: 4000,
        }),
        signal: controller.signal,
      });
      setIsFetching(false);
    };

    getData();

    return () => controller.abort("Changed Submission");
  }, []);

  if (isFetching) return <Loading />;

  return (
    <>
      <BackButton />
      <PassedCard order={1} totalCase={20} />
      <CodeBlock />
      <TestcaseTable isLoading={false} />
    </>
  );
}

export default Submission;
