import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

// These cover the app's five main user flows end-to-end, against the real
// seeded dataset (src/data/resources.ts) — no mocking. They're written
// against roles/labels a user (or screen reader) would actually rely on,
// mirroring the aria-labels already in Table/Dialog.

function getResourceCheckbox(name: string) {
  return screen.getByRole("checkbox", { name: `Select ${name}` });
}

async function createApplication(user: ReturnType<typeof userEvent.setup>, appName: string, resourceNames: string[]) {
  for (const name of resourceNames) {
    await user.click(getResourceCheckbox(name));
  }

  await user.click(screen.getByRole("button", { name: "Create Application" }));

  const dialog = screen.getByRole("heading", { name: "New Application" }).closest(".dialog") as HTMLElement;
  await user.type(within(dialog).getByLabelText("Name"), appName);
  await user.click(within(dialog).getByRole("button", { name: "Create Application" }));
}

describe("Gambit Resource Explorer - main flows", () => {
  it("searches the resources table by name", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByText("payments-api-prod")).toBeInTheDocument();
    expect(screen.getByText("auth-service")).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText("Search by name…"), "payments");

    expect(screen.getByText("3 results")).toBeInTheDocument();
    expect(screen.getByText("payments-api-prod")).toBeInTheDocument();
    expect(screen.queryByText("auth-service")).not.toBeInTheDocument();
  });

  it("combines a dropdown filter with search, and Reset clears both", async () => {
    const user = userEvent.setup();
    render(<App />);

    const [providerSelect] = screen.getAllByRole("combobox");
    await user.selectOptions(providerSelect, "GCP");
    expect(screen.getByText("3 results")).toBeInTheDocument();
    expect(screen.queryByText("payments-api-prod")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Reset" }));

    expect(screen.getByText("12 results")).toBeInTheDocument();
    expect(screen.getByText("payments-api-prod")).toBeInTheDocument();
  });

  it("selects resources and groups them into an Application", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(getResourceCheckbox("payments-api-prod"));
    await user.click(getResourceCheckbox("payments-db-primary"));
    expect(screen.getByText("2 resources selected")).toBeInTheDocument();

    await createApplication(user, "Payments Core", []);

    expect(screen.getByRole("heading", { name: "Payments Core" })).toBeInTheDocument();
    expect(screen.getByText("2 resources")).toBeInTheDocument();
    expect(screen.getByText("2 Critical")).toBeInTheDocument();

    // Selection and dialog are cleared after a successful create.
    expect(screen.queryByText(/selected/)).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "New Application" })).not.toBeInTheDocument();
  });

  it("deletes an Application and restores the empty state", async () => {
    const user = userEvent.setup();
    render(<App />);

    await createApplication(user, "Payments Core", ["payments-api-prod"]);
    expect(screen.getByRole("heading", { name: "Payments Core" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Delete Payments Core" }));

    expect(screen.queryByRole("heading", { name: "Payments Core" })).not.toBeInTheDocument();
    expect(screen.getByText(/No applications yet/)).toBeInTheDocument();
  });

  it("filters the Applications dashboard by name", async () => {
    const user = userEvent.setup();
    render(<App />);

    await createApplication(user, "Payments Core", ["payments-api-prod"]);
    await createApplication(user, "Auth Stack", ["auth-service"]);

    await user.type(screen.getByPlaceholderText("Filter applications by name…"), "payments");

    expect(screen.getByRole("heading", { name: "Payments Core" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Auth Stack" })).not.toBeInTheDocument();

    await user.clear(screen.getByPlaceholderText("Filter applications by name…"));
    await user.type(screen.getByPlaceholderText("Filter applications by name…"), "nothing-matches");

    expect(screen.getByText("No applications match “nothing-matches”.")).toBeInTheDocument();
  });
});
