# opencrab V1 核心对象与数据模型草案

## 1. 目标

这份草案用于定义 `opencrab` V1 的核心对象、对象关系和产品语义。

当前只回答三类问题：
- 系统里有哪些核心对象
- 这些对象彼此如何关联
- V1 需要保留哪些关键字段和状态

当前不展开：
- 数据库选型
- 表结构细节
- 索引设计
- 接口协议细节

## 2. 核心对象

V1 建议先收敛为 9 个核心对象：
- user
- conversation
- folder
- message
- channel
- task
- task_run
- skill
- setting

其中 `conversation` 是主对象，其他对象围绕它扩展。

## 3. 对象定义

### 3.1 user

表示当前产品中的用户主体。

建议保留：
- `id`
- `display_name`
- `locale`
- `timezone`
- `created_at`
- `updated_at`

V1 说明：
- 第一版即使不做复杂账户体系，也建议保留 `user` 作为顶层归属对象
- 所有核心对象都默认归属于某个 `user`

### 3.2 folder

用于管理历史对话。

建议保留：
- `id`
- `user_id`
- `name`
- `sort_order`
- `is_default`
- `created_at`
- `updated_at`

V1 说明：
- 一个 `folder` 下可以包含多个 `conversation`
- V1 建议只支持单层文件夹，不做嵌套
- 默认存在一个逻辑上的“全部对话”视图，但不一定必须作为真实数据行存储

### 3.3 conversation

表示一次持续的对话上下文，是产品里的主工作单元。

建议保留：
- `id`
- `user_id`
- `folder_id`
- `title`
- `summary`
- `status`
- `source`
- `last_message_at`
- `created_at`
- `updated_at`

建议状态：
- `active`
- `archived`
- `deleted`

建议来源：
- `web`
- `channel`
- `task`

V1 说明：
- 一个 `conversation` 包含多条 `message`
- `folder_id` 在 V1 中建议为单值，也就是一个对话只属于一个文件夹
- 来自 `channel` 或 `task` 的结果，可以回流到已有 `conversation`，也可以新建 `conversation`

### 3.4 message

表示对话中的一条消息或一次结果回流记录。

建议保留：
- `id`
- `conversation_id`
- `role`
- `content`
- `content_type`
- `status`
- `channel_id`
- `task_run_id`
- `created_at`

建议角色：
- `user`
- `assistant`
- `system`
- `tool`

建议内容类型：
- `text`
- `image`
- `file`
- `mixed`

建议状态：
- `pending`
- `streaming`
- `completed`
- `failed`

V1 说明：
- `message` 是会话展示和执行结果展示的基础对象
- 如果一条消息来自远程通道，可关联 `channel_id`
- 如果一条消息来自任务执行结果回流，可关联 `task_run_id`

### 3.5 channel

表示一个远程对话通道。

建议保留：
- `id`
- `user_id`
- `type`
- `name`
- `status`
- `external_ref`
- `last_active_at`
- `created_at`
- `updated_at`

建议状态：
- `connected`
- `disconnected`
- `error`

V1 说明：
- 一个 `channel` 可以关联多个 `conversation`
- `external_ref` 用于保存第三方通道中的标识信息
- `channel` 是“连接对象”，而不是消息本身

### 3.6 task

表示一个定时提醒或自动执行任务。

建议保留：
- `id`
- `user_id`
- `name`
- `description`
- `status`
- `mode`
- `schedule_text`
- `next_run_at`
- `last_run_at`
- `target_conversation_id`
- `target_channel_id`
- `created_at`
- `updated_at`

建议状态：
- `active`
- `paused`
- `completed`
- `error`

建议模式：
- `reminder`
- `automation`

V1 说明：
- `reminder` 偏提醒
- `automation` 偏自动执行
- 一个 `task` 可以把结果回流到指定 `conversation`
- 一个 `task` 也可以把结果发送到指定 `channel`

### 3.7 task_run

表示某个任务的一次具体执行记录。

建议保留：
- `id`
- `task_id`
- `status`
- `started_at`
- `finished_at`
- `result_summary`
- `error_message`
- `created_conversation_id`
- `created_message_id`

建议状态：
- `queued`
- `running`
- `completed`
- `failed`
- `cancelled`

V1 说明：
- `task` 和 `task_run` 应分开
- `task` 表示规则本身
- `task_run` 表示历史执行记录

### 3.8 skill

表示一个可启用或查看的能力单元。

建议保留：
- `id`
- `name`
- `slug`
- `description`
- `status`
- `source`
- `scope`
- `created_at`
- `updated_at`

建议状态：
- `enabled`
- `disabled`

建议来源：
- `built_in`
- `installed`

建议范围：
- `global`
- `conversation`

V1 说明：
- V1 先只做基础查看和启用，不做复杂市场
- `scope` 用于保留未来按会话启用的空间，即使第一版未完全开放

### 3.9 setting

表示用户级低频配置。

建议保留：
- `id`
- `user_id`
- `permission_mode`
- `default_model`
- `default_reasoning_effort`
- `language`
- `created_at`
- `updated_at`

V1 说明：
- `setting` 建议按用户聚合，而不是拆成过多零散对象
- 只覆盖左下角设置页中的低频系统项

## 4. 关键关系

建议优先建立以下关系：

- 一个 `user` 拥有多个 `folder`
- 一个 `user` 拥有多个 `conversation`
- 一个 `folder` 包含多个 `conversation`
- 一个 `conversation` 包含多条 `message`
- 一个 `user` 拥有多个 `channel`
- 一个 `channel` 可关联多个 `conversation`
- 一个 `user` 拥有多个 `task`
- 一个 `task` 包含多条 `task_run`
- 一个 `task_run` 可回流到某个 `conversation` 和 `message`
- 一个 `user` 拥有多个 `skill`
- 一个 `user` 拥有一组 `setting`

## 5. 推荐的产品语义

为了减少后续命名混乱，建议尽早统一这些语义：

- `conversation` 是用户可见的会话单元
- `message` 是会话中的内容单元
- `channel` 是外部连接通道，不等于消息来源页面
- `task` 是规则，`task_run` 是一次执行
- `folder` 是历史管理对象，不承担权限或协作语义
- `skill` 是能力开关，不是插件市场商品
- `setting` 是低频配置集合，不是通用配置中心

## 6. V1 需要特别守住的约束

- 一个对话只放在一个文件夹里，先不要做多归属
- 文件夹先不要支持嵌套
- 模型选择属于 `setting` 和输入框层面的控制项，不进入 `conversation` 顶部结构
- `task` 必须有执行历史，也就是 `task_run`
- `channel` 和 `task` 的结果要尽量回流到 `conversation`，不要形成割裂的数据岛
- `skill` 第一版只做启用和查看，不引入复杂安装市场语义

## 7. 后续可以继续细化的部分

在这份草案基础上，下一步最适合继续补的是：
- 前端视角的数据视图模型
- 草拟 API 资源设计
- 本地存储或服务端存储边界
- 初版数据库表结构
