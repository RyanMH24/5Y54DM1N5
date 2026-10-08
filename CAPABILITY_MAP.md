# Capability Map: Sysadmin Training Catalog

Approved 2026-10-07.

| Module id | Responsibility | Depends on |
|---|---|---|
| platform-shell | App scaffold, curriculum data model, lesson renderer, quiz engine, local-storage progress tracking | — |
| glossary | Key terms/acronyms sysadmins hear on the job (SSO, MDM, SLA, escalation, ticket queue, AD, GPO, endpoint, etc.) — searchable reference, cross-linked from lessons | platform-shell |
| terminal-lab-engine | Reusable simulated CLI component (fake terminal, pattern-matches commands/output) used by Linux/PowerShell labs | platform-shell |
| mock-console-engine | Reusable mock SaaS console framework (fake Okta/Jamf/ServiceNow UIs with task-checking) used by identity & ITSM labs | platform-shell |
| core-fundamentals | Lessons + quizzes: networking basics, OS fundamentals, hardware/troubleshooting, terminology | platform-shell, glossary |
| linux-powershell | Lessons + hands-on labs: CLI fundamentals & scripting in Linux and PowerShell | platform-shell, glossary, terminal-lab-engine |
| identity-device-mgmt | Lessons + guided labs: Okta (SSO/identity), Jamf (Apple MDM), AD/Entra ID basics | platform-shell, glossary, mock-console-engine |
| itsm-ticketing | Lessons + guided labs: ServiceNow-style ticket queue workflow (intake, triage, escalation, closing) | platform-shell, glossary, mock-console-engine |
| curriculum-sequencing | Ties all content modules into a 1-2 month ordered learning path with unlocking/progress view | core-fundamentals, linux-powershell, identity-device-mgmt, itsm-ticketing |

Build order: platform-shell → glossary, terminal-lab-engine, mock-console-engine → core-fundamentals, linux-powershell, identity-device-mgmt, itsm-ticketing → curriculum-sequencing

## Decisions carried into every module spec

- Labs are simulated, not real sandboxes: fake terminal (pattern-matched commands/output) for Linux/PowerShell; mock SaaS consoles for Okta/Jamf/ServiceNow. No real external accounts or containers.
- No user accounts yet. Progress lives in browser localStorage until accounts are built later.
- UI/visual design is explicitly deferred — specs focus on data, content, and logic, not styling.
