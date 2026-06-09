import type { BusinessType } from '../user/user.types';

export interface SyncTimeConfig {
  type: 'daily' | 'monthly'; // Daily or monthly
  hour: number; // Hour (0-23)
  minute: number; // Minute (0-59)
  day?: number; // Day of month (1-31, only used when type is monthly)
  businessType?: BusinessType; // Business type (uku)
}
