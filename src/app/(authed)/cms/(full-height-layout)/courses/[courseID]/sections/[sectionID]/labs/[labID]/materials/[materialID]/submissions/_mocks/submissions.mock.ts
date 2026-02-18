import type {
  CMSSectionStudentSubmission,
  CodeSubmissionData,
} from "~/types/cms-section-submission";

export const mockStudentSubmissions: CMSSectionStudentSubmission<CodeSubmissionData>[] =
  [
    {
      student: {
        id: "s1",
        username: "b6510001",
        display_name: "Somchai Jaidee",
        profile_image: null,
      },
      auto_score: 100,
      manual_score: 0,
      ip: "10.0.0.12",
      submission_status: "passed",
      submission: {
        id: "sub-001",
        created_at: "2026-02-18T14:32:00Z",
        files: [
          {
            name: "main.py",
            content:
              'def solution(n):\n    return n * 2\n\nif __name__ == "__main__":\n    n = int(input())\n    print(solution(n))',
          },
        ],
        avg_wall_time: 12.5,
        avg_memory: 8192,
        test_case_groups: [
          {
            id: "g1",
            score: 50,
            results: [
              {
                id: "tc1",
                status: "RUN_PASSED",
                input: "5",
                output: "10",
                message: "",
                wall_time: 11.2,
                memory: 8000,
              },
              {
                id: "tc2",
                status: "RUN_PASSED",
                input: "100",
                output: "200",
                message: "",
                wall_time: 13.8,
                memory: 8384,
              },
            ],
          },
          {
            id: "g2",
            score: 50,
            results: [
              {
                id: "tc3",
                status: "RUN_PASSED",
                input: "0",
                output: "0",
                message: "",
                wall_time: 10.1,
                memory: 7800,
              },
            ],
          },
        ],
      },
    },
    {
      student: {
        id: "s2",
        username: "b6510002",
        display_name: "Somsri Rakdee",
        profile_image: null,
      },
      auto_score: 50,
      manual_score: 0,
      ip: "10.0.0.15",
      submission_status: "failed",
      submission: {
        id: "sub-002",
        created_at: "2026-02-18T14:45:00Z",
        files: [
          {
            name: "main.py",
            content:
              'def solution(n):\n    return n + 1\n\nif __name__ == "__main__":\n    n = int(input())\n    print(solution(n))',
          },
        ],
        avg_wall_time: 15.3,
        avg_memory: 9216,
        test_case_groups: [
          {
            id: "g1",
            score: 50,
            results: [
              {
                id: "tc1",
                status: "RUN_FAILED",
                input: "5",
                output: "6",
                message: "Expected 10, got 6",
                wall_time: 14.0,
                memory: 9100,
              },
              {
                id: "tc2",
                status: "RUN_FAILED",
                input: "100",
                output: "101",
                message: "Expected 200, got 101",
                wall_time: 16.6,
                memory: 9332,
              },
            ],
          },
          {
            id: "g2",
            score: 50,
            results: [
              {
                id: "tc3",
                status: "RUN_PASSED",
                input: "0",
                output: "1",
                message: "",
                wall_time: 12.0,
                memory: 8800,
              },
            ],
          },
        ],
      },
    },
    {
      student: {
        id: "s3",
        username: "b6510003",
        display_name: "Napat Kittisak",
        profile_image: null,
      },
      auto_score: 0,
      manual_score: 0,
      ip: null,
      submission_status: "not_submitted",
      submission: null,
    },
    {
      student: {
        id: "s4",
        username: "b6510004",
        display_name: "Kanokwan Srisuk",
        profile_image: null,
      },
      auto_score: 0,
      manual_score: 0,
      ip: "10.0.0.22",
      submission_status: "queued",
      submission: null,
    },
    {
      student: {
        id: "s5",
        username: "b6510005",
        display_name: "Thanawat Prompong",
        profile_image: null,
      },
      auto_score: 0,
      manual_score: 0,
      ip: "10.0.0.30",
      submission_status: "running",
      submission: null,
    },
    {
      student: {
        id: "s6",
        username: "b6510006",
        display_name: "Pattaraporn Meesuk",
        profile_image: null,
      },
      auto_score: 100,
      manual_score: 10,
      ip: "10.0.0.18",
      submission_status: "passed",
      submission: {
        id: "sub-006",
        created_at: "2026-02-18T13:15:00Z",
        files: [
          {
            name: "solution.py",
            content:
              'import sys\n\ndef double(n: int) -> int:\n    return n << 1\n\nif __name__ == "__main__":\n    n = int(sys.stdin.readline())\n    print(double(n))',
          },
        ],
        avg_wall_time: 8.7,
        avg_memory: 7680,
        test_case_groups: [
          {
            id: "g1",
            score: 50,
            results: [
              {
                id: "tc1",
                status: "RUN_PASSED",
                input: "5",
                output: "10",
                message: "",
                wall_time: 8.2,
                memory: 7500,
              },
              {
                id: "tc2",
                status: "RUN_PASSED",
                input: "100",
                output: "200",
                message: "",
                wall_time: 9.2,
                memory: 7860,
              },
            ],
          },
          {
            id: "g2",
            score: 50,
            results: [
              {
                id: "tc3",
                status: "RUN_PASSED",
                input: "0",
                output: "0",
                message: "",
                wall_time: 7.5,
                memory: 7400,
              },
            ],
          },
        ],
      },
    },
    {
      student: {
        id: "s7",
        username: "b6510007",
        display_name: "Wichai Tongdee",
        profile_image: null,
      },
      auto_score: 0,
      manual_score: 0,
      ip: "10.0.0.44",
      submission_status: "failed",
      submission: {
        id: "sub-007",
        created_at: "2026-02-18T15:01:00Z",
        files: [
          {
            name: "main.py",
            content: 'print("hello")',
          },
        ],
        avg_wall_time: 0,
        avg_memory: 0,
        test_case_groups: [
          {
            id: "g1",
            score: 0,
            results: [
              {
                id: "tc1",
                status: "COMPILE_FAILED",
                input: "5",
                output: "",
                message: "SyntaxError: unexpected indent",
                wall_time: 0,
                memory: 0,
              },
            ],
          },
        ],
      },
    },
    {
      student: {
        id: "s8",
        username: "b6510008",
        display_name: "Apinya Charoensri",
        profile_image: null,
      },
      auto_score: 0,
      manual_score: 0,
      ip: null,
      submission_status: "not_submitted",
      submission: null,
    },
  ];
