export type BusinessType = 'adapundi' | 'singa' | 'KAT';

/**
 * Sync statistics data structure
 */
export interface SyncStats {
  totalCount: number; // Total count
  successCount: number; // Success count
  skipCount: number; // Skipped count (cached)
  failCount: number; // Failed count
  lastSyncTime: string; // Last sync time
  running?: boolean; // Running status
  startTime?: string; // Start time
  duration?: number; // Duration (seconds)
}

export interface UserInfo {
  id: string;
  username: string;
  password: string;
  remark: string;
  businessType?: BusinessType;
  syncStats?: SyncStats; // Sync statistics
}

