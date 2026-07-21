import { useMemo, useState } from "react";
import { Filters } from "../../components";
import type { Application, Resource } from "../../types/domain";
import { ApplicationCard } from "./ApplicationCard";

interface ApplicationsDashboardProps {
  applications: Application[];
  resources: Resource[];
  onDelete: (id: string) => void;
}

// A monitoring-style dashboard: search to narrow down to a few applications,
// or leave it empty to see them all at once, each as its own card with a
// resource graph and a criticality rollup.
export function ApplicationsDashboard({ applications, resources, onDelete }: ApplicationsDashboardProps) {
  const [query, setQuery] = useState("");

  const visibleApplications = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return applications.filter((application) => application.name.toLowerCase().includes(normalized));
  }, [applications, query]);

  return (
    <section className="app__applications">
      <h2>Applications</h2>

      {applications.length > 0 && (
        <Filters
          searchValue={query}
          onSearchChange={setQuery}
          searchPlaceholder="Filter applications by name…"
          selects={[]}
          onSelectChange={() => {}}
          onReset={() => setQuery("")}
          resultCount={visibleApplications.length}
        />
      )}

      {applications.length === 0 ? (
        <p className="applications-dashboard__empty">
          No applications yet. Select resources in the table above and group them into one.
        </p>
      ) : visibleApplications.length === 0 ? (
        <p className="applications-dashboard__empty">No applications match “{query}”.</p>
      ) : (
        <div className="applications-dashboard__grid">
          {visibleApplications.map((application) => (
            <ApplicationCard key={application.id} application={application} resources={resources} onDelete={onDelete} />
          ))}
        </div>
      )}
    </section>
  );
}
