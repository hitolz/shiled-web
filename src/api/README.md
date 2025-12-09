# HTTP API 客户端

本目录包含从 Electron IPC 迁移到 HTTP 的 API 客户端实现。

## 架构说明

### 1. HTTP API 基类 (`base.ts`)

`HttpApi` 是一个抽象基类，提供了：
- 统一的 HTTP 请求处理
- 响应拦截和错误处理
- 支持 GET、POST、PUT、DELETE 方法
- 自动构建 API 路径

### 2. API 客户端类

- **UserApi** (`user/user.api.ts`): 用户管理相关 API
- **SystemApi** (`system/system.api.ts`): 系统配置相关 API

### 3. Next.js API 路由

- `/api/user/[...all]`: 处理所有用户相关请求
- `/api/system/[...all]`: 处理所有系统配置相关请求

这些路由会将请求转发到后端服务器（通过 `SERVER_TARGET` 环境变量配置）。

## 使用方法

### 导入 API 客户端

```typescript
import { UserApi, SystemApi } from '@/api';
// 或者
import { UserApi } from '@/api/user/user.api';
import { SystemApi } from '@/api/system/system.api';
```

### 使用示例

```typescript
// 创建 API 实例
const userApi = new UserApi();
const systemApi = new SystemApi();

// 获取用户列表
const users = await userApi.getUserInfoList();

// 获取单个用户信息
const user = await userApi.getUserInfo('username');

// 添加用户
await userApi.addUser({
  id: '1',
  username: 'test',
  password: 'password',
  remark: 'test user',
  businessType: 'adapundi'
});

// 更新用户
await userApi.updateUser({
  id: '1',
  username: 'test',
  password: 'newpassword',
  remark: 'updated user',
  businessType: 'adapundi'
});

// 删除用户
await userApi.deleteUser('username');

// 运行用户同步
await userApi.runUser('username', true, false);

// 停止用户同步
await userApi.stopUser('username');

// 获取同步时间配置
const config = await systemApi.getSyncTimeConfig();

// 保存同步时间配置
await systemApi.saveSyncTimeConfig({
  type: 'daily',
  hour: 0,
  minute: 0
});

// 根据业务类型获取配置
const businessConfig = await systemApi.getSyncTimeConfigByBusiness('adapundi');

// 根据业务类型保存配置
await systemApi.saveSyncTimeConfigByBusiness('adapundi', {
  type: 'daily',
  hour: 0,
  minute: 0,
  businessType: 'adapundi'
});
```

## API 路径映射

### UserApi

- `GET /api/user/getUserInfoList` - 获取用户列表
- `POST /api/user/getUserInfo` - 获取单个用户信息
- `POST /api/user/addUser` - 添加用户
- `POST /api/user/updateUser` - 更新用户
- `POST /api/user/deleteUser` - 删除用户
- `POST /api/user/runUser` - 运行用户同步
- `POST /api/user/stopUser` - 停止用户同步

### SystemApi

- `GET /api/system/getSyncTimeConfig` - 获取同步时间配置
- `POST /api/system/saveSyncTimeConfig` - 保存同步时间配置
- `GET /api/system/getSyncTimeConfigByBusiness` - 根据业务类型获取配置
- `POST /api/system/saveSyncTimeConfigByBusiness` - 根据业务类型保存配置

## 环境变量配置

确保在 `.env` 文件中配置以下变量：

```
SERVER_TARGET=http://localhost:3000
APP_URL_PREFIX=/api
```

## 从 Electron API 迁移

如果你之前使用的是 Electron API（继承自 `ElectronApi`），现在可以：

1. 将导入从 `@eleapi/user/user.api` 改为 `@/api/user/user.api`
2. 将导入从 `@eleapi/config/system.api` 改为 `@/api/system/system.api`
3. API 方法调用方式保持不变，接口完全兼容

## 注意事项

1. 所有 API 请求都会通过 Next.js API 路由转发到后端服务器
2. 确保后端服务器已经实现了对应的接口
3. 错误处理会自动转换为异常抛出
4. 响应数据会自动处理 `{ success: true, data: ... }` 格式

