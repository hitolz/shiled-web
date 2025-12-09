# 智慧助手 WebView 重构项目

## 项目概述

本项目是基于 Next.js、React、Ant Design 和 TypeScript 技术栈重构的智慧助手应用。原项目使用纯 HTML + JavaScript + CSS 实现，现已完全重构为现代化的 React 应用。

## 技术栈

- **Framework**: Next.js 14.1.3
- **UI Library**: React 18 + Ant Design 5.15.2
- **Language**: TypeScript 5
- **Styling**: CSS + Ant Design Design System
- **Icons**: @ant-design/icons 4.8.2

## 项目结构

```
src/app/
├── page.tsx                 # 主入口页面
├── globals.css             # 全局样式
├── types/
│   └── index.ts            # TypeScript 类型定义
└── components/
    ├── Header/
    │   └── Header.tsx      # 顶部导航和标签页
    ├── LogPanel/
    │   └── LogPanel.tsx    # 运行日志面板
    ├── ScriptTab/
    │   ├── ScriptTab.tsx   # 脚本主页面
    │   ├── BasicSettings.tsx    # 基本设置组件
    │   ├── ScriptSettings.tsx   # 脚本参数设置
    │   └── PlatformSettings.tsx # 平台账号设置
    ├── ProxyTab/
    │   └── ProxyTab.tsx    # IP代理设置页面
    ├── InstanceTab/
    │   └── InstanceTab.tsx # 多开实例管理页面
    └── HelpTab/
        └── HelpTab.tsx     # 使用说明页面
```

## 功能特性

### ✨ 核心功能

1. **脚本管理**
   - 基本设置：端口配置、开关选项
   - 脚本参数：点赞率、数量、等待时间等
   - 平台账号：支持多平台账号配置
   - 操作控制：保存参数、登录、启动/停止脚本

2. **代理设置**
   - 代理服务器配置
   - 用户名密码认证
   - 代理连接测试
   - 端口隔离存储

3. **多开管理**
   - 实例创建和管理
   - 端口状态监控
   - 配置隔离存储
   - 实例操作（重启、关闭、删除）

4. **日志监控**
   - 实时日志显示
   - 日志类型分类（info、warning、error）
   - 自动滚动和行数限制
   - 状态统计显示

5. **使用说明**
   - 详细的功能介绍
   - 操作步骤指南
   - 注意事项说明

### 🎨 UI/UX 改进

1. **现代化设计**
   - 渐变背景和玻璃态效果
   - 卡片式布局设计
   - 响应式适配

2. **交互体验**
   - 加载状态指示
   - 确认对话框
   - 悬停动画效果
   - 表单验证反馈

3. **组件化架构**
   - 高度模块化的组件结构
   - 可复用的业务组件
   - 清晰的状态管理

## 开发与部署

### 开发环境

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问应用
http://localhost:8899
```

### 构建部署

```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm run start
```

### 其他命令

```bash
# 代码检查
npm run lint

# 环境特定构建
npm run build:local   # 本地环境
npm run build:dev     # 开发环境
npm run build:prod    # 生产环境
```

## 重构亮点

### 🔧 技术改进

1. **类型安全**: 完整的 TypeScript 类型定义
2. **组件化**: 高度模块化的 React 组件架构
3. **状态管理**: 使用 React Hooks 进行状态管理
4. **响应式**: 完全响应式的移动端适配
5. **现代化**: 使用最新的 React 18 和 Next.js 14

### 📦 功能保持

- ✅ 完整保留原有所有功能
- ✅ 保持原有的操作逻辑
- ✅ 兼容原有的 API 接口设计
- ✅ 保持原有的样式风格和配色

### 🎯 代码质量

- ✅ 清晰的文件组织结构
- ✅ 可读性强的组件命名
- ✅ 完整的类型注解
- ✅ 模块化的样式管理

## API 接口兼容

应用保持与原有 API 的兼容性，通过 `window` 对象暴露的全局方法：

- `window.BasicConfigApi` - 基本配置 API
- `window.PlatformConfigApi` - 平台配置 API  
- `window.InstanceApi` - 实例管理 API
- `window.StoreApi` - 存储管理 API
- `window.addLogEntry` - 日志添加方法

## 浏览器兼容性

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交代码更改
4. 创建 Pull Request

## 许可证

MIT License

---

**重构完成日期**: 2025年1月
**原始项目**: HTML + JavaScript + CSS
**重构技术栈**: Next.js + React + Ant Design + TypeScript 