import { useState } from "react";
import type { Application } from "../types/domain";

export interface CreateApplicationInput {
  name: string;
  description?: string;
  resourceIds: string[];
}

function createId(): string {
  return `app-${Date.now()}-${Math.round(Math.random() * 1000)}`;
}

// Owns the in-memory list of Applications created by the user (no backend).
export function useApplications() {
  const [applications, setApplications] = useState<Application[]>([]);

  const createApplication = (input: CreateApplicationInput) => {
    const application: Application = {
      id: createId(),
      name: input.name.trim(),
      description: input.description?.trim() || undefined,
      resourceIds: input.resourceIds,
    };
    setApplications((current) => [...current, application]);
    return application;
  };

  return { applications, createApplication };
}
