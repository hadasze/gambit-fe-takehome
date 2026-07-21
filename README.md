# Gambit Resource Explorer

A small internal tool for browsing cloud resources (AWS / GCP / Azure) and grouping them into **Applications** — logical bundles of resources you can visualize, monitor, and reason about as a unit, instead of scrolling through a flat inventory.

## Getting started

```bash
npm install
npm run dev        # start the dev server (Vite, with HMR)
npm run build      # type-check (tsc -b) and produce a production build
npm run preview    # serve the production build locally
npm run lint       # oxlint
npm run test       # run the test suite once (Vitest + React Testing Library)
npm run test:watch # re-run tests on file change
```

No environment variables, no backend, no database — everything runs client-side against an in-memory, hand-authored dataset (`src/data/resources.ts`). Refreshing the page resets any Applications you've created.

## What you can do

**Browse & filter resources**
A table of cloud resources (name, type, provider, region, environment, criticality, open issues). Search by name, and narrow down by provider, environment, or criticality — filters combine (AND), and the result count updates live.

**Select & group into an Application**
Check off rows in the table and a floating action bar appears. "Create Application" opens a dialog where you name the group and optionally describe it — that's it, no resource-type restrictions, group whatever you want.

**Applications dashboard**
Every Application you create shows up as a card: resource count, a criticality breakdown (e.g. "2 critical, 1 high"), your description, and a graph. Search narrows the dashboard down by application name. Delete a card when you're done with it.

**Dependency graph**
Each Application renders as a hub-and-spoke graph — the application in the center, its resources as spokes, colored by criticality. Layout is force-simulated so nodes never overlap regardless of how many resources you grouped; it pans, zooms, and shows a minimap once a graph gets big enough to need one.

## How it's built

The app is intentionally split into three layers so the UI stays reusable and the logic stays testable:

- **`src/components/`** — a small generic UI library (`Table`, `Filters`, `Dialog`, `Badge`, `List`, `ActionBar`, `Graph`). None of it knows what a "Resource" or "Application" is — `Table` takes column definitions and rows, `Graph` takes nodes and a center label. That's deliberate: this library is meant to be lifted into other internal tools, not just this one, so it needs to stay domain-agnostic and gets maintained as its own thing, not as an afterthought of one feature.
- **`src/hooks/`** — all state and business logic lives here (`useResourceFilters`, `useSelection`, `useApplications`). Components render; hooks decide. This is what makes the components testable without a DOM and swappable without touching logic.
- **`src/features/`** — where the two meet: feature-specific screens (`ResourcesPanel`, `ApplicationsDashboard`, `CreateApplicationForm`) compose library components with hooks and domain types (`src/types/domain.ts`).

See [AGENTS.md](AGENTS.md) for the full technical conventions if you're extending this.

## What's next

The current dataset and interactions cover the core loop, but there's an obvious backlog if this went further:

- **Search by more keys** — currently search only matches resource name; tags, owner, and region are displayed but not searchable.
- **Sortable & configurable columns** — `Table` already takes a column config, so column sort and show/hide are a natural extension without changing its API.
- **Pagination or virtualization** — fine at a few dozen rows, would need it before a few thousand.
- **Persistence** — Applications live in memory only; localStorage or a real backend would survive a refresh.
- **Editing Applications** — rename, add/remove resources, or delete a single resource from a group after creation.
- **Undo** — especially for delete, which is currently immediate and irreversible.
- **Saved filter presets** — useful once there are more filterable fields.
- **Graph interactions** — clicking a node to jump to that resource's row in the table.
- **Accessibility pass** — the table and dialog already use proper `aria-label`s and escape-to-close, but full keyboard navigation through the graph and table hasn't been audited.
