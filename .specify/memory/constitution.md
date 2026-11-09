<!--
Sync Impact Report
- Version change: 1.1.0 -> 1.2.0
- Modified principles: I. Student-Centered Design (clarified usability); II. Code Quality -> Clean, Maintainable, and Reusable Code; III. Accessibility and Responsiveness -> Responsive Design and Accessibility; IV. Security and Privacy -> Secure Authentication and Student Data Protection; V. Team Collaboration and VI. Testing and Quality Assurance (clarified requirements)
- Added principles: VII. MVP-First Delivery
- Added sections: None
- Removed sections: None
- Deferred items: TODO(RATIFICATION_DATE): confirm the team's original adoption date before ratification.
-->

# StudyTrack Constitution

## Core Principles

### I. Student-Centered Design
StudyTrack MUST make it easy for students to organize assignments, study sessions, and deadlines. Every feature MUST have a clear student need and use straightforward language and interactions; avoid complexity that does not improve the student experience.

### II. Clean, Maintainable, and Reusable Code
The project MUST use the Next.js App Router, TypeScript, and Tailwind CSS. Code MUST be readable, consistently formatted, and organized into reusable components and logic where reuse improves clarity. Contributors MUST avoid unnecessary duplication and complexity so the shared codebase remains maintainable.

### III. Responsive Design and Accessibility
The application MUST remain usable on mobile and desktop screens. Forms, navigation, and content MUST support keyboard interaction, readable text, and accessible labels and controls. Responsive behavior and accessibility MUST be considered in implementation and reviewed before merging.

### IV. Secure Authentication and Student Data Protection
Authentication MUST protect student accounts and personal records. Students MUST only access records they are authorized to see. The application MUST validate user input, apply least-privilege access, and never commit secrets to version control.

### V. Team Collaboration
Work MUST be tracked through the team's GitHub workflow. Contributors MUST use feature branches and pull requests; each pull request MUST receive at least one teammate's review before merge. Direct pushes to the main branch are prohibited.

### VI. Testing and Quality Assurance
Each feature MUST have measurable acceptance criteria. Contributors MUST run relevant tests and quality checks, including linting where configured, and address failures before merge. Pull requests MUST describe the validation performed and any known risks.

### VII. MVP-First Delivery
The team MUST prioritize completing and validating the agreed MVP before adding advanced functionality. The MVP consists of student account registration, login, and logout; assignment creation, viewing, editing, and deletion; study session scheduling and tracking; upcoming deadline visibility; and assignment completion and progress monitoring. Any proposed scope beyond these capabilities MUST NOT delay unfinished MVP work without explicit team approval.

## Technology Standards
- Framework: Next.js App Router
- Language: TypeScript
- Styling: Tailwind CSS
- Database: The team will decide and document the choice before production use.
- Authentication provider: The team will decide and document the choice before production use.
- Hosting: The team will decide and document the choice before production use.

## Development Workflow
The constitution governs project decisions and code reviews. Contributors MUST:

- Define the problem and acceptance criteria and track work in GitHub.
- Use a descriptive feature branch for each task and submit changes through a pull request.
- Include a change summary, validation performed, and known risks in each pull request.
- Obtain at least one teammate review and pass relevant quality checks before merging into main.
- Raise unclear requirements, blockers, and repeated issues early for team resolution.

## Governance
This constitution guides product and engineering decisions. Amendments to principles, required workflow, or project standards MUST be reviewed and approved by the team. Contributors MUST document approved amendments and their rationale in the pull request that changes this file.

The constitution uses semantic versioning:
- MAJOR: backward-incompatible governance changes or materially redefined requirements.
- MINOR: added principles or sections, or materially expanded requirements.
- PATCH: clarifications and non-semantic wording or formatting changes.

Compliance MUST be reviewed during planning, pull-request review, and release checks. Contributors MUST identify and document any proposed exception and obtain team approval before proceeding.

**Version**: 1.2.0 | **Ratified**: TODO(RATIFICATION_DATE): confirm the team's original adoption date before ratification. | **Last Amended**: 2026-11-07
