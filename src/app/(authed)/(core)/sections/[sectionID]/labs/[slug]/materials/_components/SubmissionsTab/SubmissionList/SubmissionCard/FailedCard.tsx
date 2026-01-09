import { CircleX } from "lucide-react";
import React from "react";
import { type IFailedCard } from "./types";
import {
  Card,
  CardContent,
  CardStatusLine,
  Order,
  Status,
  SubmissionDate,
  Testcase,
} from "./BaseCard";

export function FailedCard({
  order,
  correctCase,
  totalCase,
  onClick,
}: IFailedCard) {
  return (
    <Card onClick={onClick} className="border-tomato-6">
      <CardContent>
        <Order>{order}</Order>
        <CardStatusLine>
          <Status className="text-tomato-11">Failed</Status>
          <Testcase {...{ correctCase, totalCase }} />
        </CardStatusLine>
        <SubmissionDate date={new Date()} />
      </CardContent>
      <CircleX className="text-tomato-9" />
    </Card>
  );
}
