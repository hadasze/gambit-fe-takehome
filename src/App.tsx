import { useState } from "react";
import { resources } from "./data/resources";
import { useSelection } from "./hooks/useSelection";
import { useApplications } from "./hooks/useApplications";
import { ActionBar, Dialog } from "./components";
import { ResourcesPanel } from "./features/resources/ResourcesPanel";
import { ApplicationsDashboard } from "./features/applications/ApplicationsDashboard";
import { CreateApplicationForm } from "./features/applications/CreateApplicationForm";

export default function App() {
  const { selectedIds, toggle, toggleAll, clear } = useSelection();
  const { applications, createApplication, deleteApplication } = useApplications();

  const [isDialogOpen, setDialogOpen] = useState(false);

  const selectedResources = resources.filter((resource) => selectedIds.has(resource.id));

  const handleCreateApplication = (name: string, description: string) => {
    createApplication({
      name,
      description,
      resourceIds: Array.from(selectedIds),
    });
    clear();
    setDialogOpen(false);
  };

  return (
    <div className="app">
      <header className="app__header">
        <h1>Gambit Resource Explorer</h1>
        <p>Browse cloud resources and group them into Applications.</p>
      </header>

      <main className="app__layout">
        <ResourcesPanel
          resources={resources}
          selectedIds={selectedIds}
          onToggleRow={toggle}
          onToggleAll={toggleAll}
        />
        <ApplicationsDashboard applications={applications} resources={resources} onDelete={deleteApplication} />
      </main>

      {selectedIds.size > 0 && (
        <ActionBar
          message={`${selectedIds.size} resource${selectedIds.size === 1 ? "" : "s"} selected`}
          primaryLabel="Create Application"
          onPrimary={() => setDialogOpen(true)}
          secondaryLabel="Clear"
          onSecondary={clear}
        />
      )}

      {isDialogOpen && (
        <Dialog
          title="New Application"
          subtitle={`Grouping ${selectedResources.length} resource${selectedResources.length === 1 ? "" : "s"}`}
          onClose={() => setDialogOpen(false)}
        >
          <CreateApplicationForm
            selectedResources={selectedResources}
            onCreate={handleCreateApplication}
            onCancel={() => setDialogOpen(false)}
          />
        </Dialog>
      )}
    </div>
  );
}
