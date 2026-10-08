export interface MockConsoleRecord {
  id: string;
  title: string;
  fields: Record<string, string>;
}

export interface MockConsoleSection {
  id: string;
  label: string;
  records: MockConsoleRecord[];
}

export interface MockConsoleAction {
  id: string;
  label: string;
  sectionId: string;
  recordId: string;
  updates: Record<string, string>;
}

export interface MockConsoleTask {
  id: string;
  instructions: string;
  expectedActionId: string;
  successMessage: string;
  fallbackMessage: string;
}

export interface MockConsoleScenario {
  id: string;
  title: string;
  productName: string;
  sections: MockConsoleSection[];
  actions: MockConsoleAction[];
  tasks: MockConsoleTask[];
}

export interface MockConsoleProgress {
  scenarioId: string;
  currentTaskIndex: number;
  completed: boolean;
  updatedAt: string;
}

export interface MockConsoleState {
  records: Record<string, MockConsoleRecord>;
  currentTaskIndex: number;
  completed: boolean;
}

export interface ConsoleActionResult {
  state: MockConsoleState;
  matched: boolean;
  feedback: string;
}
