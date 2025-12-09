export type BusinessType = 'adapundi' | 'SINGA' | 'KAT';

/**
 * 同步统计数据结构
 */
export interface SyncStats {
  totalCount: number; // 总数量
  successCount: number; // 成功数量
  skipCount: number; // 跳过数量（已缓存）
  failCount: number; // 失败数量
  lastSyncTime: string; // 最后同步时间
  running?: boolean; // 运行状态
  startTime?: string; // 运行开始时间
  duration?: number; // 运行时长（秒）
  incrementNum?: number; // 增量数量
}

export interface UserInfo {
  id: string;
  username: string;
  password: string;
  remark: string;
  businessType?: BusinessType;
  syncStats?: SyncStats; // 同步统计信息
}

