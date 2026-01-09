import { RefreshCcw } from "lucide-react";
import React from "react";
import type { IBaseCard } from "./types";
import {
  Card,
  CardContent,
  CardStatusLine,
  Order,
  Status,
  SubmissionDate,
} from "./BaseCard";

export function QueueCard({ order, onClick }: IBaseCard) {
  return (
    <Card onClick={onClick}>
      <CardContent>
        <Order>{order}</Order>
        <CardStatusLine>
          <Status>In Queue</Status>
        </CardStatusLine>
        <SubmissionDate date={new Date()} />
      </CardContent>
      <RefreshCcw className="text-(--gray-11)" />
    </Card>
  );
}
