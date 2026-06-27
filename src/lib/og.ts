const PUBLIC_BASE = process.env.STORAGE_PUBLIC_URL ?? '';
const INTERNAL_BASE = process.env.STORAGE_INTERNAL_URL ?? '';

const ogPath = {
  default: () => `/og/default.png`,
  section: (id: string) => `/og/section/${id}.png`,
  material: (id: string) => `/og/material/${id}.png`,
  course: (id: string) => `/og/course/${id}.png`,
};

export const ogImages = {
  default: (): string => `${PUBLIC_BASE}${ogPath.default()}`,
  section: (id: string): string => `${PUBLIC_BASE}${ogPath.section(id)}`,
  material: (id: string): string => `${PUBLIC_BASE}${ogPath.material(id)}`,
  course: (id: string): string => `${PUBLIC_BASE}${ogPath.course(id)}`,
};

export const ogImagesFetch = {
  default: (): string => `${INTERNAL_BASE}${ogPath.default()}`,
  section: (id: string): string => `${INTERNAL_BASE}${ogPath.section(id)}`,
  material: (id: string): string => `${INTERNAL_BASE}${ogPath.material(id)}`,
  course: (id: string): string => `${INTERNAL_BASE}${ogPath.course(id)}`,
};
