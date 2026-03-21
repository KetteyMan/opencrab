import { OpenCrabMark, OpenCrabWordmark } from "@/components/branding/opencrab-brand";
import { AppPage } from "@/components/ui/app-page";
import {
  OPENCRAB_ABOUT_HIGHLIGHTS,
  OPENCRAB_ABOUT_LINKS,
  OPENCRAB_ITERATION_HISTORY,
  OPENCRAB_PRODUCT_PRINCIPLES,
  OPENCRAB_RELEASE_VERSION,
  OPENCRAB_ROADMAP_PROGRESS,
} from "@/lib/opencrab/about";

export function AboutScreen() {
  return (
    <AppPage
      width="wide"
      className="bg-[radial-gradient(circle_at_top,_rgba(255,101,72,0.08),transparent_34%),linear-gradient(180deg,#fffdfb_0%,#ffffff_18%,#fbfbf8_100%)]"
      contentClassName="space-y-6"
    >
      <section className="relative overflow-hidden rounded-[32px] border border-line bg-[radial-gradient(circle_at_top_left,_rgba(255,101,72,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(30,47,93,0.08),transparent_30%),linear-gradient(135deg,#fff7f1_0%,#ffffff_52%,#f7f8fd_100%)] px-6 py-7 shadow-soft sm:px-8 sm:py-8">
        <div className="pointer-events-none absolute -right-16 top-0 h-44 w-44 rounded-full bg-[#ff8d76]/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-[-48px] h-40 w-40 rounded-full bg-[#1e2f5d]/10 blur-3xl" />

        <div className="relative grid gap-8 lg:grid-cols-[1.4fr_0.9fr] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-3 rounded-full border border-white/70 bg-white/80 px-3.5 py-2 text-[12px] font-medium tracking-[0.16em] text-[#1e2f5d] shadow-[0_10px_30px_rgba(30,47,93,0.08)] backdrop-blur">
              <OpenCrabMark className="h-5 w-5" />
              <span>关于我们</span>
            </div>

            <div className="mt-5 flex items-center gap-4">
              <OpenCrabMark className="h-14 w-14 sm:h-16 sm:w-16" />
              <div>
                <OpenCrabWordmark className="text-[34px] font-semibold tracking-[-0.06em] sm:text-[42px]" />
                <p className="mt-1 text-[14px] text-muted-strong sm:text-[15px]">
                  面向普通用户、本地优先、聊天优先的小螃蟹工作台
                </p>
              </div>
            </div>

            <p className="mt-6 max-w-[720px] text-[15px] leading-7 text-[#2c2c28] sm:text-[16px]">
              OpenCrab 希望把强大的智能执行能力，变成更轻松、更亲切、也更适合日常工作的产品界面。
              用户不需要先学一整套术语和工具链，就可以从一段对话开始，把任务、渠道、文件和技能逐步接到同一套工作空间里。
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <MetricPill label="当前版本" value={`v${OPENCRAB_RELEASE_VERSION}`} />
              <MetricPill label="产品方向" value="Local First" />
              <MetricPill label="主工作流" value="Chat First" />
              <MetricPill label="主要用户" value="普通用户" />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <HighlightCard
              title="统一工作空间"
              description="网页、Telegram、飞书与定时任务，逐步收拢到同一套对话上下文。"
            />
            <HighlightCard
              title="低门槛上手"
              description="默认把复杂配置藏在后面，把聊天、文件与动作放在前面。"
            />
            <HighlightCard
              title="稳步迭代"
              description="先把主链路做扎实，再继续扩展渠道、调度和协作能力。"
            />
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[28px] border border-line bg-surface p-6 shadow-soft sm:p-7">
          <SectionEyebrow label="我们是谁" />
          <h2 className="mt-3 text-[28px] font-semibold tracking-[-0.05em] text-text">
            介绍与产品气质
          </h2>
          <p className="mt-4 text-[14px] leading-7 text-muted-strong">
            我们把 OpenCrab 定位成一个更适合普通用户使用的智能工作台。
            它保留底层执行力，但产品表面尽量简单，让“提出问题、补充文件、持续迭代”成为一个自然流畅的过程。
          </p>

          <div className="mt-6 grid gap-3">
            {OPENCRAB_ABOUT_HIGHLIGHTS.map((item) => (
              <InfoListItem key={item}>{item}</InfoListItem>
            ))}
          </div>
        </section>

        <section className="rounded-[28px] border border-line bg-surface p-6 shadow-soft sm:p-7">
          <SectionEyebrow label="联系入口" />
          <h2 className="mt-3 text-[28px] font-semibold tracking-[-0.05em] text-text">
            官网与联系入口
          </h2>
          <div className="mt-6 grid gap-3">
            {OPENCRAB_ABOUT_LINKS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                className="group rounded-[22px] border border-line bg-[linear-gradient(180deg,#ffffff_0%,#fbfbf8_100%)] px-4 py-4 transition hover:-translate-y-[1px] hover:border-[#d9d9d1] hover:shadow-[0_16px_32px_rgba(15,15,15,0.06)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-muted">
                      {item.label}
                    </p>
                    <p className="mt-2 text-[16px] font-semibold tracking-[-0.03em] text-text">
                      {item.value}
                    </p>
                    <p className="mt-2 text-[13px] leading-6 text-muted-strong">
                      {item.description}
                    </p>
                  </div>
                  <span className="rounded-full border border-line bg-surface-muted p-2 text-muted-strong transition group-hover:border-[#ffcfbf] group-hover:bg-[#fff3ee] group-hover:text-[#c75237]">
                    <ArrowUpRightIcon />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        <section className="rounded-[28px] border border-line bg-surface p-6 shadow-soft sm:p-7">
          <SectionEyebrow label="产品原则" />
          <h2 className="mt-3 text-[28px] font-semibold tracking-[-0.05em] text-text">
            我们坚持的产品原则
          </h2>
          <div className="mt-6 grid gap-3">
            {OPENCRAB_PRODUCT_PRINCIPLES.map((item, index) => (
              <div
                key={item}
                className="rounded-[20px] border border-line bg-surface-muted/80 px-4 py-4"
              >
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-[#1e2f5d] px-2 text-[12px] font-semibold text-white">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="pt-0.5 text-[14px] leading-6 text-text">{item}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[28px] border border-line bg-surface p-6 shadow-soft sm:p-7">
          <SectionEyebrow label="迭代历史" />
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="mt-3 text-[28px] font-semibold tracking-[-0.05em] text-text">
                产品迭代历史
              </h2>
              <p className="mt-3 max-w-[560px] text-[14px] leading-7 text-muted-strong">
                这里的时间线按产品阶段整理，重点体现 OpenCrab 先做什么、为什么这样做，以及现在已经走到了哪里。
              </p>
            </div>
            <span className="hidden rounded-full border border-line bg-surface-muted px-4 py-2 text-[12px] text-muted-strong sm:inline-flex">
              从主链路开始，逐步向外扩展
            </span>
          </div>

          <div className="mt-6 grid gap-4">
            {OPENCRAB_ITERATION_HISTORY.map((item) => (
              <article
                key={item.title}
                className="rounded-[22px] border border-line bg-[linear-gradient(180deg,#ffffff_0%,#fcfcfa_100%)] px-4 py-4"
              >
                <div className="flex items-start gap-4">
                  <span className="inline-flex min-w-[76px] justify-center rounded-full border border-[#ffd6ca] bg-[#fff1eb] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#c75237]">
                    {item.stage}
                  </span>
                  <div>
                    <h3 className="text-[17px] font-semibold tracking-[-0.03em] text-text">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-[13px] leading-6 text-muted-strong">
                      {item.description}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>

      <section className="rounded-[28px] border border-line bg-surface p-6 shadow-soft sm:p-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <SectionEyebrow label="路线图" />
            <h2 className="mt-3 text-[28px] font-semibold tracking-[-0.05em] text-text">
              计划进度
            </h2>
            <p className="mt-3 max-w-[760px] text-[14px] leading-7 text-muted-strong">
              下面的进度条是基于当前仓库能力做的阶段性判断，用来帮助大家快速看清哪些部分已经比较完整，哪些部分还在继续打磨。
            </p>
          </div>
          <div className="rounded-[20px] border border-line bg-[linear-gradient(135deg,#fff8f4_0%,#ffffff_100%)] px-4 py-3 text-[12px] leading-6 text-muted-strong">
            当前策略：先把日常最常用的链路做稳，再向渠道、任务与协作能力扩展。
          </div>
        </div>

        <div className="mt-7 grid gap-4 lg:grid-cols-2">
          {OPENCRAB_ROADMAP_PROGRESS.map((item) => (
            <article
              key={item.title}
              className="rounded-[24px] border border-line bg-[linear-gradient(180deg,#ffffff_0%,#fbfbf7_100%)] p-5"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-[18px] font-semibold tracking-[-0.03em] text-text">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-[12px] font-medium uppercase tracking-[0.14em] text-muted">
                    {item.status}
                  </p>
                </div>
                <div className="rounded-full border border-[#d9e1fb] bg-[#f5f7ff] px-3 py-1.5 text-[13px] font-semibold text-[#3149b7]">
                  {item.progress}%
                </div>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#eceee8]">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,#ff6548_0%,#ff906d_55%,#1e2f5d_100%)]"
                  style={{ width: `${item.progress}%` }}
                />
              </div>

              <p className="mt-4 text-[13px] leading-6 text-muted-strong">{item.summary}</p>
              <div className="mt-4 rounded-[18px] border border-line bg-surface-muted/80 px-4 py-3">
                <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-muted">
                  下一步
                </p>
                <p className="mt-2 text-[13px] leading-6 text-text">{item.nextStep}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </AppPage>
  );
}

function SectionEyebrow({ label }: { label: string }) {
  return <p className="text-[12px] font-medium tracking-[0.08em] text-muted">{label}</p>;
}

function MetricPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-full border border-white/70 bg-white/82 px-4 py-2 shadow-[0_8px_24px_rgba(15,15,15,0.05)] backdrop-blur">
      <span className="text-[11px] font-medium tracking-[0.08em] text-muted">
        {label}
      </span>
      <span className="ml-2 text-[13px] font-semibold text-text">{value}</span>
    </div>
  );
}

function HighlightCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[24px] border border-white/75 bg-white/80 px-4 py-4 shadow-[0_14px_30px_rgba(15,15,15,0.05)] backdrop-blur">
      <p className="text-[16px] font-semibold tracking-[-0.03em] text-text">{title}</p>
      <p className="mt-2 text-[13px] leading-6 text-muted-strong">{description}</p>
    </div>
  );
}

function InfoListItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 rounded-[20px] border border-line bg-surface-muted/70 px-4 py-4">
      <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#fff1eb] text-[#c75237]">
        <CheckIcon />
      </span>
      <p className="text-[14px] leading-7 text-text">{children}</p>
    </div>
  );
}

function ArrowUpRightIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4 stroke-current" strokeWidth="1.8">
      <path d="M6 14 14 6M8 6h6v6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 stroke-current" strokeWidth="2">
      <path d="m4.5 10 3.2 3.2L15.5 6.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
