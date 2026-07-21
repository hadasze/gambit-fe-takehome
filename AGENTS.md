# AGENTS.md

Technical reference for anyone — human or AI agent — making changes to this repo. `README.md` covers what the app does and why; this file covers how the code is organized and the conventions to keep it that way.

## Stack

React 19 + TypeScript + Vite. No router, no state management library, no CSS framework, no backend — kept intentionally light for a small app. Linting via `oxlint`, testing via Vitest + React Testing Library (see [Testing](#testing)).

```bash
npm install
npm run dev        # dev server
npm run build      # tsc -b && vite build — this is the type-check step, run it before every PR
npm run lint       # oxlint
npm run test       # run the test suite once (CI mode)
npm run test:watch # Vitest in watch mode, re-runs on file change
npm run preview    # serve the production build
```

## Architecture

Three layers, each with one job. New code should slot into exactly one of them:

| Layer | Path | Owns | Knows about domain types? |
|---|---|---|---|
| UI library | `src/components/` | Generic, reusable presentational components | No |
| Hooks | `src/hooks/` | All state and business logic | Only where the hook is inherently domain-specific (e.g. `useApplications`) |
| Features | `src/features/` | Composition of library + hooks for a specific screen | Yes |

Rules that follow from this:

- **`src/components/*` must stay generic.** They take data via props/generics (`Table<T>`, `Column<T>`, `List<T>`), never import `Resource` or `Application` from `src/types`. If a component needs to know about a domain type, it belongs in `src/features`, not `src/components`. New components get exported from `src/components/index.ts`.
- **Logic lives in hooks, not in components.** A component's job is to render and forward events; a hook's job is to hold state and decide what happens. `useResourceFilters` is the reference example — it owns filter state, derives the filtered list with `useMemo`, and exposes `updateFilter`/`resetFilters` rather than exposing `setFilters` raw.
- **Hooks return an object of state + actions**, not raw setters, so the calling component reads like a small API rather than reimplementing state transitions.
- **Features are composition, not new logic.** `ResourcesPanel` wires `useResourceFilters` to `Filters` and `Table`; it shouldn't contain filtering logic itself.

## Conventions

- **Naming**: PascalCase for components (one per file, filename matches export), camelCase hooks prefixed with `use`, domain types in `src/types/domain.ts`.
- **Styling**: single `src/index.css`, BEM-ish `block__element--modifier` classes (e.g. `app-card__header`, `button--primary`, `filters__reset`). Match this pattern for new UI rather than introducing inline styles or a CSS-in-JS approach.
- **Comments**: default to none. Only add one where the *why* isn't obvious from the code — a constraint, a workaround, a non-obvious design choice (see the header comments on `useResourceFilters`, `useSelection`, `Table` for the intended level: one or two lines, never a block explaining what the code visibly does).
- **TypeScript**: `noUnusedLocals`/`noUnusedParameters` are enforced by `tsconfig.app.json` — `npm run build` will fail on these, treat it as a lint step, not just a build step.
- **No new dependencies** (state libraries, CSS frameworks, data-fetching libraries) without a reason tied to an actual requirement — this app has stayed framework-light on purpose.

## Testing

**Stack**: Vitest (shares Vite's config, no separate bundler setup) + React Testing Library + `@testing-library/user-event`, running in jsdom. Config lives in the `test` block of `vite.config.ts`; global setup (jest-dom matchers, RTL auto-cleanup, a `ResizeObserver` stub that `@xyflow/react`'s `Graph` needs under jsdom) is in `src/test/setup.ts`.

**Running tests**:

```bash
npm run test        # CI mode — run once and exit
npm run test:watch  # watch mode while developing
```

**What's covered today**: `src/App.test.tsx` holds five end-to-end flow tests, rendering the real `App` against the real seeded dataset (`src/data/resources.ts`) with no mocking — driving the UI the way a user actually would, via `@testing-library/user-event`:

1. Searching the resources table by name narrows the rows.
2. A provider/environment/criticality dropdown filter combines with search, and Reset clears both.
3. Selecting resources and submitting the "Create Application" dialog adds a card to the dashboard with the right resource count and criticality badge.
4. Deleting an Application removes its card and restores the empty state.
5. Searching the Applications dashboard filters cards by name, including the no-match message.

**"Write tests for the main scenario"** means covering the happy path plus the one or two edge cases that would actually break in review (e.g. the no-match empty state, not every possible query string) — not exhaustive permutations. Use `App.test.tsx` as the template: query by role/label, not test ids — `Table` and `Dialog` already expose proper `aria-label`s (e.g. `Select ${rowLabel}`, `Delete ${application.name}`) specifically so tests (and screen readers) can rely on them.

As logic grows, it's reasonable to add hook-level unit tests alongside the flow tests for anything with branching that a flow test won't naturally exercise — e.g. `useSelection`'s "some selected → select all" vs "all selected → deselect all" branch in `toggleAll`, or `useApplications` trimming name/description on create.

## Git workflow

Commit history so far follows conventional-commit-style prefixes — keep using them:

```
feat: ...       new capability
fix: ...        bug fix
refactor: ...   no behavior change
style: ...      visual/CSS only
test: ...       tests only
docs: ...       docs only
chore: ...      tooling/deps
```

One logical change per commit. Branch naming: `<type>/<short-description>` (e.g. `feat/sortable-columns`).

Before opening a PR:

1. `npm run lint` and `npm run build` both pass.
2. `npm run test` passes, and tests were added/updated for the scenario you touched.
3. The PR description says what changed and why (not just what — that's what the diff is for), and includes a screenshot/gif for anything visual.
4. Keep PRs scoped to one feature or fix — this repo is small enough that a "few things at once" PR is avoidable.

## Extending the app: example

Adding a new filterable field (say, `tags`) touches exactly these places, which is the intended shape for any similar extension:

1. `ResourceFilters` in `src/hooks/useResourceFilters.ts` — add the field and extend `matchesFilters`.
2. `src/data/filterOptions.ts` — add the option list if it's a fixed enum.
3. `ResourcesPanel` — add a `FilterSelectConfig` entry and a `case` in `handleSelectChange`.

Nothing in `src/components/Filters.tsx` or `Table.tsx` needs to change — that's the point of keeping them generic.

## Definition of done

- [ ] New reusable UI stays domain-agnostic in `src/components` (not leaking `Resource`/`Application` into it)
- [ ] New logic lives in a hook, not inline in a component
- [ ] `src/types/domain.ts` updated if the domain model changed
- [ ] `npm run lint`, `npm run build`, and `npm run test` all pass
- [ ] Tests added/updated for the main scenario
- [ ] Commit messages follow the `type: description` convention
