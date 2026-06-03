export interface StartTypingSessionRequest {
  lab_id: string;
  section_id?: string;
}

export interface StartTypingSessionResponse {
  token: string;
}

export interface Keystroke {
  k: string;
  t: number;
}

export interface TypingSubmissionPayload {
  token: string;
  keystrokes: Keystroke[];
}
