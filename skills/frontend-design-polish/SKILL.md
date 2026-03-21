---
name: "frontend-design-polish"
description: "Use when the user asks to visually polish an existing web page or app UI, improve hierarchy, typography, spacing, color, rhythm, component states, or overall product feel; especially useful when code edits and browser validation are part of the task."
---

# Frontend Design Polish

Polish an existing interface into something clearer, more intentional, and more product-grade. This skill is for shipped UI surfaces, not blank-slate brand exploration.

## When to use
- Improve a page that feels plain, messy, generic, or low-fidelity
- Tighten hierarchy, spacing, typography, contrast, or CTA emphasis
- Refine a React/Next page so it feels more intentional without breaking the existing product language
- Make a dashboard, chat page, settings page, or landing section look more polished on desktop and mobile

## Workflow
1. Inspect the current UI before designing. Read the page/component code, token definitions, and shared layout patterns first.
2. Decide whether to preserve an existing design system or establish a stronger visual direction. Do not mix both modes accidentally.
3. Audit the interface using the checklist in `references/checklist.md`.
4. Pick a small number of high-leverage changes. Prefer the smallest set of edits that upgrades the whole page.
5. Make the code changes. Use meaningful CSS variables, stronger typography decisions, cleaner spacing rhythm, and clearer component emphasis.
6. Validate the result in a browser when practical. Check both desktop and mobile, then tune density and overflow.
7. Summarize the design direction and the concrete improvements that were made.

## Rules
- Respect existing product patterns unless the user is clearly asking for a new direction.
- Avoid AI-slop aesthetics: generic gradients, random glassmorphism, purple-on-white defaults, and decorative motion without purpose.
- Do not overuse `useMemo`/`useCallback` or unnecessary component churn when the task is visual polish.
- If the page already has a strong brand signal, amplify it instead of resetting it.
- If the UI is weak because of structure rather than color, fix structure first.

## OpenCrab guidance
- OpenCrab should feel chat-native, productized, and editorially intentional.
- Prioritize hierarchy, whitespace rhythm, compact but breathable density, and obvious primary actions.
- When adjusting styles, keep the result legible in long-running workspaces, not only in a hero shot.

## Reference map
- `references/checklist.md`: compact audit for hierarchy, spacing, typography, color, motion, and responsiveness.
- `references/opencrab-ui-notes.md`: OpenCrab-specific visual principles and recurring pitfalls.
