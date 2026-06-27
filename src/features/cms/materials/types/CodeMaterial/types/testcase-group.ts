export interface TestCase {
  id: string;
  order: number;
  input: string;
  output: string;
  hide_input?: boolean;
  hide_output?: boolean;
}

export interface TestCaseGroup {
  id: string;
  name: string;
  score: number;
  order: number;
  test_cases: TestCase[];
}
