import type { SubmissionStatus } from "~/types/core-submission";

export interface Material {
  id: string;
  name: string;
  tags: string[];
  type: MaterialType;
  visibility: "public" | "private";
  created_by: string;
  created_at: Date;
  payload: Record<string, any>;

  auto_score: number;
  manual_score: number;
}

export enum MaterialType {
  DOCUMENT = "document",
  CODE = "code",
  TYPE = "typing",
}

export interface MaterialDetail<T> {
  name: string;
  type: MaterialType;
  status: SubmissionStatus;
  auto_score: number;
  manual_score: number;
  payload: T;
}
