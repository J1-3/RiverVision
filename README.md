# RiverVision｜江视觉数据大屏

![RiverVision](docs/screenshots/dashboard-1920x1080.png)

教学型数据可视化大屏项目，面向前端初学者和数据分析爱好者，帮助你从 0 到 1 理解并实现一个完整的实时数据大屏。

---

## 项目简介

RiverVision 是一个以教学为导向的纯前端数据大屏项目。项目围绕“江河生态与城市运行监测”主题，演示了数据大屏的常见模块、布局方式和实时更新逻辑。

项目适合：

- 前端初学者了解数据大屏的工程结构
- 数据可视化学习者练习 ECharts 图表封装
- 想从零搭建大屏项目的开发者参考目录组织
- AI 辅助编程课堂中的实战案例

> 本项目当前为前端 mock 模式，不依赖真实后端，也不用 WebSocket 或 SSE。所有数据均由前端模拟器生成，适合离线学习和演示。

---

## 核心特性

- **实时数据模拟**：顶部指标、趋势图、告警中心、如意数据中枢、分类占比、覆盖率等模块会随时间平滑变化
- **ECharts 图表封装**：趋势折线图、环形饼图、六边形雷达图，均按组件化方式组织
- **模块化布局**：顶部标题栏、核心指标、趋势分析、空间分布、如意数据中枢、告警中心、实时态势分层清晰
- **模拟器驱动**：独立的数据模拟器负责生成下一帧数据，业务组件只负责渲染，便于教学理解和后续替换为真实 API
- **自动化截图**：内置 Playwright 截图脚本，可一键生成 1920x1080 项目展示图
- **测试与质量**：Vitest 单测、Playwright E2E、ESLint + Stylelint + Prettier 全流程覆盖

---

## 技术栈

| 类别     | 技术                                       |
| -------- | ------------------------------------------ |
| 框架     | React 19                                   |
| 语言     | TypeScript 5.9                             |
| 构建工具 | Vite 7.1                                   |
| 图表库   | ECharts 5.6                                |
| 状态管理 | Zustand 5（部分模块使用 React useState）   |
| 模拟数据 | 前端实时模拟器（基于上一帧状态生成下一帧） |
| 单元测试 | Vitest + React Testing Library             |
| E2E 测试 | Playwright                                 |
| 代码规范 | ESLint / Stylelint / Prettier              |

---

## 页面内容

页面由以下核心模块组成：

- **顶部标题栏**：项目名称、副标题、实时时间与关键指标摘要
- **核心指标卡片**：今日总流量、监测节点、异常告警、数据健康度
- **趋势分析**：访问趋势折线图，数据点随时间滚动更新
- **如意数据中枢**：流域监测与设备运行统一态势展示
- **空间分布**：上游、中游、下游三区占比环形图
- **能力雷达**：水质监测、数据采集、告警响应、可视化、教学互动、系统稳定六维评估
- **告警中心**：告警条目自动轮播，带进度条指示切换节奏
- **实时态势**：实时水位、流速监测、温度均值及系统覆盖率

---

## 实时数据模拟

项目内置独立的数据模拟器，在不接入真实后端的前提下，让大屏持续“活”起来。

**当前模拟范围：**

- 顶部指标卡：流量递增、节点小幅波动、告警数浮动、健康度保持在 95%~99.9%
- 趋势分析：每约 4 秒追加一个新的时间点，保留最近 10 个点
- 告警中心：每约 10 秒可能产生新告警，最多保留 5 条，高优先级告警约占 20%~30%
- 空间分布：每约 20 秒重新分配三区占比，总和保持 100%
- 覆盖率：每约 16 秒在 80~100 区间内小幅波动
- 能力雷达：每约 30 秒轻微变化，保持教学演示的稳定性

> 所有数据变化都经过边界约束，不会出现负数、无限增长或不合理跳变。

---

## 项目结构

```
src/
├── app/
│   ├── styles/
│   │   └── global.css
│   └── App.tsx
├── entities/
│   └── dashboard/
│       └── model/
│           └── types.ts
├── pages/
│   └── dashboard/
│       └── ui/
│           └── dashboard-page.tsx
├── shared/
│   ├── api/
│   │   ├── dashboard-service.ts
│   │   └── types.ts
│   ├── lib/
│   │   └── logger.ts
│   ├── mock/
│   │   ├── dashboard-data.ts
│   │   └── realtime-dashboard-simulator.ts
│   └── ui/
│       ├── data-flow-ribbon/
│       ├── metric-card/
│       ├── panel/
│       └── section-title/
├── widgets/
│   ├── alerts-panel/
│   ├── distribution-chart/
│   ├── hero-banner/
│   ├── radar-chart/
│   ├── realtime-panel/
│   └── trend-chart/
├── tests/
│   └── setup.ts
└── main.tsx
```

---

## 快速开始

### 环境要求

- Node.js >= 18
- pnpm / npm / yarn

### 安装依赖

```bash
npm install
```

### 启动开发服务

```bash
npm run dev -- --host 127.0.0.1 --port 10001
```

### 浏览器访问

```
http://127.0.0.1:10001/
```

---

## 常用命令

```bash
# 开发服务（端口 10001）
npm run dev -- --host 127.0.0.1 --port 10001

# 类型检查 + 构建
npm run build

# 预览生产构建
npm run preview

# 代码规范检查
npm run lint

# 格式化代码
npm run format

# 运行单元测试
npm run test

# 运行 E2E 测试
npm run test:e2e

# 生成项目展示截图
npm run screenshot
```

---

## 数据源说明

当前项目默认使用前端 mock 模式。数据来源有两层：

1. **静态初始数据**：`src/shared/mock/dashboard-data.ts`
2. **实时模拟器**：`src/shared/mock/realtime-dashboard-simulator.ts`

页面每次请求数据时，模拟器会基于上一帧状态生成下一帧数据，模拟真实业务系统的持续刷新效果。

后续如需接入真实 API，可修改 `src/shared/api/dashboard-service.ts` 中的 `useMock` 标志，切换到 `HttpDashboardRepository`。当前 service 接口已按此路径预留。

---

## 自动化截图

项目内置 Playwright 截图脚本，可一键生成 1920x1080 的项目展示图。

```bash
npm run screenshot
```

截图默认保存到：

```
docs/screenshots/dashboard-1920x1080.png
```

如果开发服务尚未启动，脚本会提示先启动服务。截图前会等待页面标题、核心指标和图表渲染完成，并检查浏览器控制台 error。

---

## 测试与质量保障

项目包含以下质量保障环节：

- **TypeScript 类型检查**：通过 `tsc -b` 在构建时校验
- **ESLint**：检查代码规范
- **Stylelint**：检查样式代码规范
- **Prettier**：统一代码格式
- **Vitest**：覆盖模拟器行为、数据边界、组件渲染等单测
- **Playwright**：覆盖页面加载、核心模块可见性、控制台错误检查等 E2E 场景
- **自动化截图**：用于视觉验收和 README 展示

---

## 适合学习什么

通过阅读和修改本项目，你可以学到：

- 数据大屏的模块化目录设计和组件拆分
- ECharts 在 React 中的封装与生命周期管理
- 如何在不引入 WebSocket 的情况下模拟实时数据变化
- mock 数据层与 service 层的分离，便于后续切换真实 API
- 前端项目中的自动化截图与视觉验收实践
- 数据大屏在视觉风格、布局、动画方面的工程化处理

---

## 后续计划

- 接入真实 API 数据源
- 增加更多图表组件（如地图、热力图）
- 增加主题切换能力
- 增加多视口自动化截图
- 补充更完整的单元测试覆盖

---

## License

MIT License，详见 [LICENSE](LICENSE) 文件。
