const BASE = `${process.env.S3_FRONTEND_URL}/${process.env.S3_BUCKET}`;

export const ogImages = {
  default: (): string => `${BASE}/og/default.png`,
  section: (id: string): string => `${BASE}/og/section/${id}.png`,
  material: (id: string): string => `${BASE}/og/material/${id}.png`,
  course: (id: string): string => `${BASE}/og/course/${id}.png`,
};
