const TYPING_SCORE_SCALE = 100;

/** Convert the integer hundredths used by the API to a display score. */
export function formatTypingScore(storedScore: number): string {
  return (storedScore / TYPING_SCORE_SCALE).toFixed(2);
}

export function getTypingScore(storedScore: number): number {
  return storedScore / TYPING_SCORE_SCALE;
}

