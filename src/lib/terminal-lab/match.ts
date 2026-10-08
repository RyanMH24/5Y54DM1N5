import type { TerminalLabStep } from "@/types/terminal-lab";

export interface MatchResult {
  matched: boolean;
  output: string;
}

function normalize(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function patternMatches(pattern: string | RegExp, command: string): boolean {
  if (typeof pattern === "string") {
    return normalize(pattern) === normalize(command);
  }
  return pattern.test(command);
}

export function matchCommand(step: TerminalLabStep, command: string): MatchResult {
  const match = step.matches.find((candidate) => patternMatches(candidate.pattern, command));
  if (match) {
    return { matched: true, output: match.output };
  }
  return { matched: false, output: step.fallbackOutput };
}
