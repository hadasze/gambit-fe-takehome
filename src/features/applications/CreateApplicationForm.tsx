import { useState, type FormEvent } from "react";
import type { Resource } from "../../types/domain";

interface CreateApplicationFormProps {
  selectedResources: Resource[];
  onCreate: (name: string, description: string) => void;
  onCancel: () => void;
}

export function CreateApplicationForm({ selectedResources, onCreate, onCancel }: CreateApplicationFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;
    onCreate(name, description);
  };

  return (
    <form onSubmit={handleSubmit}>
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
        <button type="button" className="button button--ghost" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="button button--primary" disabled={!name.trim()}>
          Create Application
        </button>
      </div>
    </form>
  );
}
