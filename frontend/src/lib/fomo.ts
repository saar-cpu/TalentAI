/**
 * Deterministic FOMO data generator.
 * Uses a simple hash to produce consistent values per job ID across renders.
 */

export interface FomoData {
  applicantCount: number;
  isHighDemand: boolean;
  remainingPositions: number;
}

function hashString(s: string): number {
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = (hash * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

/** Generate FOMO data from a job ID string */
export function getFomoData(jobId: string): FomoData {
  const h = hashString(jobId);
  return {
    applicantCount: 12 + (h % 38),            // 12–49
    isHighDemand: h % 3 !== 0,                 // ~67%
    remainingPositions: 1 + (h % 4),           // 1–4
  };
}

/** Generate FOMO data from a numeric index (for homepage cards without IDs) */
export function getFomoDataByIndex(index: number): FomoData {
  return getFomoData(`cat-${index}`);
}
