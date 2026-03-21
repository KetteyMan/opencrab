# OpenCrab Team Runtime 调研补充

日期：2026-03-21  
状态：基于 OpenClaw 重新校准

## 1. 这次调研后的关键变化

之前我们已经确认 OpenCrab 不适合做成 workflow builder。  
这次进一步对照 OpenClaw 后，又确认了一件更重要的事：

- 多 Agent 的核心不在“前台多人聊天”
- 而在“后台多 runtime 隔离 + 明确路由 + 前台单入口”

所以 OpenCrab 的 Team Mode 不应该继续沿着“群聊里模拟多角色一起说话”演化。

## 2. OpenClaw 的关键启发

OpenClaw 官方文档最值得借鉴的点：

- 一个 agent 是独立运行实体，不只是 prompt 片段
- agent 拥有自己的 workspace、session、bootstrap 文件
- 多 agent 的价值来自隔离和编排，不来自“群聊感”
- 主入口可以保持简洁，worker 可以按需被调用

这对 OpenCrab 的直接影响是：

- `AgentProfile` 不能只停留在静态资产层
- 必须落到 `Agent Runtime Session`
- Team 群聊不能继续承担执行职责

## 3. 我们原来方案哪里需要调整

原先判断“每个 Agent 都应该是独立 thread、独立权限、独立上下文”是对的。  
需要调整的是前台表达和运行拓扑：

- 不是“每个 Agent 一个长期可见聊天窗口”
- 而是“每个 Agent 一个后台 runtime session”
- 用户前台仍然主要面对 PM 和 Team 群聊

## 4. 调整后的推荐架构

### 4.1 Frontstage

- Team 群聊
- Team Room

### 4.2 Backstage

- PM runtime
- Worker runtime A
- Worker runtime B
- Worker runtime C

### 4.3 Orchestrator

由 PM 承担主要编排角色：

- 读群聊
- 决定是否派工
- 指定 worker
- 收集结果
- 回写群聊

## 5. 为什么“多个独立会话”是必须的

如果没有独立会话，就会出现这些问题：

- 成员没有独立 Codex thread
- 不能积累自己的上下文
- 不能形成真正的执行历史
- 所谓成员回复只能是模板台词
- PM 也无法真的把工作交给别人去完成

这正是旧 Team 群聊的根本问题。

## 6. 对 OpenCrab 的落地建议

### 6.1 必做

- 为每个 Team 成员创建独立 runtime conversation
- runtime conversation 默认隐藏
- PM 是唯一可委派成员
- 用户消息先进 PM runtime，再决定是否派工

### 6.2 应做

- worker 接任务时读取最近群聊摘要
- worker 结果回流群聊，而不是只回确认语
- Team Room 展示 runtime 状态和最近一次产出摘要

### 6.3 后做

- 多轮 PM 收束
- 并行 fan-out / gather
- checkpoint 后继续执行
- 渠道 / 定时任务直接触发 runtime

## 7. 最终结论

OpenCrab 的 Team Mode 正确方向不是：

- 一个群聊里模拟很多角色轮流说话

而是：

- 一个前台 Team 群聊
- 一个 PM 编排入口
- 多个后台独立 Agent Runtime Session
- 结果以可见消息和 artifact 的形式回流
