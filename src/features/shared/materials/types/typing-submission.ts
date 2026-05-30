export interface StartTypingSessionRequest {
  lab_id: string;
  section_id?: string;
}

export interface StartTypingSessionResponse {
  token: string;
}

export interface TypingSubmissionPayload {
  token: string;
  typed_text: string;
}
