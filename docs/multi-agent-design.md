# OpenCrab Team Runtime 设计方案

日期：2026-03-21  
状态：已更新为 OpenClaw 对照后的实现方向  
前置文档：[`docs/multi-agent-research.md`](./multi-agent-research.md)

## 1. 一句话定义

`OpenCrab Team Runtime = 一个前台群聊 + 一个项目经理编排器 + 多个后台独立 Agent Runtime Session。`

这次设计调整的核心原因是：

- 不能再把 Team 群聊做成“一个会话里轮流模拟多个人说话”
- 每个 Agent 必须有独立 session、独立上下文、独立执行状态
- 群聊只负责展示 frontstage 协作，不负责真正执行

## 2. 从 OpenClaw 学到什么

对照 OpenClaw 官方文档后，最重要的结论不是“做很多可见聊天窗口”，而是：

- 一个 agent 本质上是一套独立运行态：`workspace + agentDir + session`
- 多 agent 的关键是隔离、路由、bindings、spawn，而不是前台群聊刷屏
- 用户主入口通常应该保持单一，worker 在后台按需被调起

因此，OpenCrab 的 Team Mode 需要借鉴的不是“多人群聊表演”，而是：

- frontstage / backstage 分层
- PM 统一编排
- worker 独立 runtime
- 群聊消息只作为共享上下文和展示面

## 3. 产品结构

### 3.1 用户可见层

- `Team 群聊`
  用户和项目经理对话的主入口
- `Team Room`
  展示团队目标、成员、运行状态、结果和可选 backstage 信息
  并明确显示“项目经理当前判断”：继续派工、等待用户补充、或交付待确认

### 3.2 后台执行层

- `PM Runtime Session`
  项目经理自己的独立会话
- `Worker Runtime Session`
  每个成员各自独立的后台会话

默认情况下，这些 runtime session 不在侧边栏显性展示。

## 4. 核心原则

- Chat-first：用户仍然先在群聊里发话
- PM-first：默认由项目经理与用户交互
- Runtime isolation：每个成员有独立 session 和独立 Codex thread
- Frontstage / Backstage：群聊是 frontstage，成员会话是 backstage
- Delegation is explicit：PM 派工后，才真正触发成员 runtime
- Result over acknowledgement：成员回到群聊时应优先交付结果，而不是“收到”

## 5. 运行模型

### 5.1 Team 群聊不是执行器

群聊只做三件事：

- 接收用户消息
- 展示 PM 的安排与成员产出
- 沉淀可见协作历史

群聊本身不拥有“多 Agent 共用的唯一 thread”。

### 5.2 PM Runtime 的职责

PM Runtime 负责：

- 读取最新群聊上下文
- 判断是否需要派工
- 决定派给哪些成员
- 生成 frontstage 的分工消息
- 等待成员结果后继续收束
- 在每一阶段结束时明确作出 3 选 1 决策：
  - `继续派工`
  - `等待用户补充`
  - `交付阶段总结，等待用户确认`

### 5.3 Worker Runtime 的职责

Worker Runtime 负责：

- 读取本次派工任务
- 读取最近相关群聊上下文
- 基于自己的 Agent 预设独立执行
- 产出真正结果，而不是过程性回应

## 6. 数据模型

### 6.1 ProjectRoom

保留现有：

- `goal`
- `workspaceDir`
- `teamConversationId`
- `runStatus`

### 6.2 ProjectAgentRecord

成员记录需要具备真正 runtime 能力：

- `runtimeConversationId`
- `lastAssignedTask`
- `lastResultSummary`
- `status`
- `canDelegate`

规则：

- `项目经理` 是唯一 `canDelegate=true`
- 其他成员一律是 worker

### 6.3 Hidden Conversation

后台 runtime conversation 默认：

- `hidden=true`
- 不在侧边栏显示
- 保留自己的 Codex thread
- 继续复用现有 conversation 基础设施

## 7. 关键交互流程

### 7.1 用户在群聊里发消息

1. 群聊追加用户消息
2. Team Runtime 读取 PM Runtime Session
3. PM 判断是否派工，并输出面向群聊的安排
4. 如果派工：
5. 分别触发对应 Worker Runtime Session
6. Worker 产出真实结果
7. 结果写回群聊
8. PM 必须基于最新结果再次判断：
   - 继续派下一棒
   - 还是先向用户索要补充
   - 还是宣布这一轮已有可交付结果
9. 只有当 PM 明确进入 `waiting_approval` 或 `waiting_user` 时，这一轮才算暂停

### 7.2 用户 `@某个成员`

1. 群聊保留 `@` 语义
2. PM 仍然是编排入口
3. PM 看见显式点名后，优先派给对应成员 runtime
4. 该成员的真实结果回流群聊

### 7.3 启动 Team

启动 Team 时，系统应：

- 创建 Team 群聊
- 创建 PM runtime
- 按需创建 worker runtime
- 不再把“虚构发言”当成成员真实工作

### 7.4 PM 生命周期

项目经理不是“一次性分工器”，而是整轮协作的 owner。每轮运行必须遵循下面的闭环：

1. PM 接收目标或新的用户补充
2. PM 判断第一阶段该由谁接力
3. worker 真正执行并交回结果
4. PM 基于当前结果继续决定下一棒
5. 重复多轮，直到：
   - 已有可交付结果 -> `waiting_approval`
   - 缺少用户关键输入 -> `waiting_user`
6. PM 输出阶段总结，并明确告诉用户：
   - 可以确认结束
   - 或继续反馈问题，进入下一轮

## 8. MVP 落地顺序

### 第一阶段

- Team 群聊保留
- PM 成为唯一 lead
- 每个成员拥有隐藏 runtime conversation
- 群聊消息触发 PM runtime 与 worker runtime

### 第二阶段

- PM 在 worker 完成后做二次收束
- Team Room 展示 runtime 状态与最后一次结果摘要
- 支持从 Team Room 查看某个成员的 backstage 执行记录

### 第三阶段

- 支持 PM 多轮派工
- 支持 checkpoint / approval 驱动的继续执行
- 支持任务和渠道直接触发 Team Runtime

## 9. 这次清理掉的旧思路

不再把下面这些当成长期架构：

- 一个群聊 thread 里同步拼出多个成员的“收到，我来做”台词
- 把成员回复当成执行结果
- 把 Team Mode 理解成“很多人一起刷消息”
- 让多个成员共享同一底层执行 thread

## 10. 当前实现要求

当前代码实现需要满足：

- 真实独立 session
- 用户侧边栏不被后台会话污染
- PM 派工后，worker 必须通过自己的会话实际执行
- 群聊中展示的是执行结果回流，而不是纯模板回复
- PM 不能只分工一次就停下；必须持续推进，直到显式进入 `waiting_user` 或 `waiting_approval`
