export interface CMSGradebook {
  student_rows: StudentRow[];
  lab_cols: LabCol[];
}

export interface StudentRow {
  username: string;
  display_name: string;
  lab_scores: LabScore;
}

export type LabScore = {
  [lab_id: string]: {
    auto_score: number;
    manual_score: number;
  };
};

export interface LabCol {
  lab_id: string;
  lab_name: string;
  max_auto_score: number;
  max_manual_score: number;
}
