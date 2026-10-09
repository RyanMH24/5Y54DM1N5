# 5Y54DM1N5 — SysAdmin Academy

A self-paced training platform that takes someone from zero to job-ready IT/systems administrator over a six-week path. It pairs short lessons and quizzes with **simulated hands-on practice**: a fake terminal for Linux and PowerShell, and mock admin consoles styled after the tools sysadmins use every day (Okta, Jamf, Active Directory, ServiceNow).

No real servers, cloud accounts, or VMs needed — everything runs in the browser.

## Features

- **Six-week curriculum** — modules unlock in order, with a progress dashboard and progress ring showing where you are.
- **18 lessons with quizzes** — written in MDX, each followed by a graded multiple-choice quiz.
- **Terminal labs** — a simulated Linux and PowerShell shell that checks your commands step by step (accepts common aliases and formatting variations).
- **Mock admin consoles** — scenario-based tasks in simulated identity, device management, Active Directory, security, cloud/backup, and ticketing consoles.
- **Glossary** — searchable reference of the acronyms and jargon you hear on the job (SSO, MDM, GPO, SLA, …).
- **Command cheat sheet** — searchable, tabbed Linux and PowerShell command reference.
- **Saved progress** — stored in the browser, no account required. Visit `/demo` to reset.

## Curriculum

| Week | Module | Topics |
|---|---|---|
| 1 | Core Fundamentals | Networking, OS fundamentals, hardware troubleshooting, sysadmin terminology |
| 2 | Linux | CLI basics, users & permissions, package management, terminal lab, console scenario |
| 3 | PowerShell | PowerShell basics, scripting, managing AD users with PowerShell, terminal lab, AD console scenario |
| 4 | Identity & Device Management | Identity/SSO, Apple MDM |
| 5 | Security Fundamentals | Access control, endpoint security, phishing & social engineering |
| 6 | Cloud, Backup & ITSM | Cloud & virtualization, backup & disaster recovery, ticket lifecycle |

## Tech stack

- **Next.js 16** (App Router, Turbopack) + **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **MDX** lesson content (`next-mdx-remote`, `gray-matter`)
- **Vitest** + **React Testing Library** — 228 tests covering the quiz grader, lab/console engines, progress tracking, and pages

## Getting started

Requires Node.js 20+.

```bash
npm install
npm run dev       # http://localhost:3000
```

Other scripts:

```bash
npm test          # run the test suite
npm run typecheck # TypeScript check
npm run lint      # ESLint
npm run build     # production build
```

## Project structure

```
src/
  app/          routes: lessons, labs, consoles, glossary, cheat-sheet, demo
  components/   UI: Terminal, MockConsole, Quiz, CurriculumPath, ...
  content/      lessons (MDX), quizzes, labs, console scenarios, glossary, cheat sheet
  lib/          engines: quiz grading, command matching, console tasks, progress storage
  types/        shared TypeScript types
tests/          unit and component tests
SPEC-*.md       per-module design specs
```

## How it was built

Each module was designed spec-first: a written spec (`SPEC-*.md`), an implementation plan and to-do list (`tasks/`), then test-driven implementation. `CAPABILITY_MAP.md` shows how the modules fit together and the order they were built in.

## Roadmap

- User accounts with server-side progress
- Visual design pass
- More labs and console scenarios
