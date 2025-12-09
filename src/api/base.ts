import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { plainToInstance } from 'class-transformer';

/**
 * HTTP API 基类
 * 用于替代 Electron IPC 通信，使用 HTTP 请求
 */
abstract class HttpApi {
  protected apiName: string;
  protected axiosInstance: AxiosInstance;

  constructor() {
    this.apiName = this.getApiName();
    this.axiosInstance = axios.create({
      baseURL: '/api',
      timeout: 60000,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 响应拦截器 - 处理统一响应格式
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        const result = response.data;
        // 如果后端返回的是 { success: true, data: ... } 格式
        if (result && typeof result === 'object' && 'success' in result) {
          if (!result.success) {
            throw new Error(result.error || result.message || '请求失败');
          }
          return result.data;
        }
        // 直接返回数据
        return result;
      },
      (error) => {
        if (error.response) {
          const data = error.response.data;
          throw new Error(data?.error || data?.message || error.message || '请求异常');
        }
        throw error;
      }
    );
  }

  /**
   * 获取 API 名称，用于构建请求路径
   */
  abstract getApiName(): string;

  /**
   * 构建 API 路径
   */
  protected buildApiPath(method: string): string {
    return `/${this.apiName}/${method}`;
  }

  /**
   * 调用 API 方法
   */
  protected async invokeApi<T = any>(method: string, ...args: any[]): Promise<T> {
    const url = this.buildApiPath(method);
    
    // 根据参数数量决定使用 GET 还是 POST
    // 如果有参数，使用 POST；如果没有参数，使用 GET
    if (args.length === 0) {
      const response = await this.axiosInstance.get<T>(url);
      return response as any;
    } else {
      const response = await this.axiosInstance.post<T>(url, args.length === 1 ? args[0] : args);
      return response as any;
    }
  }

  /**
   * GET 请求
   */
  protected async get<T = any>(method: string, params?: any): Promise<T> {
    const url = this.buildApiPath(method);
    const response = await this.axiosInstance.get<T>(url, { params });
    return response as any;
  }

  /**
   * POST 请求
   */
  protected async post<T = any>(method: string, data?: any): Promise<T> {
    const url = this.buildApiPath(method);
    const response = await this.axiosInstance.post<T>(url, data);
    return response as any;
  }

  /**
   * PUT 请求
   */
  protected async put<T = any>(method: string, data?: any): Promise<T> {
    const url = this.buildApiPath(method);
    const response = await this.axiosInstance.put<T>(url, data);
    return response as any;
  }

  /**
   * DELETE 请求
   */
  protected async delete<T = any>(method: string, params?: any): Promise<T> {
    const url = this.buildApiPath(method);
    const response = await this.axiosInstance.delete<T>(url, { params });
    return response as any;
  }

  /**
   * 将 JSON 数据转换为类实例
   */
  protected jsonToObject<T>(clazz: new (...args: any[]) => T, data: any): T {
    return plainToInstance(clazz, data);
  }
}

export { HttpApi };

