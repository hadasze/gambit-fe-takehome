# CLAUDE.md

This repo's architecture, conventions, testing approach, and git workflow are documented in [AGENTS.md](AGENTS.md) — read that first. This file only adds notes specific to working here as Claude Code.

## Commands

```bash
npm run dev      # dev server
npm run build    # tsc -b && vite build — the type-check gate
npm run lint     # oxlint
npm run test     # Vitest, CI mode — the five flow tests in src/App.test.tsx
```

Run `lint`, `build`, and `test` after any change before reporting a task complete — that's the full automated safety net for this repo (see AGENTS.md § Testing for what's covered and how to extend it).

## Guardrails for this repo specifically

- **Don't blur the `src/components` / `src/hooks` / `src/features` boundary.** If a change adds an import of `Resource` or `Application` (from `src/types/domain.ts`) into `src/components`, that's a sign the component belongs in `src/features` instead, or needs to be generalized further. This boundary is what keeps the component library reusable — see AGENTS.md's architecture table.
- **Don't add a new dependency** (state management, CSS framework, data fetching, a different test runner than Vitest) without checking with the user first — this app is deliberately minimal.
- **Don't touch `tsconfig*.json` or `vite.config.ts`** for a feature change; if a task seems to need it, that's worth flagging rather than doing silently.
- **Prefer `Edit` over rewriting files.** Most files in this repo are under 100 lines; targeted edits are almost always possible and preserve the existing style better than a full rewrite.
- **Match the existing comment density.** This codebase is intentionally comment-light — see AGENTS.md § Conventions. Don't add explanatory comments to new code beyond the one-or-two-line "why" style already used in `useResourceFilters`/`useSelection`/`Table`.

## Committing and PRs

Follow AGENTS.md § Git workflow for commit prefixes and branch naming. As with any repo: only commit when explicitly asked, create new commits rather than amending, and don't push or open a PR without confirming first.
