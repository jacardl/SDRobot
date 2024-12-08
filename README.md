# SDRobot - 智能销售线索管理系统

一个现代化的销售线索(Leads)管理系统，帮助销售和市场营销人员高效管理潜在客户。

## 技术栈

- **前端框架**: Vue 3 + TypeScript + Vite
- **UI 框架**: Tailwind CSS
- **状态管理**: Pinia
- **路由管理**: Vue Router 4
- **HTTP 客户端**: Axios
- **图标库**: Heroicons

## 功能特性

### 1. 界面布局
- 现代化三列布局设计
  - 左侧导航菜单
  - 中间内容区域
  - 右侧详情面板

### 2. 核心功能
- **Dashboard**: 数据概览
  - 总线索数量
  - 活跃营销活动
  - 转化率统计
- **Leads 管理**
  - 线索列表展示
  - 详细信息查看
  - 状态追踪
- **营销活动**
  - 活动管理
  - 效果分析
- **智能助手**
  - AI 对话支持
  - 自动化建议

### 3. 集成功能
- 社交媒体数据采集
- 邮箱系统集成
- 数据分析工具

## 开发环境设置

### 前置要求
- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装步骤

1. 克隆项目
```bash
git clone [repository-url]
cd sdrobot
```

2. 安装依赖
```bash
npm install
```

3. 启动开发服务器
```bash
npm run dev
```

4. 构建生产版本
```bash
npm run build
```

## 项目结构
```
src/
├── assets/        # 静态资源
├── components/    # 通用组件
├── layouts/       # 布局组件
├── views/         # 页面组件
├── router/        # 路由配置
├── store/         # 状态管理
├── types/         # TypeScript 类型定义
└── utils/         # 工具函数
```

## 开发规范

### 代码风格
- 使用 TypeScript 强类型
- Vue 3 Composition API
- Tailwind CSS 原子化 CSS

### Git 提交规范
- feat: 新功能
- fix: 修复问题
- docs: 文档修改
- style: 代码格式修改
- refactor: 代码重构
- test: 测试用例修改
- chore: 其他修改

## 浏览器支持

- Chrome >= 87
- Firefox >= 78
- Safari >= 14
- Edge >= 88

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交修改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 许可证

[MIT License](LICENSE)
