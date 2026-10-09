import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CheatSheetList } from "@/components/CheatSheetList";
import type { CheatSheetCategoryGroup } from "@/lib/cheat-sheet/load";

const groups: CheatSheetCategoryGroup[] = [
  {
    category: "Processes & Services",
    commands: [
      {
        id: "linux-ps",
        shell: "linux",
        category: "Processes & Services",
        command: "ps aux",
        description: "List every running process.",
        example: "ps aux | grep nginx",
      },
    ],
  },
];

describe("CheatSheetList", () => {
  it("renders a category heading and the commands within it", () => {
    render(<CheatSheetList groups={groups} />);
    expect(screen.getByText("Processes & Services")).toBeInTheDocument();
    expect(screen.getByText("ps aux")).toBeInTheDocument();
    expect(screen.getByText("List every running process.")).toBeInTheDocument();
  });

  it("renders the example when present", () => {
    render(<CheatSheetList groups={groups} />);
    expect(screen.getByText("ps aux | grep nginx")).toBeInTheDocument();
  });

  it("omits the example block when absent", () => {
    const withoutExample: CheatSheetCategoryGroup[] = [
      {
        category: "Shell Basics",
        commands: [
          {
            id: "linux-man",
            shell: "linux",
            category: "Shell Basics",
            command: "man",
            description: "Open the manual page for a command.",
          },
        ],
      },
    ];
    const { container } = render(<CheatSheetList groups={withoutExample} />);
    expect(container.querySelector("pre")).not.toBeInTheDocument();
  });

  it("renders an empty-state message for an empty list", () => {
    render(<CheatSheetList groups={[]} />);
    expect(screen.getByText(/no commands match/i)).toBeInTheDocument();
  });
});
