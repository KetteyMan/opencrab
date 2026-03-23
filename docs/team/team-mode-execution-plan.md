# OpenCrab Team Mode 详细执行计划

日期：2026-03-23  
状态：Active  
适用范围：后续 Team Mode 全量迭代、验收与文档同步  
前置文档：

- [OpenCrab Team Runtime 设计方案](/Users/sky/SkyProjects/opencrab/docs/team/multi-agent-design.md)
- [OpenCrab Team Runtime 调研补充](/Users/sky/SkyProjects/opencrab/docs/team/multi-agent-research.md)
- [OpenCrab Team OS 设计稿](/Users/sky/SkyProjects/opencrab/docs/team/team-os-design.md)
- [OpenCrab Task Graph 设计稿](/Users/sky/SkyProjects/opencrab/docs/team/task-graph-design.md)
- [OpenCrab Learning Loop 设计稿](/Users/sky/SkyProjects/opencrab/docs/team/learning-loop-design.md)
- [OpenCrab 不做 Subagents，而是要走向比 Agent Teams 更像真实团队的模式](/Users/sky/SkyProjects/opencrab/docs/blogs/opencrab-beyond-agent-teams.md)

## 1. 文档目标

这份文档不是新的概念设计稿，而是：

`把 Team OS / Task Graph / Learning Loop 三份设计稿落成一份可以持续推进、持续打勾、持续更新进展的执行清单。`

后续 Team Mode 的所有迭代，优先以这份计划作为：

- 当前总路线
- 阶段拆分
- 进展同步面
- 范围控制面

## 2. 使用方式

每完成一轮 Team Mode 相关开发，都应更新这份文档中的：

- 阶段状态
- 子项状态
- 最新进展
- 下一步建议

避免后续协作再次退化成：

- 只靠聊天记录追进展
- 只知道“做了很多”，不知道做到哪一层
- 不清楚哪些是已完成骨架，哪些仍是设计稿

## 3. 状态说明

- `已完成`
  已经有稳定实现，并且进入当前主链路
- `进行中`
  已经开始实现，但只完成了骨架或一部分关键流
- `未开始`
  设计明确，但尚未进入实现
- `暂不做`
  已经讨论过，但当前阶段明确不进入实现

## 4. 总体路线

OpenCrab Team Mode 不做 `subagents`，也不做“群聊里多人表演”。  
当前确定的路线是：

`Team Runtime -> Team OS 骨架 -> Task Graph -> Governance -> Coordination -> Memory -> Learning Loop -> 可控自治`

换句话说，先把团队做成：

- 会稳定干活的数字组织

再把团队做成：

- 会持续变好的数字组织

## 4.1 当前阶段判断

当前这份计划已经可以直接按 Phase 本身来理解，不需要再额外读“推荐顺序说明”。

截至现在，阶段判断可以直接压缩成：

- `Phase 0-4`
  基础骨架已成立，可以视为第一阶段完成。
- `Phase 5`
  当前主战场，负责把 Team 从“会跑任务”推进到“会管理交付物”。
- `Phase 6`
  下一阶段，等交付物闭环更完整后再放开成员协作。
- `Phase 7`
  属于支撑层，会伴随主战场持续补强，但不单独抢主线。
- `Phase 8-10`
  仍属后续阶段，不进入当前实现主线。

---

## 5. Phase 0：战略与文档基线

目标：先把方向、术语、组织模型和协作入口统一，避免实现层边做边漂。

### 5.1 路线选择

- [x] 明确 OpenCrab 不做 `subagents` 模式
  最新进展：已写入 Team 相关设计与博客结论，后续 Team Mode 路线明确以“比 Claude agent teams 更接近真实团队”为目标。

- [x] 明确 Team Mode 的目标不是“多人群聊”，而是“数字团队工作台”
  最新进展：已在 [OpenCrab Team OS 设计稿](/Users/sky/SkyProjects/opencrab/docs/team/team-os-design.md) 和 [博客长文](/Users/sky/SkyProjects/opencrab/docs/blogs/opencrab-beyond-agent-teams.md) 中定稿。

- [x] 明确 Team Mode 的组织中枢是 PM，而不是平均化多 Agent
  最新进展：当前运行实现已经是 `PM-first`，项目经理是唯一 Lead / canDelegate 成员。

### 5.2 文档基线

- [x] 产出 Team OS 设计稿
  最新进展：已完成，路径见 [team-os-design.md](/Users/sky/SkyProjects/opencrab/docs/team/team-os-design.md)。

- [x] 产出 Task Graph 设计稿
  最新进展：已完成，路径见 [task-graph-design.md](/Users/sky/SkyProjects/opencrab/docs/team/task-graph-design.md)。

- [x] 产出 Learning Loop 设计稿
  最新进展：已完成，路径见 [learning-loop-design.md](/Users/sky/SkyProjects/opencrab/docs/team/learning-loop-design.md)。

- [x] 整理 docs 目录结构与总索引
  最新进展：`docs/` 已按 `product / engineering / team / blogs` 收拢，并补了 [docs/README.md](/Users/sky/SkyProjects/opencrab/docs/README.md)。

### 5.3 当前判断

状态：`已完成`

说明：

- 文档基线已经够用，后续不需要再新增新的顶层概念文档
- 后面重点应进入“按这份计划推进实现并持续回填进展”

---

## 6. Phase 1：Team Runtime 基础骨架

目标：把 Team Mode 从“拼台词群聊”升级成“前台群聊 + 后台独立 runtime”。

### 6.1 独立成员 runtime

- [x] 每个成员有独立 hidden runtime conversation
  最新进展：已进入主链路，成员拥有独立 `runtimeConversationId` 与独立上下文。

- [x] 项目经理拥有独立 runtime，并作为默认编排入口
  最新进展：已接入，用户默认与项目经理对话，PM 决定后续派工。

- [x] Team 群聊只作为 frontstage，不再承担真实执行
  最新进展：已接入，群聊主要展示前台过程，真实执行发生在 backstage runtime。

### 6.2 运行控制

- [x] 支持启动团队运行
  最新进展：已有独立入口，且会自动创建团队群聊。

- [x] 支持暂停团队
  最新进展：已支持暂停与恢复，且暂停后会阻止后台继续推进。

- [x] 支持删除团队并清理相关会话
  最新进展：已支持清理 Team Room 群聊、成员 hidden runtime conversation，以及相关 `projectId` 会话。

- [x] 支持卡住检测与重推当前棒次
  最新进展：项目经理已具备检测成员异常、重启卡住成员并继续推进的能力。

### 6.3 当前判断

状态：`已完成`

说明：

- Team Runtime 基础骨架已经存在
- 但当前骨架仍偏“PM 编排驱动”，尚未进入真正任务图和 mailbox 协作阶段

---

## 7. Phase 2：Team OS 基础组织层

目标：把团队里的“人”和“状态”结构化，而不是靠聊天文案推断。

### 7.1 角色模型

- [x] 团队默认绑定项目经理
  最新进展：已完成，系统智能体已内置项目经理，创建团队时自动装配。

- [x] 成员角色与 Team 结构角色分离
  最新进展：当前已存在 `角色标签` 与 `teamRole` 的分层概念；`teamRole` 已用于 Team 内部行为。

- [x] 默认系统成员支持扩展
  最新进展：已新增 `审美设计师` 作为默认系统智能体，并扩充了设计相关 skills。

### 7.2 Team Room 组织视图

- [x] Team Room 显示当前阶段、当前 baton、下一棒、PM 判断
  最新进展：已完成，Team Room 已有 `Mission Control` 与成员推进看板。

- [x] 团队群聊支持 `@成员`
  最新进展：已完成，且补了候选层、快捷成员 pill 等交互。

- [x] 团队详情页支持删除、暂停、恢复、打开群聊
  最新进展：已完成。

### 7.3 当前判断

状态：`已完成`

说明：

- Team OS 的“角色与前台可见组织感”已经具备第一版
- 后续要继续补的是任务对象、治理对象、学习对象，而不是继续堆角色 UI

---

## 8. Phase 3：Task Graph 骨架

目标：把 Team Mode 从“消息驱动”切到“任务驱动”。

### 8.1 Task 一等公民

- [x] 引入 `ProjectTaskRecord`
  最新进展：已进入 [types.ts](/Users/sky/SkyProjects/opencrab/lib/projects/types.ts)，Team Store / Project Detail 已正式包含 `tasks`。

- [x] 任务具备基础字段
  最新进展：已具备：
  - `title`
  - `description`
  - `status`
  - `ownerAgentId`
  - `stageLabel`
  - `acceptanceCriteria`
  - `dependsOnTaskIds`
  - `blockedByTaskId`
  - `resultSummary`
  - 时间字段

- [x] 成员支持关联 `currentTaskId`
  最新进展：已接入，成员与当前任务已有结构化映射。

- [x] 任务记录显式包含 `claimedAt / blockedReason`
  最新进展：已完成。任务现在不只知道“卡住了”，还能表达“何时被接手、当前为什么被阻塞”。

### 8.2 任务状态流

- [x] 引入基础任务状态流
  最新进展：当前已支持：
  - `draft`
  - `ready`
  - `claimed`
  - `in_progress`
  - `in_review`
  - `waiting_input`
  - `blocked`
  - `completed`
  - `reopened`
  - `cancelled`

- [x] 引入显式 `claimed`
  最新进展：已完成第一版。PM 派工创建任务后，第一棒会先进入 `claimed`，再在成员真正开跑时进入 `in_progress`。

### 8.3 PM 派工任务化

- [x] PM 派工时创建结构化任务
  最新进展：已实现，PM 规划完成后会创建 delegation tasks，而不是只发自然语言。

- [x] PM planning task 独立存在
  最新进展：已实现，运行开始时会激活或创建 PM planning task。

- [x] checkpoint 会创建结构化 checkpoint task
  最新进展：已实现，`waiting_approval` / `waiting_user` 会生成对应 checkpoint task。

### 8.4 Team Room 任务板

- [x] Team Room 展示 Task Graph 摘要
  最新进展：已上线 `任务图摘要` 面板，支持：
  - 当前执行
  - 待复核
  - 等补充 / 阻塞
  - 最近完成

- [x] 任务卡展示 owner、依赖、验收、结果摘要、更新时间
  最新进展：已完成第一版。

- [x] 提供真正的依赖关系视图
  最新进展：已完成骨架版。当前 Task Graph 已同时展示：
  - `接力依赖` rail
  - `依赖边` 列表
  - 任务级 `blockedReason`
  对于当前阶段的 Team Mode，这已经足以把依赖关系从隐含状态升级为显式结构。

- [x] 依赖完成后自动解锁下游任务
  最新进展：已完成第一版。当前任务完成后，会自动把下游阻塞任务从 `blocked` 切到 `ready`，不再只是静态展示依赖。

- [x] 支持返工任务进入 `reopened`
  最新进展：已完成第一版。在 `waiting_approval` 下要求修改时，会基于 pending reviews 自动生成 `reopened / blocked` 的 follow-up task 链，恢复运行后会优先从这条返工链继续。

### 8.5 当前判断

状态：`已完成`

说明：

- Task Graph 的“有任务”已经成立
- 当前已经具备：
  - 显式任务对象
  - 显式状态流
  - 显式 claim 起点
  - 显式依赖链
  - 自动解锁
  - 返工 reopened
  - task -> review / artifact 挂接
- 后续更复杂的 lock / lease / mailbox 协作不再算 Phase 3 骨架问题，而进入后续治理与协作阶段

---

## 9. Phase 4：Governance 与质量治理

目标：让团队不是“能跑”，而是“可控、可审、可收口”。

### 9.1 Checkpoint

- [x] 支持 `waiting_user`
  最新进展：已完成，PM 可进入待补充状态。

- [x] 支持 `waiting_approval`
  最新进展：已完成，PM 可进入待确认状态。

- [x] Team Room 顶部显示待确认 / 待补充入口
  最新进展：已完成，状态为 `waiting_approval` 时顶部已有明确确认入口。

### 9.2 Review 机制

- [x] 用任务状态表达 review 阶段
  最新进展：当前已通过 `in_review` 和 checkpoint task 表达“待复核”，并继续保留这层状态表达。

- [x] 引入独立 Review 对象
  最新进展：已引入 `ProjectReviewRecord` 与 `reviews` 状态层。成员任务交回后会创建待 PM 复核记录；进入 `waiting_approval` 时会创建面向用户的阶段复核记录。

- [x] 支持 reviewer verdict、blocking comments、follow-up task
  最新进展：当前已支持：
  - `pending / approved / changes_requested / cancelled`
  - `blockingComments`
  - `followUpTaskId`
  同时已经完成主链路：
  - 用户在 `waiting_approval` 下要求修改时，会生成对应 follow-up task
  - review 会挂上 `followUpTaskId`
  - Team Room 任务卡会提示“已生成后续 follow-up task”
  - review verdict 已进入任务卡与返工链展示，不再只是底层状态

### 9.3 Ownership / Lock / 风险治理

- [x] 文件 ownership / lock
  最新进展：已完成第一版。当前任务已支持：
  - `lockScopePaths`
  - `lockStatus`
  - `lockBlockedByTaskId`
  - 基于锁范围的自动阻塞与自动解锁
  - Team Room 直接展示“锁定范围 / 锁占用”

- [x] 任务 lease / 抢占 / 过期恢复
  最新进展：已完成治理主链。当前任务已支持：
  - `leaseAcquiredAt`
  - `leaseHeartbeatAt`
  - `leaseExpiresAt`
  - 任务卡直接显示“租约有效至 / 已过期”
  - PM 在判断卡住时，已经会把 lease 过期作为显式治理信号之一
  - 重试次数记录
  - 连续异常后的 owner replacement
  - PM 接管异常任务并回收到重新编排链

- [x] runtime stuck detection / retry
  最新进展：已完成。当前已经支持：
  - runtime 卡住检测
  - 与 task lease 联动的治理判断
  - 第一轮自动重试
  - 连续异常后不再盲目重试，而是把任务 ownership 回收给 PM

### 9.4 当前判断

状态：`已完成`

说明：

- checkpoint 已经有了
- review 已经开始真正带动返工任务与恢复链
- lease、lock、owner replacement 已经进入治理主链
- 当前治理层已经具备“可控、可审、可恢复”的第一版骨架
- 后续不再把治理层当作缺失模块，而是进入 Coordination 与 Artifact 继续深化

---

## 10. Phase 5：交付物闭环

目标：让 Team Mode 从“围绕任务推进”升级成“围绕交付物推进”。

### 10.1 任务绑定交付物

- [x] 任务支持 `artifactIds`
  最新进展：字段和主链路都已接通。初始 bootstrap task 会挂接团队初始化 artifact；成员任务完成后也会生成并挂接对应 task result artifact。

- [x] 任务完成时自动挂接相关 artifact
  最新进展：已完成第一版：
  - 成员完成任务后会生成 `Task Result` 类型 artifact，并自动挂到对应 task
  - checkpoint task 会自动挂接 `阶段总结 / 待补充事项` artifact
  - Team Room 任务卡已可看到“这条任务已挂接几项交付物”

- [ ] Team Room 可从任务直接跳到交付物
  最新进展：未开始。

### 10.2 交付物图谱

- [~] artifact 显示来源任务、owner、review 状态
  最新进展：当前已经实现 task -> artifact 的单向挂接，以及 task 卡上的复核状态显示；artifact 自身仍未携带显式来源任务与 reviewer 元数据。

- [ ] artifact 支持成为后续任务依赖
  最新进展：未开始。

- [ ] 建立 artifact graph，而不是 artifact 列表
  最新进展：未开始。当前只有“挂接了什么”，还没有“谁依赖谁、谁由谁验收、谁进入下一棒”。

### 10.3 当前判断

状态：`进行中`

说明：

- 这是当前主战场
- 这一层补完之后，Team 才真正围绕“可交付成果”而不是围绕聊天和状态运转

---

## 11. Phase 6：成员协作层

目标：让成员之间不是只能靠 PM 转述，而是开始拥有结构化协作机制。

### 11.1 Agent-to-Agent 协作

- [ ] 引入 mailbox thread
  最新进展：未开始。

- [ ] 支持 direct message / broadcast
  最新进展：未开始。

- [ ] 支持成员向上游追问 / 请求补充 / 请求 review
  最新进展：未开始。

### 11.2 自协作能力

- [ ] 支持有限 self-claim
  最新进展：未开始；当前主要还是 PM 指派。

- [ ] 支持成员发起结构化 escalation
  最新进展：未开始。

- [ ] 支持成员基于任务图自发建议下一棒
  最新进展：未开始。

### 11.3 当前判断

状态：`未开始`

说明：

- 这是交付物闭环之后的下一阶段
- 它不是当前主战场，但会直接建立在交付物图谱之上

---

## 12. Phase 7：运行与前台支撑层

目标：让团队运行更可靠、前台更清楚，但这层始终服务主线，不单独抢主战场。

### 12.1 Runtime 健康与恢复

- [x] 成员进展 trail / progress label
  最新进展：已完成第一版，当前执行过程可以在 Team Room 可视化看到。

- [x] 成员心跳与卡住判断
  最新进展：已完成第一版，PM 能检查成员是否卡住。

- [ ] 统一 Heartbeat / StuckSignal / RecoveryAction 数据对象
  最新进展：未开始；当前能力散落在 runtime 状态和 store 逻辑里。

- [x] 支持暂停 / 恢复
  最新进展：已完成。

- [x] 支持卡住成员重试
  最新进展：已完成第一版。

- [ ] 支持替换成员继续
  最新进展：未开始；当前只完成了 PM 接管异常任务，还没有正式成员替补链。

- [ ] 支持回滚到最近 checkpoint 后重跑
  最新进展：未开始。

### 12.2 Frontstage 产品体验

- [x] Team Room 已收成指挥台风格，而不是长文堆叠
  最新进展：已完成第一版，有 Mission Control、成员推进看板、活动流、任务图摘要。

- [x] 顶部状态、确认入口、暂停恢复入口
  最新进展：已完成。

- [~] 任务板、活动流、成员看板的视觉统一
  最新进展：已有第一版，但后续仍需持续打磨。

- [x] 任务卡可见复核状态
  最新进展：已完成。

- [x] 团队群聊具备模式标记、`@成员`、回放能力
  最新进展：已完成，且回放已扩展为全对话通用能力。

- [~] 团队群聊顶部信息、状态信息与输入区紧凑化
  最新进展：已完成一轮收缩，但仍有细节体验可继续优化。

- [x] 团队列表页标题与 slogan 已中文化，卡片高度已限制
  最新进展：已完成第一版。

- [ ] 列表页与任务层信息的进一步联动
  最新进展：未开始。

### 12.3 当前判断

状态：`进行中`

说明：

- 这是支撑层，不是当前主战场
- 后续需要伴随 Phase 5 一起持续补强，而不是单独展开大重构

---

## 13. Phase 8：Memory Layer

目标：让团队不是每轮都从零开始。

### 13.1 项目记忆

- [ ] 引入 Project Memory 结构化对象
  最新进展：未开始。

- [ ] 将关键决策、偏好、风险、历史坑点结构化沉淀
  最新进展：未开始。

### 13.2 团队记忆

- [ ] 记录最佳接力顺序、常见卡点、常见 review 问题
  最新进展：未开始。

- [ ] 让 Team Memory 真正影响后续派工
  最新进展：未开始。

### 13.3 角色记忆

- [ ] 记录每个成员最擅长的任务类型、常见错误、最优输入格式
  最新进展：未开始。

- [ ] 让角色记忆影响任务模板、派工和 review
  最新进展：未开始。

### 13.4 当前判断

状态：`未开始`

说明：

- 这是 OpenCrab 超过普通 agent teams 的关键层之一
- 但必须建立在 Task / Review / Artifact 更完整之后

---

## 14. Phase 9：Learning Loop

目标：让团队不只是完成任务，而是会从任务中学习如何更好地协作。

### 14.1 Reflection

- [ ] 任务级微复盘
  最新进展：未开始。

- [ ] 阶段级复盘
  最新进展：未开始。

- [ ] 项目级 run summary
  最新进展：未开始。

### 14.2 Pattern / Policy

- [ ] 常见失败模式沉淀
  最新进展：未开始。

- [ ] task template suggestion
  最新进展：未开始。

- [ ] role tuning suggestion
  最新进展：未开始。

- [ ] quality gate suggestion
  最新进展：未开始。

### 14.3 落地升级

- [ ] skill suggestion / skill upgrade
  最新进展：未开始。

- [ ] agent profile update suggestion
  最新进展：未开始。

- [ ] 允许部分建议进入 human review 流
  最新进展：未开始。

### 14.4 当前判断

状态：`未开始`

说明：

- 这是最重要的差异化层
- 但必须等 Task Graph、Governance、Memory 三层更扎实后再进入

---

## 15. Phase 10：可控自治

目标：不是完全放飞团队，而是在高纪律边界内提升自推进能力。

### 15.1 团队自推进

- [ ] 用户离线时，PM 可在安全边界内推进多轮
  最新进展：未开始。

- [ ] 成员可在任务图约束下自领下一步
  最新进展：未开始。

- [ ] 团队能主动识别风险并提前升级
  最新进展：未开始。

### 15.2 高风险边界

- [ ] 高风险动作必须走 gate
  最新进展：未开始。

- [ ] 关键政策修改必须 human in the loop
  最新进展：未开始。

### 15.3 当前判断

状态：`未开始`

说明：

- 这是远期目标
- 当前阶段不应该为了“更像自主团队”而提前牺牲系统稳定性

---

## 16. 当前里程碑判断

截至 2026-03-23，OpenCrab Team Mode 所处位置可以更准确地概括为：

`已经完成 Team Runtime、Team OS、Task Graph 骨架与 Governance 第一版，下一步主战场已经切换为“交付物图谱”。`

也就是说，系统已经跨过了最早期的：

- 只有群聊，没有真正团队结构
- 只有成员，没有任务对象
- 只有任务，没有治理能力

当前更准确的结构判断如下：

### 16.1 已经可以视为完成的层

- Team Runtime 基础骨架
- PM-first 团队结构
- frontstage / backstage 分层
- 暂停 / 恢复 / 删除 / 卡住检测 / 首轮自动重试
- 团队群聊与 Team Room 基础产品形态
- 当前执行过程公开进展
- Task Graph 第一版骨架
- Governance 第一版骨架

### 16.2 当前仍在进行中的层

- 交付物闭环
- Runtime 恢复记录与 run 视图
- Team Room / 团队群聊围绕任务与交付物的信息收口

### 16.3 当前绝对不该抢跑的层

- mailbox / agent-to-agent coordination
- self-claim / escalation / direct message
- memory layer
- learning loop
- controlled autonomy

原因不是这些不重要，而是当前如果先做这些，会直接把主链从“任务和交付物闭环”拉散。

## 17. 当前建议的下一步

如果现在要决定“下一步做什么”，这份文档本身已经足够给出答案：

- 现在该推进的是 `Phase 5：交付物闭环`
- `Phase 6：成员协作层` 是下一阶段
- `Phase 7` 只做伴随主线的必要补强
- `Phase 8-10` 暂时不进入实现主线

所以，当前最合理的选择不是去做 mailbox、self-claim 或更强自治，而是继续把下面这些补完：

- artifact 来源任务
- artifact owner / reviewer
- artifact 依赖关系
- task -> artifact 跳转
- artifact graph
- Team Room / 群聊里围绕交付物的可见性
