export interface AnalyticsSummary {
  total_users: number;
  active_users_today: number;
  /** Distinct users seen within the trailing "currently active" window (~15 min). */
  currently_active_users: number;
  submissions_today: number;
  /** Fraction in [0, 1] of graded (passed/failed) submissions that passed. */
  pass_rate_of_graded: number;
  active_courses: number;
}

export interface DailySubmissions {
  date: string;
  total: number;
  passed: number;
}

export interface DailyCount {
  date: string;
  count: number;
}

export interface TypeCount {
  type: string;
  count: number;
}

export interface CourseCount {
  course_id: string;
  name: string;
  count: number;
}

export interface AnalyticsOverview {
  summary: AnalyticsSummary;
  submissions_per_day: DailySubmissions[];
  active_users_per_day: DailyCount[];
  submissions_by_type: TypeCount[];
  top_courses: CourseCount[];
}
