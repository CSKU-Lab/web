import { CircleCheck } from "lucide-react";
import React from "react";
import type { IPassedCard } from "./types";
import {
  Card,
  CardContent,
  CardStatusLine,
  SubmissionDate,
  Order,
  Status,
  Testcase,
} from "./BaseCard";

export function PassedCard({ order, totalCase, onClick }: IPassedCard) {
  return (
    <Card onClick={onClick} className="border-grass-6">
      <CardContent>
        <Order>{order}</Order>
        <CardStatusLine>
          <Status className="text-grass-11">Passed</Status>
          <Testcase correctCase={totalCase} {...{ totalCase }} />
        </CardStatusLine>
        <SubmissionDate date={new Date()} />
      </CardContent>
      <CircleCheck className="text-grass-9" />
    </Card>
  );
}
