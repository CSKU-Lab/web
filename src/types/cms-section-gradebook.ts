export interface CMSGradebook {
  username: string;
  display_name: string;
  labs: LabScore[];
}

interface LabScore {
  id: string;
  name: string;
  auto_score: number;
  manual_score: number;
  total_score: number;
}
