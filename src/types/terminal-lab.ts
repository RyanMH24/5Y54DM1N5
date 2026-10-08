export interface TerminalCommandMatch {
  pattern: string | RegExp;
  output: string;
}

export interface TerminalLabStep {
  id: string;
  instructions: string;
  matches: TerminalCommandMatch[];
  fallbackOutput: string;
}

export interface TerminalLab {
  id: string;
  title: string;
  steps: TerminalLabStep[];
}

export interface TerminalLabProgress {
  labId: string;
  currentStepIndex: number;
  completed: boolean;
  updatedAt: string;
}
