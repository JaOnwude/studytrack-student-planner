
# StudyTrack – Student Study Planner
## Project Specification

**Course:** WDD 430 – Web Full-Stack Development  
**Team:** Team 02  
**Specification Lead:** Nsikak Christopher Eyo  
**Version:** 1.0 (Draft)  
**Status:** Awaiting team review

## 1. Project Overview

StudyTrack is a web application designed to help students organize their academic responsibilities. Students can manage assignments, schedule study sessions, monitor deadlines, and track academic progress.

The application will use Next.js, TypeScript, and Tailwind CSS to provide a responsive and accessible experience.

## 2. Target Users

### Primary Users: Students

StudyTrack targets secondary school, college, and university students who need help managing their academic activities.

Their needs include:
- Organizing assignments across different courses.
- Remembering submission deadlines.
- Planning study sessions.
- Tracking completed and pending work.
- Managing study time effectively.

### User Persona

**Name:** Daniel  
**Role:** University Student  
**Challenge:** Daniel struggles to remember deadlines and organize assignments from multiple courses.

**Goal:** Daniel wants one application where he can manage assignments, plan study activities, and monitor his progress.

## 3. Core User Workflows

### Workflow 1: Registration and Login

1. The student opens StudyTrack.
2. The student creates an account or logs in.
3. The system validates the student's credentials.
4. The student accesses a personal dashboard.
5. The student can log out securely.

### Workflow 2: Assignment Management

1. The student opens the Assignments page.
2. The student adds an assignment title, description, and due date.
3. The system validates and saves the assignment.
4. The student can view, edit, or delete the assignment.
5. The student can mark the assignment complete.

### Workflow 3: Study Session Planning

1. The student opens the Study Planner.
2. The student enters a study topic, date, time, and duration.
3. The system saves the study session.
4. The student views upcoming study sessions.
5. The student can edit or delete a session.

### Workflow 4: Deadline Tracking

1. The student opens the dashboard.
2. The system displays upcoming assignment deadlines.
3. The student identifies assignments requiring attention.
4. The student opens an assignment to view its details.

### Workflow 5: Progress Tracking

1. The student completes an assignment.
2. The student marks it as completed.
3. The system updates the assignment status.
4. The dashboard updates the completion statistics.

## 4. Functional Requirements and Acceptance Criteria

### FR-01: User Authentication

**Requirement:** Students must be able to register, log in, and log out.

**Acceptance Criteria:**
- A student can create an account using valid information.
- A registered student can log in successfully.
- Invalid credentials display an appropriate error.
- Logging out ends the authenticated session.
- Unauthenticated users cannot access private records.

### FR-02: Assignment Management

**Requirement:** Students must be able to create, view, edit, and delete assignments.

**Acceptance Criteria:**
- An assignment requires a title and due date.
- New assignments appear in the assignment list.
- Students can update assignment details.
- Students can delete their own assignments.
- Invalid input displays a validation message.

### FR-03: Study Session Management

**Requirement:** Students must be able to schedule and manage study sessions.

**Acceptance Criteria:**
- Students can create a study session with a topic, date, time, and duration.
- Saved sessions appear in the study planner.
- Students can edit and delete their own sessions.
- Invalid dates or durations display validation errors.

### FR-04: Deadline Tracking

**Requirement:** The dashboard must display upcoming assignment deadlines.

**Acceptance Criteria:**
- Pending assignments display their due dates.
- Students can view assignments ordered by due date.
- Completed assignments are distinguishable from pending assignments.
- An empty-state message appears when no assignments exist.

### FR-05: Progress Tracking

**Requirement:** Students must be able to monitor assignment completion.

**Acceptance Criteria:**
- Students can mark assignments completed.
- Students can change completed assignments back to pending.
- Completion statistics update when assignment status changes.
- Students see only their own progress information.

### FR-06: Responsive and Accessible Interface

**Requirement:** StudyTrack must work on mobile and desktop devices.

**Acceptance Criteria:**
- Pages remain usable on mobile screens.
- Navigation works with a keyboard.
- Forms have visible labels.
- Text remains readable.
- Content does not overflow horizontally on common mobile screen sizes.

## 5. Initial Data Models

### Model 1: User

| Field | Type | Description |
|---|---|---|
| id | String | Unique user identifier |
| name | String | Student's name |
| email | String | Unique email address |
| createdAt | DateTime | Account creation date |

Authentication-specific fields will depend on the provider selected by the team.

### Model 2: Assignment

| Field | Type | Description |
|---|---|---|
| id | String | Unique assignment identifier |
| userId | String | Owner of the assignment |
| title | String | Assignment title |
| description | String | Optional assignment details |
| dueDate | DateTime | Submission deadline |
| status | Enum | Pending or Completed |
| createdAt | DateTime | Creation date |
| updatedAt | DateTime | Last modification date |

### Model 3: StudySession

| Field | Type | Description |
|---|---|---|
| id | String | Unique session identifier |
| userId | String | Owner of the session |
| topic | String | Study topic |
| scheduledAt | DateTime | Scheduled start time |
| durationMinutes | Number | Planned study duration |
| notes | String | Optional study notes |
| createdAt | DateTime | Creation date |

## 6. Data Relationships

- One User can have many Assignments.
- One User can have many StudySessions.
- Each Assignment belongs to one User.
- Each StudySession belongs to one User.
- Assignment and StudySession records are private to their owners.

## 7. Technology Stack

- Framework: Next.js App Router
- Language: TypeScript
- Styling: Tailwind CSS
- Database: Supabase PostgreSQL, with Prisma ORM for the schema and migrations
- Authentication: Auth.js v5 with email and password (Credentials provider); passwords are stored only as bcrypt hashes
- Hosting: Vercel

## 8. Out-of-Scope Features

The following are not required for the initial MVP:
- AI-powered study recommendations.
- Group messaging.
- Teacher dashboards.
- Payment processing.
- Advanced analytics.
- Push notifications.

## 9. Definition of Done

A feature is complete when:
1. Its acceptance criteria are satisfied.
2. It works on mobile and desktop.
3. Relevant input validation is implemented.
4. The code passes agreed quality checks.
5. A teammate reviews the pull request.
6. The change is approved for merging.

## 10. Project Success Criteria

The MVP will be successful when students can securely access their accounts, manage assignments, schedule study sessions, view deadlines, and monitor completion progress through a responsive interface.

**Document Status:** Draft for team review and approval.
