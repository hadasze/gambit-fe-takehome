import { useState } from "react";
import { resources } from "./data/resources";
import { useResourceFilters } from "./hooks/useResourceFilters";
import { useSelection } from "./hooks/useSelection";
import { useApplications } from "./hooks/useApplications";
import { FilterBar } from "./components/FilterBar";
import { ResourceTable } from "./components/ResourceTable";
import { SelectionActionBar } from "./components/SelectionActionBar";
import { CreateApplicationDialog } from "./components/CreateApplicationDialog";
import { ApplicationsList } from "./components/ApplicationsList";

export default function App() {
  const { filters, updateFilter, resetFilters, filteredResources } = useResourceFilters(resources);
  const { selectedIds, toggle, toggleAll, clear } = useSelection();
  const { applications, createApplication } = useApplications();

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [expandedAppId, setExpandedAppId] = useState<string | null>(null);

  const selectedResources = resources.filter((resource) => selectedIds.has(resource.id));

  const handleCreateApplication = (name: string, description: string) => {
    const application = createApplication({
      name,
      description,
      resourceIds: Array.from(selectedIds),
    });
    clear();
    setDialogOpen(false);
    setExpandedAppId(application.id);
  };

  return (
    <div className="app">
      <header className="app__header">
        <h1>Gambit Resource Explorer</h1>
        <p>Browse cloud resources and group them into Applications.</p>
      </header>

      <main className="app__layout">
        <section className="app__resources">
          <FilterBar
            filters={filters}
            onChange={updateFilter}
            onReset={resetFilters}
            resultCount={filteredResources.length}
          />
          <ResourceTable
            resources={filteredResources}
            selectedIds={selectedIds}
            onToggle={toggle}
            onToggleAll={toggleAll}
          />
        </section>

        <aside className="app__applications">
          <h2>Applications</h2>
          <ApplicationsList
            applications={applications}
            resources={resources}
            expandedId={expandedAppId}
            onToggleExpand={(id) => setExpandedAppId((current) => (current === id ? null : id))}
          />
        </aside>
      </main>

      {selectedIds.size > 0 && (
        <SelectionActionBar
          selectedCount={selectedIds.size}
          onCreateClick={() => setDialogOpen(true)}
          onClear={clear}
        />
      )}

      {isDialogOpen && (
        <CreateApplicationDialog
          selectedResources={selectedResources}
          onCreate={handleCreateApplication}
          onClose={() => setDialogOpen(false)}
        />
      )}
    </div>
  );
}
