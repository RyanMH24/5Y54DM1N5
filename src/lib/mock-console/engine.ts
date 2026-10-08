import type {
  ConsoleActionResult,
  MockConsoleRecord,
  MockConsoleScenario,
  MockConsoleState,
} from "@/types/mock-console";

function buildInitialRecords(scenario: MockConsoleScenario): Record<string, MockConsoleRecord> {
  const records: Record<string, MockConsoleRecord> = {};
  for (const section of scenario.sections) {
    for (const record of section.records) {
      records[record.id] = { ...record, fields: { ...record.fields } };
    }
  }
  return records;
}

function applyAction(
  records: Record<string, MockConsoleRecord>,
  scenario: MockConsoleScenario,
  actionId: string,
): Record<string, MockConsoleRecord> {
  const action = scenario.actions.find((candidate) => candidate.id === actionId);
  if (!action) return records;

  const target = records[action.recordId];
  if (!target) return records;

  return {
    ...records,
    [action.recordId]: { ...target, fields: { ...target.fields, ...action.updates } },
  };
}

export function createScenarioState(
  scenario: MockConsoleScenario,
  currentTaskIndex: number,
): MockConsoleState {
  let records = buildInitialRecords(scenario);

  for (let i = 0; i < currentTaskIndex && i < scenario.tasks.length; i++) {
    records = applyAction(records, scenario, scenario.tasks[i].expectedActionId);
  }

  return {
    records,
    currentTaskIndex,
    completed: currentTaskIndex >= scenario.tasks.length,
  };
}

export function attemptConsoleAction(
  scenario: MockConsoleScenario,
  state: MockConsoleState,
  actionId: string,
): ConsoleActionResult {
  if (state.completed || state.currentTaskIndex >= scenario.tasks.length) {
    return { state, matched: false, feedback: "" };
  }

  const currentTask = scenario.tasks[state.currentTaskIndex];

  if (actionId !== currentTask.expectedActionId) {
    return { state, matched: false, feedback: currentTask.fallbackMessage };
  }

  const nextIndex = state.currentTaskIndex + 1;
  const newState: MockConsoleState = {
    records: applyAction(state.records, scenario, actionId),
    currentTaskIndex: nextIndex,
    completed: nextIndex >= scenario.tasks.length,
  };

  return { state: newState, matched: true, feedback: currentTask.successMessage };
}
