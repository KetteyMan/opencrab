# opencrab V1 前端工程初始化方案

## 1. 目标

这份文档用于定义 `opencrab` V1 Web 端的前端工程起步方案。

当前重点回答：
- 第一版前端建议使用什么技术栈
- 项目目录如何组织
- 模块边界怎么划分
- 先搭哪些基础能力，后做哪些页面

当前不展开：
- CI/CD 细节
- 部署平台细节
- 测试体系的完整规划
- 性能优化的高级策略

## 2. 选择原则

- 优先稳定和社区成熟度，不追新
- 优先适合快速搭建 ChatGPT 式 Web 产品的组合
- 优先支持中文产品、上传、流式消息和复杂列表页
- 优先让目录结构贴合我们当前文档里的页面与资源边界
- V1 不要过早引入太多工程层级和抽象

## 3. 建议技术栈

V1 建议采用：
- `Next.js`
- `React`
- `TypeScript`
- `Tailwind CSS`

补充建议：
- 路由直接使用 Next.js App Router
- 数据请求先使用浏览器 `fetch` + 自定义轻量封装
- 表单先用 React 原生状态，不急着引入重型表单库
- 图标先使用统一图标库或本地 SVG

## 4. 为什么先选这套

- `Next.js + React + TypeScript` 足够主流，后续开源参与门槛低
- App Router 能自然承接我们现在已经定义好的页面路由结构
- `Tailwind CSS` 适合快速把当前已确认的 UI 风格落地
- 这一套对聊天页、侧栏、设置页、列表页和详情页都比较顺手

V1 说明：
- 当前阶段不急着引入复杂状态库
- 也不急着引入重型数据缓存框架
- 等接口稳定后，再决定是否补充更强的数据层工具

## 5. 推荐目录结构

建议先采用单应用结构，不做 monorepo。

```text
opencrab/
  app/
    (app)/
      layout.tsx
      page.tsx
      conversations/
        page.tsx
        [conversationId]/
          page.tsx
      channels/
        page.tsx
        [channelId]/
          page.tsx
      tasks/
        page.tsx
        [taskId]/
          page.tsx
      skills/
        page.tsx
        [skillId]/
          page.tsx
      settings/
        page.tsx
    globals.css
    layout.tsx
  components/
    app-shell/
    sidebar/
    composer/
    conversation/
    channel/
    task/
    skill/
    settings/
    ui/
  lib/
    api/
    mappers/
    formatters/
    constants/
    utils/
  hooks/
  types/
  public/
  docs/
```

## 6. 目录职责

### 6.1 `app/`

用于页面路由和页面级布局。

建议职责：
- 放置顶层路由
- 组合页面所需数据
- 处理页面级 loading 和 empty state

### 6.2 `components/`

用于可复用组件。

建议按业务域拆分：
- `app-shell`：整体壳层
- `sidebar`：左侧栏
- `composer`：输入框
- `conversation`：会话内容和消息
- `channel`：Channel 页面相关组件
- `task`：任务页组件
- `skill`：Skills 页组件
- `settings`：设置页组件
- `ui`：纯基础组件

### 6.3 `lib/api/`

用于 API 请求封装。

建议职责：
- 统一请求入口
- 资源级请求方法
- 轻量错误处理

### 6.4 `lib/mappers/`

用于把 API 返回数据转换成前端视图模型。

建议职责：
- 实体到 view model 的映射
- 列表项字段裁剪
- 页面详情结构组装

这是当前文档链条里非常重要的一层，不建议省略。

### 6.5 `lib/formatters/`

用于格式化时间、文件大小、状态文案等。

### 6.6 `types/`

用于统一维护：
- API 类型
- 实体类型
- 视图模型类型

## 7. 推荐模块边界

V1 建议先按 4 层组织前端代码：

第一层：Route Layer
- 对应 `app/`
- 负责页面入口和路由参数

第二层：Feature Layer
- 对应 `components/conversation`、`components/task` 等
- 负责页面业务组件

第三层：View Model Layer
- 对应 `lib/mappers/`
- 负责把资源数据变成页面可消费结构

第四层：Resource Layer
- 对应 `lib/api/`
- 负责调用后端接口

V1 说明：
- 不建议让页面组件直接到处拼 API 返回值
- 也不建议过早引入更复杂的 clean architecture 分层

## 8. 首批需要先搭的基础能力

项目初始化后，建议优先完成这些基础能力：

- 全局布局和 App Shell
- 左侧栏导航
- 首页空态
- 对话输入框
- 基础设计变量和样式系统
- API 请求基础封装
- 视图模型 mapper 基础结构
- 通用空态、加载态、错误态组件

这些能力搭好后，再进入各业务页会更稳。

## 9. 页面开发顺序建议

建议按下面顺序推进：

1. 首页空态 `/`
2. 对话详情页 `/conversations/:conversationId`
3. 对话列表与文件夹
4. 设置页 `/settings`
5. 任务页 `/tasks` 与 `/tasks/:taskId`
6. Channels 页 `/channels` 与 `/channels/:channelId`
7. Skills 页 `/skills` 与 `/skills/:skillId`

这样安排的原因：
- 聊天主链路最重要
- 设置页和输入框控制项关系密切
- 任务、Channels、Skills 都依赖统一壳层和列表详情结构

## 10. 状态管理建议

V1 建议分两类处理状态：

服务端数据：
- 先通过页面级请求和轻量缓存处理
- 暂不强依赖复杂全局状态库

本地 UI 状态：
- 使用 React 状态管理
- 放在页面容器或局部组件中

适合保留为本地状态的内容：
- 输入框草稿
- 上传中列表
- 下拉展开状态
- 弹窗状态
- 临时筛选状态

## 11. 样式与设计系统建议

V1 建议保持轻量设计系统。

建议先建立：
- 颜色变量
- 字体层级
- 间距规范
- 圆角规范
- 阴影规范
- 基础按钮、输入框、列表项、空态组件

V1 说明：
- 当前 UI 方向已经相对明确
- 第一版不需要完整设计系统平台化
- 但至少要避免样式散落在页面里

## 12. 与当前文档链条的对应关系

这份工程初始化方案应与现有文档一一对应：

- [V1 产品规划](./v1-product-plan.md)：定义产品边界和页面方向
- [V1 核心对象与数据模型草案](./v1-core-objects-and-data-model.md)：定义实体对象
- [V1 前端视角的数据视图模型](./v1-frontend-view-models.md)：定义页面消费结构
- [V1 API 资源设计草案](./v1-api-resource-design.md)：定义接口资源边界
- [V1 初版路由结构](./v1-route-structure.md)：定义页面路由

前端工程应尽量沿着这条链路落地，而不是重新发明一套结构。

## 13. V1 需要守住的工程约束

- 先做单应用，不做 monorepo
- 不过早引入重型状态管理库
- 不过早引入过多通用抽象
- 页面组件不要直接耦合原始 API 返回结构
- 首页和对话页优先级最高
- 先把壳层和主链路做顺，再扩展任务、Channels、Skills

## 14. 后续可以继续细化的部分

在这份草案基础上，下一步最适合继续补的是：
- 初始化后的具体文件树
- 第一个里程碑的任务拆分
- 接口 mock 策略
- 前端测试最小方案
