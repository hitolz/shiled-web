export type InstanceRunningStatus = 'running' | 'stopped';

export interface BasicConfig {
  slideStats: boolean;
  port: string;
  noVideo: boolean;
  autoEnd: boolean;
}

export interface Instance {
  port: string;
  createdAt: string;
  lastActiveAt: string;
  isActive: boolean;
  configName: string;
  runningStatus: InstanceRunningStatus;
  likeCount: number;
  totalLikeCount: number;
  isException: boolean;
  uid: string;
  isLogin: boolean;
  isExcepiton: boolean;
  nickName: string;
  lockTimes : Map<string, number>,
  sleepFlags : Map<string, boolean>,
  sleepReasons : Map<string, string>,
  sleepTimes : Map<string, number>,
  statistic: Map<string, {
      totalCount : number,
      todayCount: number,
      totalErrorCount: number,
      todayErrorCount: number,
      chose: boolean
  }>
  
}

export interface InstanceStats {
  currentPort: number;
  activeInstanceCount: number;
  availableSlots: number;
} 