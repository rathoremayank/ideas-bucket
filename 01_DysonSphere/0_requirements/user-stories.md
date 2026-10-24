# DysonSphere User Stories

## Product goal
DysonSphere is a personal life and growth dashboard that helps a user reflect on progress across health, work, relationships, learning, finances, and daily habits. The app should evolve from a static dashboard into a motivating, low-friction personal operating system that supports consistent action and measurable personal growth.

## Core user
- A working professional who wants more structure and self-awareness
- Values progress over perfection
- Wants a single place to track growth areas, habits, goals, and weekly reflection
- Prefers simple, calm, and private tools over social or noisy interfaces

---

## Epic 1: Personal dashboard and overview

### User story 1.1
As a user, I want to see a dashboard summary of my life areas so that I can understand where I am improving and where I need attention.

Acceptance criteria:
- The dashboard shows overall score, focus summary, and high-level metrics
- Life areas are displayed with their current score and progress trend
- The page is readable on desktop and mobile

### User story 1.2
As a user, I want to toggle between dark and light modes so that the experience feels comfortable in different environments.

Acceptance criteria:
- Theme can be switched instantly from the UI
- Theme preference persists after reload
- Default mode is dark

### User story 1.3
As a user, I want a calm visual design with subtle animation so that the dashboard feels modern and motivating.

Acceptance criteria:
- Background motion remains subtle and non-distracting
- Cards and components have polished spacing and depth
- The interface feels visually consistent across modules
- The dashboard uses a compact 80% visual scale with more distinct accent colors

---

## Epic 2: Life areas management

### User story 2.1
As a user, I want to add or edit life areas so that I can personalize the dashboard around my actual priorities.

Acceptance criteria:
- User can create a custom life area with name, score, and goal
- User can edit or remove an existing area
- Area updates are reflected immediately in the dashboard
- Selecting a life area opens a detail view with an edit option

### User story 2.2
As a user, I want each life area to include a goal and progress indicator so that I can track how close I am to meaningful improvement.

Acceptance criteria:
- Each area shows a goal description
- Each area has a visible progress bar
- Progress can be adjusted manually or through future automation

---

## Epic 3: Habit tracking

### User story 3.1
As a user, I want to track daily habits so that I can build consistency and spot patterns in behavior.

Acceptance criteria:
- User can mark a habit as complete or incomplete
- Habit completion updates the weekly summary
- Completed habits are visually differentiated
- Selecting a habit opens a 13-week date grid where individual days can be checked or unchecked
- Habit name and category can be edited from its detail sheet

### User story 3.2
As a user, I want to see my habit streaks and completion ratios so that I can stay motivated without feeling judged.

Acceptance criteria:
- Streak count is visible on the dashboard
- Habit summary shows completed versus total habits
- The user can identify the most consistent habits quickly

### User story 3.3
As a user, I want to add custom habits so that the tracker reflects my actual routine.

Acceptance criteria:
- User can create new habits with a name and category
- User can enable or disable habits
- Custom habits persist between sessions

---

## Epic 4: Goal tracking

### User story 4.1
As a user, I want to add personal goals so that I can track long-term progress toward meaningful outcomes.

Acceptance criteria:
- Each goal has a title, category, due date, and status
- User can create, update, and delete goals
- Goal progress is visible in a clear progress view
- Selecting a goal opens a detail view with an edit option

### User story 4.2
As a user, I want to prioritize goals so that my effort focuses on what matters most right now.

Acceptance criteria:
- Goals include priority labels or ordering
- High-priority goals stand out visually
- Users can reorder or highlight key goals

---

## Epic 5: Reflection and journaling

### User story 5.1
As a user, I want to record quick daily reflections so that I can connect actions to outcomes and mood.

Acceptance criteria:
- User can add a reflection with text and selected mood
- New entries display with timestamp and mood tag
- Entries remain stored in the app

### User story 5.2
As a user, I want to revisit previous journal entries so that I can look for patterns over time.

Acceptance criteria:
- Entries are stored chronologically
- User can scroll through previous reflections
- Past entries can be searched or filtered later
- User can delete an individual journal entry

---

## Epic 6: Weekly planner and focus

### User story 6.1
As a user, I want a weekly planner so that I can anchor my attention on my top priorities.

Acceptance criteria:
- Weekly planner includes top 3 focus items
- Planner can be updated each week
- Priority levels are visually distinct

### User story 6.2
As a user, I want to review my weekly focus blocks so that I can align my habits and goals with energy and time availability.

Acceptance criteria:
- Planner item list is easy to scan
- User can add tasks and mark their urgency
- Weekly focus remains editable
- The planner includes a broader set of weekly priorities and supports adding more items

---

## Epic 7: Analytics and improvement loops

### User story 7.1
As a user, I want to see growth trends over time so that I can tell whether change is real or just temporary.

Acceptance criteria:
- Trend charts show progress over weeks or months
- Metrics are easy to understand at a glance
- Score changes are reflected in the interface

### User story 7.2
As a user, I want to compare my strongest and weakest life areas so that I can allocate energy wisely.

Acceptance criteria:
- The dashboard highlights top and bottom-performing areas
- Improvement opportunities are visible without browsing multiple screens
- Scorecard remains actionable and readable

---

## Epic 8: Data management and long-term usability

### User story 8.1
As a user, I want my data to persist across refreshes so that I can keep using the app reliably.

Acceptance criteria:
- Data is stored locally in the browser
- Data remains available after reload
- User can back up or restore data with JSON export/import

### User story 8.2
As a user, I want to export and import my app data so that I can move it between devices or create backups.

Acceptance criteria:
- User can export all app state to JSON
- User can import a valid JSON backup
- Invalid JSON triggers a clear error message

### User story 8.3
As a user, I want a simple reset option so that I can restore the app to a clean default state when needed.

Acceptance criteria:
- Reset action is clearly accessible
- Confirmation is shown before resetting data
- Reset returns the app to default seeded content

---

## Nice-to-have future stories

### User story 9.1
As a user, I want AI-driven recommendations so that I can identify patterns and next actions based on my habit and goal data.

### User story 9.2
As a user, I want to connect my app to calendar or fitness data so that progress is more automatic and less manual.

### User story 9.3
As a user, I want to generate a monthly review report so that I can reflect on the broader arc of my personal growth.

---

## MVP roadmap
Phase 1:
- Dashboard overview
- Life areas
- Habit tracker
- Goal tracking
- Journal entries
- Local storage + JSON import/export

Phase 2:
- Weekly planner
- Analytics and trends
- Editing flows for all modules
- Better personalization and categories

Phase 3:
- AI insights
- Monthly reports
- Calendar and external integrations
- Deeper habit analytics and milestones
