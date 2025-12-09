import { HttpApi } from '../base';
import type { BusinessType, SyncStats, UserInfo } from './user.types';

// Re-export types for convenience
export type { BusinessType, SyncStats, UserInfo };

export class UserApi extends HttpApi {
  getApiName(): string {
    return 'user';
  }

  /**
   * 获取用户信息
   */
  async getUserInfo(username: string): Promise<UserInfo> {
    return this.post<UserInfo>('getUserInfo', { username });
  }

  /**
   * 获取用户列表
   */
  async getUserInfoList(): Promise<UserInfo[]> {
    return this.get<UserInfo[]>('getUserInfoList');
  }

  /**
   * 添加用户
   */
  async addUser(userInfo: UserInfo): Promise<void> {
    return this.post<void>('addUser', userInfo);
  }

  /**
   * 更新用户
   */
  async updateUser(userInfo: UserInfo): Promise<void> {
    return this.post<void>('updateUser', userInfo);
  }

  /**
   * 删除用户
   */
  async deleteUser(username: string): Promise<void> {
    return this.post<void>('deleteUser', { username });
  }

  /**
   * 运行用户同步
   */
  async runUser(
    username: string,
    enableDeduplication: boolean = true,
    enableResume: boolean = false
  ): Promise<void> {
    return this.post<void>('runUser', {
      username,
      enableDeduplication,
      enableResume,
    });
  }

  /**
   * 停止用户同步
   */
  async stopUser(username: string): Promise<void> {
    return this.post<void>('stopUser', { username });
  }
}

