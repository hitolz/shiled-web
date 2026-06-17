import { HttpApi } from '../base';
import type { SyncTimeConfig } from './system.types';
import type { BusinessType } from '../user/user.types';

// Re-export types for convenience
export type { SyncTimeConfig };

export class SystemApi extends HttpApi {
  getApiName(): string {
    return 'system';
  }

  /**
   * 获取同步时间配置
   */
  async getSyncTimeConfig(): Promise<SyncTimeConfig> {
    return this.get<SyncTimeConfig>('getSyncTimeConfig');
  }

  /**
   * 保存同步时间配置
   */
  async saveSyncTimeConfig(config: SyncTimeConfig): Promise<void> {
    return this.post<void>('saveSyncTimeConfig', config);
  }

  /**
   * 根据业务类型获取同步时间配置
   */
  async getSyncTimeConfigByBusiness(businessType: BusinessType): Promise<SyncTimeConfig> {
    return this.get<SyncTimeConfig>('getSyncTimeConfigByBusiness', { businessType });
  }

  /**
   * 根据业务类型保存同步时间配置
   */
  async saveSyncTimeConfigByBusiness(
    businessType: BusinessType,
    config: SyncTimeConfig
  ): Promise<void> {
    return this.post<void>('saveSyncTimeConfigByBusiness', {
      businessType,
      config,
    });
  }

  /**
   * 获取是否跳过今日已同步案件
   */
  async getSkipSyncedCases(businessType: BusinessType): Promise<boolean> {
    return this.get<boolean>('getSkipSyncedCases', { businessType });
  }

  /**
   * 设置是否跳过今日已同步案件
   */
  async setSkipSyncedCases(businessType: BusinessType, value: boolean): Promise<void> {
    return this.post<void>('setSkipSyncedCases', { businessType, value });
  }
}

