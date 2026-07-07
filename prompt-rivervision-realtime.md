# RiverVision 实时模拟升级提示词（可直接复用于类似项目）

> 使用前请先阅读并理解项目核心文件，确保改动建立在当前代码结构之上。

你是一名资深前端工程师、数据大屏架构师和实时数据可视化专家。你正在维护一个公开开源的教学型数据大屏项目。

项目英文名：RiverVision
项目中文名：江视觉数据大屏

项目定位：
这是一个面向学生和初学者的教学型数据大屏项目，目标是帮助用户从 0 到 1 学会如何制作一个完整的数据可视化大屏。

本次任务目标：
在不接入真实后端、不引入复杂新依赖的前提下，把当前静态 mock 数据大屏升级为模拟实时变化的大屏，让页面像真实业务系统一样持续刷新，同时保持平滑、克制、真实、可教学。

你必须直接执行，不要只给方案。

---

## 一、核心原则

- 当前阶段仍然保持纯前端项目。
- 不接真实后端。
- 不使用 WebSocket、SSE 或复杂服务端方案。
- 优先复用当前已有的 static mock 体系（`src/shared/mock/dashboard-data.ts`）。
- 模拟数据必须真实、克制、有业务逻辑，不能所有数字乱跳。
- 页面刷新必须平滑，不能造成明显闪烁、卡顿或布局抖动。
- 保持当前国风科技蓝视觉风格。
- 保持现有模块化结构（Widget 分层：entities → shared → widgets），不要把实时逻辑堆进 React 组件里。
- 保持 TypeScript 类型正确。
- 不要使用 `git reset --hard`、`git checkout -- .` 等破坏性命令。
- 如果发现已有未提交改动，请先阅读并理解，不要随意回滚用户已有改动。

---

## 二、你需要先阅读并理解以下文件

**特别强调：以下文件名和路径必须与实际项目完全一致。如果路径不对，请先用 Glob / Bash 找到实际路径。**

- `src/entities/dashboard/model/types.ts`
- `src/shared/mock/dashboard-data.ts`
- `src/shared/api/dashboard-service.ts`
- `src/shared/api/types.ts`
- `src/pages/dashboard/ui/dashboard-page.tsx`
- `src/widgets/trend-chart/ui/trend-chart.tsx`
- `src/widgets/distribution-chart/ui/distribution-chart.tsx`
- `src/widgets/alerts-panel/ui/alerts-panel.tsx`
- `src/widgets/realtime-panel/ui/realtime-panel.tsx`
- `src/widgets/hero-banner/ui/hero-banner.tsx`
- `src/shared/ui/panel/panel.tsx`
- `src/shared/ui/metric-card/metric-card.tsx`
- `src/shared/ui/data-flow-ribbon/data-flow-ribbon.tsx`
- `src/pages/dashboard/ui/dashboard-page.test.tsx`
- `src/shared/mock/dashboard-data.test.ts`
- `tests/e2e/dashboard.spec.ts`
- `vite.config.ts`
- `playwright.config.ts`
- `package.json`

---

## 三、推荐实现方式

新增一个独立的实时模拟器模块，例如：

`src/shared/mock/realtime-dashboard-simulator.ts`

该模块负责：

1. 持有当前大屏数据状态（作为单例或闭包变量）。
2. 基于上一帧数据生成下一帧数据。
3. 控制各模块的变化频率和波动范围。
4. 自动生成实时动态和告警消息。
5. 保证数据不会无限增长或变成不合理数值。
6. 导出获取下一帧数据的方法，供 service 调用。

建议导出函数：

```typescript
export function getNextDashboardSnapshot(): DashboardSnapshot;
```

---

## 四、数据变化要求

### 4.1 顶部指标卡 metrics

当前指标包括：

- 今日总流量
- 监测节点
- 异常告警
- 数据健康度

要求：

- **今日总流量**每次刷新递增，增量在 500 到 5000 之间（单位：万立方米或相应单位），不要下降。
- **监测节点**大多数情况下递增，增量在 0 到 5 之间，偶尔可以减 1 到 2，但不能剧烈跳变。
- **异常告警**可上下浮动，建议波动范围为当前值的 -1 到 +2，但不能小于 0。
- **数据健康度**保持在 95 到 99.9 之间，大多数时候为优秀，偶尔下降到 96 左右时可触发中等状态。
- `delta` 字段要随着变化合理更新，不能只改 value 不改 delta。
- 格式保持现有 `value`（如 `28.6 万`）和 `delta`（如 `+12.4%`）的字符串格式。

### 4.2 趋势分析 trend

trend 数据包含：`label`, `value`

要求：

- 每隔几秒追加一个新的时间点。
- 新时间点使用当前 `HH:MM` 或 `HH:MM:SS` 格式。
- 保留最近 8 到 10 个点。
- 移除最旧的点。
- value 要与 metrics 中 "今日总流量" 保持大体一致的趋势关系。
- 折线图刷新时不要空白或报错。
- 需要处理 ECharts `setOption` 的动画过渡，避免重绘闪烁。

### 4.3 实时态势 liveStreams

liveStreams 数据包含：`label`, `value`, `state`

要求：

- 每 3 到 5 秒更新一次。
- value 小幅波动（例如：水位 ±0.05m，流速 ±0.1m/s，温度 ±0.3℃）。
- state 根据当前 value 的走势动态变化（如"平稳上升"、"轻微回落"、"绿色区间"等）。
- 保持与河流监测场景相关。

### 4.4 告警中心 alerts

alerts 数据包含：`title`, `detail`, `time`, `severity`

要求：

- 每 5 到 8 秒可能新增或更新一条动态。
- 新消息插入到列表最前面。
- 只保留最近 3 到 5 条。
- `severity` 从 `high`、`medium`、`low` 中选择。
- `high`（高）不要太频繁，大约 20% 到 30% 概率即可。
- 消息文案围绕教学数据中心、河流监测、流域生态场景，不要写成电商、物流或金融大屏。
- 推荐消息方向：
  - 上游水文站完成新一轮水位数据同步
  - 传感器案例库同步 12 条练习记录
  - 水质监测点新增一批观测数据提交
  - 教学平台发布新的可视化作业任务
  - 数据质量巡检通过，异常值已自动标记
  - 华东节点接口延迟轻微升高，已切换备用通道
  - 告警中心发现轻微波动，正在持续观察
  - 泵站数据区新增高频问题聚类结果

### 4.5 分类占比 distribution

当前分类包括：

- 上游
- 中游
- 下游

要求：

- 每 8 到 12 秒变化一次。
- 各分类占比轻微变化（±1 到 ±3）。
- 总和保持为 100。
- 不要出现负数。
- 不要让饼图频繁剧烈跳动。
- 需要处理 ECharts 饼图的动画过渡，避免闪烁。

### 4.6 系统覆盖 coverage

coverage 数据包含：`label`, `value`

要求：

- 每 10 到 15 秒变化一次。
- 各覆盖指标小幅递增或波动。
- 变化范围建议为当前值的 -1 到 +2。
- value 保持在 80 到 100 之间。

---

## 五、刷新机制要求

### 5.1 页面进入时

- 立即加载一次数据。
- 启动定时刷新。
- 建议每 2 到 3 秒刷新一次 dashboard 数据。
- 需要在 `DashboardPage` 的 `useEffect` 中实现，清理定时器避免内存泄漏。

### 5.2 页面离开时

- 必须清理定时器。
- 避免内存泄漏。
- 避免重复进入页面后出现多个定时器同时刷新。
- 在 `DashboardPage` 的 `useEffect` cleanup 中清除。

### 5.3 数据流设计

推荐流程：

```
DashboardPage.tsx
  -> dashboardRepository.getSnapshot()
  -> MockDashboardRepository.getSnapshot()
  -> getNextDashboardSnapshot() (模拟器)
  -> 返回新的 DashboardSnapshot
```

service 层保持 `getSnapshot()` 接口不变，在 mock repository 内部调用实时模拟器。

---

## 六、教学友好要求

- 代码要适合课堂讲解。
- 实时模拟器内部要有清晰函数拆分。
- 不要写难懂的过度抽象。
- 函数命名要直观，例如：
  - `updateMetrics`
  - `updateTrend`
  - `updateLiveStreams`
  - `updateAlerts`
  - `updateDistribution`
  - `updateCoverage`
- 关键逻辑可以写少量英文注释。
- 注释不要过多，避免噪音。

---

## 七、测试要求

请补充或调整测试，至少覆盖以下内容：

- **dashboard mock data 测试**：`src/shared/mock/dashboard-data.test.ts`
  - 验证模拟器连续调用两次后，部分数据会变化。
  - 验证 trend 数组长度保持在合理范围（8~10）。
  - 验证 alerts 数组长度不会无限增长。
  - 验证 distribution 总和保持为 100。
  - 验证 coverage 的 value 保持在合理范围（80~100）。
  - 验证 metrics 中 delta 字段会随数据变化而更新。

- **dashboard page 测试**：`src/pages/dashboard/ui/dashboard-page.test.tsx`
  - 保留原有测试，确保实时升级后组件仍能正常渲染。

- 如果已有测试足够，可以在原测试上扩展；不要为了测试而大改项目结构。

---

## 八、E2E 要求

**修改 `tests/e2e/dashboard.spec.ts`**，增加以下简单断言：

- 页面标题可见（"RiverVision"、"江视觉数据大屏"）。
- 指标卡片可见。
- 核心指标区域可见。
- 等待一次刷新后（等待 3~5 秒），页面仍然没有控制台 error。

注意：

- 不要让 E2E 依赖具体随机数，否则测试不稳定。
- E2E 应该只检查 UI 是否可见、控制台是否报错，不检查具体数值。

**修改 `playwright.config.ts`**：

- 确保 `baseURL` 和 `webServer.port` 与当前项目端口一致。
- 如果项目默认端口已改为 10001，请更新为 10001。

---

## 九、代码质量要求

完成后必须运行：

```bash
npm run lint
npm run test
npm run build
```

如果 E2E 环境可用，也运行：

```bash
npm run test:e2e
```

如果验证失败：

1. 先阅读错误原因。
2. 只做必要修复。
3. 修复后重新运行失败的验证命令。
4. 不要绕过 lint、test 或 build。

---

## 十、浏览器验证要求

请启动本地开发服务并实际打开浏览器检查页面。

当前项目开发服务端口统一改为 10001，请优先使用 10001 启动和验证，例如：

```bash
npm run dev -- --host 127.0.0.1 --port 10001
```

不要再使用 Vite 默认端口 5173 或其他未确认的端口。

浏览器检查内容：

- 页面不是空白。
- 标题显示正常。
- 指标卡片显示正常。
- 趋势图正常渲染且数据随时间滚动更新。
- 饼图正常渲染。
- 实时态势面板显示正常。
- 数据会随时间变化（肉眼可见）。
- 告警列表会滚动产生新消息。
- 页面没有明显布局重叠。
- 页面没有滚动条（或只有极少量）。
- 控制台没有严重错误。

---

## 十一、验收标准

大屏数据不再是完全静态。具体包括：

- [ ] 顶部指标卡会实时变化。
- [ ] 趋势分析会持续更新（数据点滚动）。
- [ ] 告警中心会滚动产生新消息。
- [ ] 分类占比会低频变化。
- [ ] 实时态势中的 liveStreams 会周期性更新。
- [ ] 系统覆盖 coverage 会低频变化。
- [ ] 所有数据变化都在合理范围内。
- [ ] 页面无明显闪烁、重叠或滚动条。
- [ ] TypeScript 类型无错误。
- [ ] `npm run lint` 通过。
- [ ] `npm run test` 通过。
- [ ] `npm run build` 通过。
- [ ] `npm run test:e2e` 通过（如果环境可用）。

---

## 十二、最终交付说明

完成后请告诉我：

1. **修改了哪些文件**（精确路径）。
2. **实时模拟器的设计思路**（数据持有方式、函数拆分、状态管理）。
3. **哪些数据模块实现了实时变化**（metrics / trend / liveStreams / alerts / distribution / coverage）。
4. **各模块的大致刷新频率**。
5. **是否继续保持 static mock / API 可切换结构**（`dashboard-service.ts` 中的 `useMock` flag）。
6. **已运行的验证命令和结果**（lint / test / build / e2e）。
7. **本地开发服务地址**（如 `http://127.0.0.1:10001`）。
8. **浏览器检查结果**（逐项列出检查项通过情况）。
9. **是否存在未完成事项**（如有，说明原因和后续计划）。

---

## 附：RiverVision 项目当前技术栈速查

- **框架**：React 19 + TypeScript 5.9
- **构建工具**：Vite 7.1
- **状态管理**：Zustand 5（当前主要用 useState，可逐步引入）
- **图表库**：ECharts 5.6
- **路由**：无（单页应用）
- **测试**：Vitest + React Testing Library
- **E2E**：Playwright
- **代码规范**：ESLint + Prettier
- **路径别名**：`@` = `src/`

---

## 附：当前 Dashboard 数据结构参考

位于 `src/entities/dashboard/model/types.ts`：

```typescript
export interface MetricItem {
  label: string;
  value: string;
  delta: string;
  tone: 'cyan' | 'blue' | 'green' | 'gold';
}

export interface TrendPoint {
  label: string;
  value: number;
}

export interface DistributionItem {
  label: string;
  value: number;
  percent: number;
}

export interface AlertItem {
  title: string;
  detail: string;
  time: string;
  severity: 'high' | 'medium' | 'low';
}

export interface DashboardSnapshot {
  title: string;
  subtitle: string;
  timestamp: string;
  metrics: MetricItem[];
  trend: TrendPoint[];
  distribution: DistributionItem[];
  alerts: AlertItem[];
  liveStreams: Array<{ label: string; value: string; state: string }>;
  coverage: Array<{ label: string; value: number }>;
}
```
