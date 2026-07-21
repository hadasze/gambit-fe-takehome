import { useEffect, useState } from "react";
import type { Resource } from "../types/domain";

interface CreateApplicationDialogProps {
  selectedResources: Resource[];
  onCreate: (name: string, description: string) => void;
  onClose: () => void;
}

export function CreateApplicationDialog({
  selectedResources,
  onCreate,
  onClose,
}: CreateApplicationDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;
    onCreate(name, description);
  };

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <form
        className="dialog"
        onClick={(event) => event.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <h2>New Application</h2>
        <p className="dialog__subtitle">
          Grouping {selectedResources.length} resource{selectedResources.length === 1 ? "" : "s"}
        </p>

        <ul className="dialog__resource-list">
          {selectedResources.map((resource) => (
            <li key={resource.id}>{resource.name}</li>
          ))}
        </ul>

        <label className="dialog__field">
          Name
          <input
            autoFocus
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Payments API"
            required
          />
        </label>

        <label className="dialog__field">
          Description (optional)
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="What is this application for?"
            rows={2}
          />
        </label>

        <div className="dialog__actions">
          <button type="button" className="button button--ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="button button--primary" disabled={!name.trim()}>
            Create Application
          </button>
        </div>
      </form>
    </div>
  );
}
