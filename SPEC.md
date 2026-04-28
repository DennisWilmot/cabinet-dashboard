# GoJ Cabinet Budget Dashboard — Backend Specification

> **Version:** 1.0 (Draft)
> **Date:** April 27, 2026
> **Status:** Pre-implementation — all decisions documented, ready for build phase

---

## 1. System Overview

The GoJ Budget Tracker gives Cabinet Ministers vital leading performance indicators across ministries, departments, and agencies for accountability and accelerated outcomes.

### 1.1 Current State

The prototype is a Next.js 14+ (App Router) application with:
- 11 page routes, 2 API routes
- Budget data hardcoded across 17 static TypeScript modules (extracted from 2026–2027 Estimates of Expenditure PDF)
- Mock data for meetings, action items, and blockers (in-session state only)
- Only 2 real backend connections: meeting attendance (Drizzle/Postgres) and transcript uploads (Supabase Storage)
- Google OAuth via Better Auth
- Deployed on Railway

### 1.2 Target State

A fully database-backed system with:
- Real-time budget tracking from ministry-uploaded actuals
- AI-powered meeting transcript processing (action item extraction, decisions, minutes)
- Full CRUD for meetings, action items, blockers, and OKRs
- Role-based access with 5 distinct user roles
- Immutable audit trail on all mutations
- Provider-agnostic AI assistant (Atlas)
- S3-compatible file storage abstraction

---

## 2. User Roles & Access Control

### 2.1 Role Definitions

| Role | Description | Permissions |
|------|-------------|-------------|
| **Super Admin** | Cabinet Office staff | Full system access. Manage users, define CSV templates, upload annual estimates, view all data, resolve any blocker. |
| **PM / PM's Office** | Prime Minister's team | Effectively Super Admin. Sets OKRs for ministers. Resolves PM-level blockers. Politically distinct from admin. |
| **Meeting Manager** | Dedicated meeting role | Creates meeting entries, uploads transcripts, reviews/approves AI-extracted action items and decisions. |
| **Minister** | Cabinet Minister | Views all ministry data (transparency model). Manages own action items. Comments on assigned blockers. Views own OKRs. |
| **Ministry Uploader** | PS or designated officer | Uploads CSV actuals for their own ministry only. Cannot upload for other ministries. Read access to all data. |

### 2.2 Auth Implementation

- **Provider:** Google OAuth via Better Auth (GOJ uses Google Workspace)
- **Role storage:** `user_roles` table in Postgres (not in auth provider)
- **v1 scope:** Admin view only — all authenticated users see admin view
- **v2 scope:** Role-based views with scoped dashboards per role

### 2.3 View Scoping (v2)

All users can read all ministry data (transparency model). Scoping applies to:
- **Write access:** Ministry Uploaders can only upload for their assigned ministry
- **Action items:** Ministers see their own highlighted, but can view all
- **OKRs:** Ministers see their own, PM sees all
- **Blocker resolution:** PM-level blockers restricted to PM role

---

## 3. Data Architecture

### 3.1 Budget Data Model (Full Relational)

The database schema mirrors the existing TypeScript types in `lib/types.ts`. Approximately 15 tables in a normalized relational structure.

#### Core Tables

```
ministries
├── id (text, PK) — e.g., "mof", "education"
├── name (text) — "Ministry of Finance & the Public Service"
├── short_name (text) — "Finance"
├── total_allocation (numeric)
├── prior_year_allocation (numeric)
├── recurrent_total (numeric)
├── capital_total (numeric)
├── fiscal_year (text) — "2026-2027"
├── last_updated (timestamptz)
├── created_at (timestamptz)
└── updated_at (timestamptz)
```

```
ministers
├── id (uuid, PK)
├── ministry_id (text, FK → ministries)
├── name (text)
├── title (text)
├── avatar_url (text)
├── role (enum: minister, state_minister, ps, deputy_ps, head_officer, director)
├── bio (text)
├── constituency (text)
├── office_location (text)
└── is_portfolio_minister (boolean) — for Minister Marks (OPM, no separate budget)
```

#### Fixed Obligations

```
obligations
├── id (text, PK)
├── ministry_id (text, FK → ministries)
├── type (text) — "Debt Service", "Pensions", "Insurance", etc.
├── name (text)
├── head_code (text)
├── allocation (numeric)
├── prior_year_allocation (numeric)
├── paid (numeric)
├── payment_status (enum: current, paid, partial, overdue, pending)
└── fiscal_year (text)

obligation_details
├── id (uuid, PK)
├── obligation_id (text, FK → obligations)
├── key (text) — e.g., "domestic_paid", "pensioner_count"
├── value (jsonb) — flexible for different obligation types
└── fiscal_year (text)
```

#### Operational Entities

```
entities
├── id (text, PK)
├── ministry_id (text, FK → ministries)
├── name (text)
├── head_code (text)
├── allocation (numeric)
├── prior_year_allocation (numeric)
├── spent (numeric)
├── utilization_pct (numeric)
├── head_officer_id (uuid, FK → ministers, nullable)
└── fiscal_year (text)

entity_staffing
├── id (uuid, PK)
├── entity_id (text, FK → entities)
├── approved_posts (integer)
├── filled_posts (integer)
├── vacant_posts (integer)
├── vacancy_rate (numeric)
├── period (text) — monthly reporting period
└── fiscal_year (text)

entity_kpis
├── id (uuid, PK)
├── entity_id (text, FK → entities)
├── name (text)
├── type (enum: output, outcome)
├── unit (text)
├── target (numeric)
├── actual (numeric)
├── prior_year_actual (numeric, nullable)
├── period (text)
└── fiscal_year (text)

entity_revenue
├── id (uuid, PK)
├── entity_id (text, FK → entities)
├── collected (numeric)
├── target (numeric)
├── variance (numeric)
├── variance_pct (numeric)
├── period (text)
└── fiscal_year (text)

entity_revenue_by_type
├── id (uuid, PK)
├── entity_revenue_id (uuid, FK → entity_revenue)
├── type (text)
└── amount (numeric)
```

#### Capital Projects

```
projects
├── id (text, PK)
├── ministry_id (text, FK → ministries)
├── code (text)
├── name (text)
├── current_year_budget (numeric)
├── current_year_spent (numeric)
├── total_project_cost (numeric)
├── cumulative_spend (numeric)
├── financial_progress_pct (numeric)
├── physical_progress_pct (numeric)
├── start_date (date)
├── original_end_date (date)
├── revised_end_date (date, nullable)
├── status (enum: on_track, delayed, at_risk, completed, not_started)
├── risk_level (enum: low, moderate, high)
├── narrative (text)
├── is_contingency (boolean)
├── medium_term_projection (jsonb — number[])
└── fiscal_year (text)

milestones
├── id (uuid, PK)
├── project_id (text, FK → projects)
├── name (text)
├── planned_date (date)
├── revised_date (date, nullable)
├── actual_date (date, nullable)
├── status (enum: completed, in_progress, upcoming, delayed, cancelled)
└── weight_pct (numeric)

funding_sources
├── id (uuid, PK)
├── project_id (text, FK → projects)
├── source (text)
├── committed (numeric)
├── disbursed (numeric)
├── next_tranche_date (date, nullable)
└── conditions (text, nullable)
```

#### Time-Series Actuals

```
monthly_snapshots
├── id (uuid, PK)
├── entity_type (enum: ministry, obligation, entity, project, revenue)
├── entity_id (text) — FK to the relevant table
├── period (text) — "2026-04", "2026-05", etc.
├── cumulative (numeric)
├── monthly (numeric)
├── is_prior_year (boolean) — for prior-year comparison series
├── fiscal_year (text)
└── uploaded_at (timestamptz)
```

#### Revenue (Ministry-Level)

```
ministry_revenue
├── id (uuid, PK)
├── ministry_id (text, FK → ministries)
├── total_collected (numeric)
├── total_target (numeric)
├── variance (numeric)
├── variance_pct (numeric)
├── period (text)
└── fiscal_year (text)

ministry_revenue_splits
├── id (uuid, PK)
├── ministry_revenue_id (uuid, FK → ministry_revenue)
├── entity_name (text)
├── amount (numeric)
└── pct (numeric)
```

### 3.2 Meetings & Accountability

```
meetings
├── id (text, PK)
├── title (text) — "Weekly Cabinet Meeting"
├── date (date)
├── start_time (time, nullable)
├── end_time (time, nullable)
├── meet_link (text, nullable) — Google Meet URL
├── status (enum: upcoming, completed, cancelled)
├── created_by (uuid, FK → users)
├── created_at (timestamptz)
└── updated_at (timestamptz)

meeting_attendance
├── id (uuid, PK)
├── meeting_id (text, FK → meetings)
├── ministry_id (text, FK → ministries)
└── updated_at (timestamptz)

meeting_transcripts
├── id (uuid, PK)
├── meeting_id (text, FK → meetings)
├── file_url (text) — S3-compatible URL
├── file_name (text)
├── uploaded_by (uuid, FK → users)
├── uploaded_at (timestamptz)
├── processing_status (enum: pending, processing, completed, failed)
└── raw_text (text, nullable) — extracted text for Atlas processing

meeting_minutes
├── id (uuid, PK)
├── meeting_id (text, FK → meetings)
├── content (text) — markdown
├── source (enum: manual, ai_extracted)
├── reviewed (boolean, default false)
├── reviewed_by (uuid, FK → users, nullable)
└── created_at (timestamptz)

key_decisions
├── id (uuid, PK)
├── meeting_id (text, FK → meetings)
├── description (text)
├── source (enum: manual, ai_extracted)
├── reviewed (boolean, default false)
└── created_at (timestamptz)
```

### 3.3 Action Items

```
action_items
├── id (uuid, PK)
├── meeting_id (text, FK → meetings)
├── description (text)
├── assigned_ministry_id (text, FK → ministries)
├── assigned_to_name (text) — display name of assignee
├── status (enum: open, in_progress, resolved)
├── due_date (date, nullable)
├── source (enum: manual, ai_extracted)
├── reviewed (boolean, default false) — human-reviewed if AI-extracted
├── reviewed_by (uuid, FK → users, nullable)
├── created_at (timestamptz)
└── updated_at (timestamptz)

action_item_comments
├── id (uuid, PK)
├── action_item_id (uuid, FK → action_items)
├── author_id (uuid, FK → users)
├── author_name (text)
├── content (text)
└── created_at (timestamptz)
```

### 3.4 Blockers

Blockers can be created via three paths:
1. **Manual creation** by admin/minister
2. **Escalated from action items** (primary path — overdue action → one-click escalation)
3. **AI-flagged** from transcript language

```
blockers
├── id (uuid, PK)
├── title (text)
├── description (text)
├── escalation_level (enum: pm, minister)
├── assigned_ministry_id (text, FK → ministries)
├── assigned_to_name (text)
├── status (enum: open, in_progress, resolved)
├── source (enum: manual, escalated, ai_flagged)
├── source_action_item_id (uuid, FK → action_items, nullable)
├── linked_project_id (text, FK → projects, nullable)
├── linked_name (text, nullable) — display name of linked item
├── linked_href (text, nullable) — URL path to linked item
├── created_date (date)
├── resolved_date (date, nullable)
├── created_at (timestamptz)
└── updated_at (timestamptz)

blocker_activity
├── id (uuid, PK)
├── blocker_id (uuid, FK → blockers)
├── type (enum: comment, status_change)
├── author_id (uuid, FK → users)
├── author_name (text)
├── content (text)
├── previous_status (text, nullable) — for status_change type
├── new_status (text, nullable) — for status_change type
└── created_at (timestamptz)
```

### 3.5 OKRs (Separate Accountability Layer)

OKRs are independent from budget KPIs. They are a goal-setting tool for the PM to hold ministers accountable beyond spending.

- **Ownership:** TBD — PM's office sets top-down, or negotiated with ministers. Policy decision needed.
- **Cadence:** TBD — annual or quarterly. Policy decision needed.
- **Updates:** TBD — manual entry, derived from CSV actuals, or AI-suggested. Policy decision needed.

```
objectives
├── id (uuid, PK)
├── ministry_id (text, FK → ministries)
├── title (text)
├── description (text, nullable)
├── period (text) — "Q1 2026", "FY 2026-2027", etc.
├── progress_pct (numeric, default 0)
├── status (enum: on_track, at_risk, off_track)
├── created_at (timestamptz)
└── updated_at (timestamptz)

key_results
├── id (uuid, PK)
├── objective_id (uuid, FK → objectives)
├── title (text)
├── unit (text) — "%", "count", "$", etc.
├── target (numeric)
├── actual (numeric, default 0)
├── progress_pct (numeric, default 0)
├── status (enum: on_track, at_risk, off_track)
├── created_at (timestamptz)
└── updated_at (timestamptz)
```

### 3.6 Users & Roles

```
users
├── id (uuid, PK) — from Better Auth
├── email (text, unique)
├── name (text)
├── avatar_url (text, nullable)
├── created_at (timestamptz)
└── last_login (timestamptz)

user_roles
├── id (uuid, PK)
├── user_id (uuid, FK → users)
├── role (enum: super_admin, pm_office, meeting_manager, minister, ministry_uploader)
├── ministry_id (text, FK → ministries, nullable) — scopes ministry_uploader and minister roles
├── granted_by (uuid, FK → users)
├── granted_at (timestamptz)
└── revoked_at (timestamptz, nullable)
```

### 3.7 Audit Log

Immutable record of every mutation in the system. Built from day one.

```
audit_log
├── id (uuid, PK)
├── user_id (uuid, FK → users)
├── user_email (text) — denormalized for fast reads
├── action (text) — "create", "update", "delete", "upload", "status_change"
├── entity_type (text) — "meeting", "action_item", "blocker", "ministry_actuals", etc.
├── entity_id (text) — ID of the affected record
├── before_value (jsonb, nullable) — snapshot before change
├── after_value (jsonb, nullable) — snapshot after change
├── metadata (jsonb, nullable) — extra context (e.g., file name for uploads)
├── ip_address (text, nullable)
└── created_at (timestamptz)
```

**Implementation:** Application-level middleware on all API routes that logs to `audit_log` before returning. Not a database trigger — application context (user identity, IP) is needed.

### 3.8 CSV Upload Tracking

```
csv_uploads
├── id (uuid, PK)
├── ministry_id (text, FK → ministries)
├── upload_type (enum: annual_estimates, monthly_actuals)
├── file_url (text) — S3-compatible URL to the original file
├── file_name (text)
├── period (text) — "2026-04" for monthly, "2026-2027" for annual
├── row_count (integer)
├── status (enum: pending, validated, imported, failed)
├── error_details (jsonb, nullable) — validation errors
├── uploaded_by (uuid, FK → users)
├── uploaded_at (timestamptz)
├── imported_at (timestamptz, nullable)
└── fiscal_year (text)
```

---

## 4. Status Calculation Engine

### 4.1 Multi-Dimensional Status

Each ministry has separate status indicators per dimension:

| Dimension | Source | On Track | At Risk | Off Track |
|-----------|--------|----------|---------|-----------|
| **Budget Utilization** | Monthly actuals vs planned | Within ±10% of expected pro-rata spend | 10–20% deviation | >20% deviation (over or under) |
| **KPI Progress** | Entity KPIs from CSV | ≥80% of KPIs on target | 50–80% on target | <50% on target |
| **Action Item Completion** | Action items by ministry | ≥80% resolved on time | 50–80% resolved | <50% resolved or >3 overdue |
| **Blocker Count** | Open blockers | 0 open blockers | 1–2 open blockers | ≥3 open or any PM-level blocker |

### 4.2 Headline Status

**Worst-of rule:** The ministry's overall status is the worst of its four dimensional statuses.
- If any dimension is off track → overall is **off track**
- Else if any dimension is at risk → overall is **at risk**
- Otherwise → **on track**

### 4.3 Tooltips

Non-technical language. Each status tooltip explains only the current state in plain English:
- On track: "Project is on track, meeting all key milestones."
- At risk: "Ministry spending is 15% below expected pace — may not fully utilise allocation."
- Off track: "3 action items overdue by more than 14 days. Immediate attention needed."

---

## 5. Atlas — AI Assistant

### 5.1 Scope

Full agentic assistant with tool-use architecture: read-only Q&A against all data sources, transcript processing, mutations (future), and report generation. Built provider-agnostic with swappable data backends.

### 5.2 Architecture

```
Atlas Chat UI  →  POST /api/atlas/chat  →  LLM (Claude Opus 4.6 via OpenRouter)
                                                  ↓ tool calls
                                           Tool Router (20 tools)
                                           ├── getMinistryDetail  →  DataProvider.getMinistry(slug)
                                           ├── listBlockers       →  DataProvider.getBlockers(filters)
                                           └── ...

                                           DataProvider (interface)
                                           ├── StaticDataProvider  ← reads from lib/data/, lib/meetings/, lib/blockers/
                                           └── DbDataProvider      ← reads from Postgres via Drizzle (future swap)
```

- **LLM Provider:** OpenRouter → Claude Opus 4.6 (anthropic/claude-opus-4.6)
- **Provider-agnostic:** Adapter pattern — swap LLM provider via config, not code
- **Data abstraction:** `DataProvider` interface satisfied by both static TS modules (now) and Drizzle DB queries (future). Atlas doesn't know which backend is active.
- **Safety:** All mutations go through the same API routes and audit log as manual actions
- **Diagnostic logging:** Every Atlas interaction logged to `atlas_logs` table (user message, tools used, error type if any, raw response) for quality debugging

### 5.3 Tool Set (20 Tools)

#### Core Data (8 tools)

| Tool | Parameters | Returns |
|------|-----------|---------|
| `getMinistryList` | `none` | All 17 ministries: name, slug, allocation, spent, utilization %, status |
| `getMinistryDetail` | `slug: string` | Full budget breakdown: overview, fixed, ops, capital totals + leadership |
| `getMinistryProjects` | `slug: string, filters?: { status?, riskLevel? }` | Capital projects with status, spend, milestones |
| `getMinistryObligations` | `slug: string, filters?: { type?, paymentStatus? }` | Fixed obligations (debt, pensions, insurance, etc.) |
| `getMinistryEntities` | `slug: string, filters?: { kpiType? }` | Operational entities with KPIs, staffing, revenue |
| `getMinisterProfile` | `slug: string` | Bio, title, constituency, office, leadership team |
| `getMeetingList` | `filters?: { dateAfter?, dateBefore?, status? }` | All meetings with date, attendee count, status |
| `getMeetingDetail` | `id: string` | Single meeting: attendees, action items, decisions, minutes |

#### Accountability (4 tools)

| Tool | Parameters | Returns |
|------|-----------|---------|
| `listActionItems` | `filters?: { status?, ministrySlug?, meetingId?, overdue?: boolean, assignee?, dateAfter?, dateBefore? }` | Action items with assignee, meeting, due date, status, comment count |
| `listBlockers` | `filters?: { status?, escalationLevel?, ministrySlug?, createdAfter?, createdBefore? }` | Blockers with activity count, age, assigned resolver |
| `getMinisterOKRs` | `slug: string` | OKR objectives + key results with progress |
| `getMinisterAccountability` | `slug: string` | Attendance rate, action completion %, OKR progress %, open blockers, at-risk flags |

#### Analytical / Cross-Cutting (6 tools)

| Tool | Parameters | Returns |
|------|-----------|---------|
| `searchAcrossMinistries` | `query: string` | Fuzzy search across projects, entities, obligations, people — ranked results |
| `aggregateSpending` | `dimension: 'bucket' \| 'ministry' \| 'status', filters?: { ministrySlug? }` | Aggregated spend by the chosen dimension |
| `compareMinistries` | `slugs: string[], metrics: string[]` | Side-by-side comparison table for specified metrics |
| `identifyAtRiskItems` | `type?: 'ministries' \| 'projects' \| 'actions' \| 'all'` | All off-track/at-risk items with reasons |
| `calculateTrend` | `entityType: string, entityId: string` | Monthly trajectory (cumulative + monthly) for any tracked entity |
| `getSystemStats` | `none` | Dashboard-level summary: total allocation, total spent, open blockers, overdue actions, ministry count by status |

#### Analytical Power Tool (1 tool)

| Tool | Parameters | Returns |
|------|-----------|---------|
| `queryData` | `entityType: string, filters: Record<string, any>, groupBy?: string, sortBy?: string, limit?: number` | Structured query against any data type with arbitrary filtering, grouping, sorting. Enables questions like "which person in MOF has been most actively commenting on action threads" |

#### Generation (1 tool)

| Tool | Parameters | Returns |
|------|-----------|---------|
| `draftBriefing` | `topic: string, audience: 'pm' \| 'minister' \| 'cabinet', scope?: { ministrySlugs?: string[] }` | Structured briefing note with executive summary, key findings, recommendations |

### 5.4 Response Format (Structured Blocks)

Atlas returns an array of typed content blocks. Each block is rendered by a dedicated React component inside `<AtlasMessage>`. No raw HTML, no dangerouslySetInnerHTML.

```typescript
type AtlasBlock =
  | { type: 'text'; content: string }           // Markdown-formatted prose
  | { type: 'heading'; content: string; level: 2 | 3 }
  | { type: 'table'; headers: string[]; rows: string[][]; caption?: string }
  | { type: 'stat'; label: string; value: string; tone?: 'success' | 'warning' | 'danger' | 'neutral' }
  | { type: 'statGroup'; stats: Array<{ label: string; value: string; tone?: string }> }
  | { type: 'list'; items: string[]; ordered?: boolean }
  | { type: 'status'; label: string; status: 'on_track' | 'at_risk' | 'off_track' }
  | { type: 'link'; href: string; label: string }       // Navigates via router.push
  | { type: 'navigation'; route: string; label: string } // Prominent "Go to" button
  | { type: 'chart'; chartType: 'bar' | 'line' | 'pie'; data: any; title?: string }
  | { type: 'callout'; tone: 'info' | 'warning' | 'danger'; content: string }
  | { type: 'divider' };
```

Each message in the chat is rendered by `<AtlasMessage blocks={blocks} />`, which maps each block to its dedicated renderer component (`<TextBlock>`, `<TableBlock>`, `<ChartBlock>`, `<NavigationBlock>`, etc.). Malformed blocks are silently skipped.

### 5.5 Streaming & UX

**Hybrid model:** Tool calls execute in the background; final answer streams to the user.

```
User sends message
  → "Atlas is thinking..." (pulsing indicator)
  → Tool calls execute silently
  → Progress label updates: "Analyzing 3 ministries..." / "Checking blockers..."
  → Final composed response streams in token by token
  → Collapsible "Reasoning" section shows which tools were used (for power users)
```

- Tool call internals are **never** shown to the user in the main response
- Collapsible reasoning section under each message shows: tools called, parameters, execution time
- If Atlas needs to checkpoint (soft limit reached): "Here's what I've found so far. Want me to dig deeper?"

### 5.6 Soft Tool Call Limit

- **Maximum:** ~15 tool calls per turn (tunable)
- If Atlas hits the limit mid-analysis, it summarizes findings so far and asks: "I've analyzed X so far. Want me to continue with Y?"
- Prevents runaway loops on broad questions ("tell me everything about every ministry")

### 5.7 System Prompt & Persona

**Persona:** Atlas — a senior policy analyst who knows the numbers cold.

```
You are Atlas, the budget intelligence assistant for the Government of Jamaica 
Cabinet Dashboard. You help Cabinet Ministers and the Prime Minister's Office 
understand budget execution, track accountability, and make data-driven decisions.

TONE:
- Professional, concise, authoritative
- Not chatty, not robotic
- Comfortable with Jamaican government terminology (MDA, Estimates of Expenditure, 
  Head Codes, Recurrent vs Capital, PS, State Minister, etc.)

GUARDRAILS:
- Never fabricate numbers. If data isn't available, say so: "I don't have data 
  for [X]. Would you like me to check [Y] instead?"
- Never speculate on political motivations or give policy advice. Stick to data 
  and trends.
- Never reveal system internals (tool names, database structure, API details, 
  model name).
- If asked something outside scope, politely redirect: "I'm focused on budget 
  and cabinet accountability data. For [topic], you'd want to consult [X]."
- Always cite the data source — "Based on the 2026-27 Estimates" or "From the 
  April 8 Cabinet meeting."
- NEVER be too eager to respond. If a question is ambiguous, ASK FOR 
  CLARIFICATION before assuming. "Which ministry are you referring to?" is 
  always better than guessing wrong.
- If the user's current page makes the context obvious (e.g., they're on 
  /ministry/health and ask "how is this ministry doing?"), use that context.
  Otherwise, ask.
```

**Dynamic context injected per message:**
- `currentRoute` — the page the user is currently viewing
- `currentDate` — for "overdue" and "days old" calculations
- `userName` — logged-in user identity (for personalization in v2)

### 5.8 Context-Aware Suggested Prompts

Empty state shows 3-4 suggested prompts based on the current route:

| Route | Suggested Prompts |
|-------|------------------|
| `/dashboard` | "Which ministries are off track?", "Compare the top 3 spenders", "Show overdue action items", "Give me a PM briefing" |
| `/ministry/[id]` | "How is this ministry performing?", "What are the open blockers?", "Show capital project status", "Compare with last year" |
| `/minister/[slug]` | "How is this minister doing on action items?", "Show OKR progress", "What's their attendance rate?" |
| `/meetings` | "Summarize the last cabinet meeting", "What decisions were made on April 8?", "Who missed the most meetings?" |
| `/actions` | "What's overdue?", "Which minister has the most open items?", "Show resolved items this month" |
| `/blockers` | "What's the oldest unresolved blocker?", "Show PM-level escalations", "What trends do you see in recent blockers?" |

Prompts are clickable — tapping one sends it as a message.

### 5.9 Conversation Memory

- **v1:** Fresh per session. Closing the panel resets the conversation.
- **v2:** Persistent conversation history per user, stored in DB.

### 5.10 Error Handling

| Failure Mode | User Sees | System Logs |
|-------------|-----------|-------------|
| **LLM API down** (OpenRouter timeout/5xx) | "Atlas is temporarily unavailable. Try again in a moment." | Error type, status code, timestamp to `atlas_logs` |
| **Tool returns no data** (invalid slug, empty result) | "I couldn't find data for [X]. Did you mean [closest match]?" | Tool name, params, empty result to `atlas_logs` |
| **Malformed response** (bad JSON, invalid block types) | Renderer skips broken blocks, shows what it can. If entire response unparseable: "Something went wrong. Try rephrasing your question." | Raw LLM response, parse error to `atlas_logs` |

### 5.11 Transcript Processing Pipeline

```
1. Meeting Manager uploads transcript (audio file or text)
2. If audio: speech-to-text (Whisper or equivalent) → raw text
3. Atlas processes raw text:
   a. Extract action items (description, assignee, due date)
   b. Extract key decisions
   c. Generate meeting minutes summary
4. Results saved with source: "ai_extracted", reviewed: false
5. Meeting Manager reviews, edits, approves (reviewed: true)
6. Approved items become live in the system
```

---

## 6. CSV Upload System

### 6.1 Template Model

- Each ministry has a **pre-defined CSV template** with locked column headers
- Templates are downloadable as empty CSV files from the dashboard
- Templates are versioned — schema changes create new template versions

### 6.2 Upload Flow

```
1. Ministry Uploader downloads empty CSV template for their ministry
2. Fills in actuals data (spend, KPI progress, staffing, revenue)
3. Uploads completed CSV via drag-and-drop or file picker
4. Server validates:
   a. Column headers match template
   b. Required fields present
   c. Numeric fields are valid
   d. Head codes match known codes for this ministry
   e. Period is valid and not a duplicate
5. If validation fails → clear error messages listing every issue
6. If validation passes → data imported into relevant tables
7. Monthly snapshots updated, status recalculated
8. Audit log entry created
9. Original CSV stored in S3-compatible storage
```

### 6.3 Template Structure (Per Ministry)

```csv
head_code,programme,object_class,budget_amount,actual_spend,period
0100,Administration,Compensation of Employees,450000000,42000000,2026-04
0100,Administration,Travel & Subsistence,12000000,980000,2026-04
...
```

Separate sheets/templates for:
- **Recurrent spend** (by head code, programme, object classification)
- **Capital project progress** (by project code: physical %, financial %, milestones)
- **KPI actuals** (by entity: indicator name, target, actual)
- **Staffing** (by entity: approved, filled, vacant)
- **Revenue** (by entity: collected, target, by type)

### 6.4 Annual Estimates Upload

- Uploaded by Super Admin at start of fiscal year
- Populates the `ministries`, `obligations`, `entities`, `projects` tables with allocations
- Creates empty `monthly_snapshots` structure for the year
- Generates downloadable CSV templates per ministry from the imported structure

---

## 7. File Storage

### 7.1 Abstraction Layer

S3-compatible adapter interface:

```typescript
interface StorageAdapter {
  upload(bucket: string, path: string, file: Buffer, contentType: string): Promise<{ url: string }>;
  download(bucket: string, path: string): Promise<Buffer>;
  getPublicUrl(bucket: string, path: string): string;
  delete(bucket: string, path: string): Promise<void>;
  list(bucket: string, prefix: string): Promise<{ name: string; size: number; lastModified: Date }[]>;
}
```

### 7.2 Buckets

| Bucket | Contents | Access |
|--------|----------|--------|
| `cabinet-transcripts` | Meeting transcript files (audio, text) | Authenticated users only |
| `cabinet-csv-uploads` | Raw CSV files from ministry uploads | Authenticated users only |
| `cabinet-csv-templates` | Downloadable empty CSV templates | Authenticated users only |
| `cabinet-exports` | Generated PDF/Excel reports (v2) | Authenticated users only |

### 7.3 Current Provider

Supabase Storage (S3-compatible). Swappable to AWS S3, MinIO, or Railway object storage via adapter config.

---

## 8. Infrastructure

### 8.1 Current Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 14+ (App Router), TypeScript |
| **Styling** | Tailwind CSS (OKLCH palette) |
| **ORM** | Drizzle ORM |
| **Database** | Postgres (Supabase-hosted) |
| **File Storage** | Supabase Storage |
| **Auth** | Better Auth (Google OAuth) |
| **AI** | TBD — Claude via Anthropic API (provider-agnostic interface) |
| **Hosting** | Railway |

### 8.2 Cloud-Agnostic Design

- Application containerized via Docker
- No vendor-specific APIs beyond the abstraction layers (storage adapter, AI adapter)
- Database is standard Postgres — portable to any Postgres host
- Environment variables for all service configuration
- Production deployment may require data residency consideration (cabinet transcripts, budget actuals)

---

## 9. API Routes (Required)

### 9.1 Budget Data

| Method | Path | Purpose | Role |
|--------|------|---------|------|
| GET | `/api/ministries` | List all ministries with overview data | Any authenticated |
| GET | `/api/ministries/[id]` | Full ministry data (overview + fixed + ops + capital) | Any authenticated |
| GET | `/api/ministries/[id]/snapshots` | Monthly time-series for a ministry | Any authenticated |

### 9.2 CSV Upload

| Method | Path | Purpose | Role |
|--------|------|---------|------|
| GET | `/api/csv/template/[ministryId]` | Download empty CSV template | Ministry Uploader |
| POST | `/api/csv/upload` | Upload filled CSV, validate, import | Ministry Uploader (own ministry) |
| GET | `/api/csv/uploads` | List upload history with status | Admin, Ministry Uploader (own) |
| POST | `/api/csv/estimates` | Upload annual Estimates of Expenditure | Super Admin |

### 9.3 Meetings

| Method | Path | Purpose | Role |
|--------|------|---------|------|
| GET | `/api/meetings` | List all meetings | Any authenticated |
| POST | `/api/meetings` | Create a meeting | Meeting Manager |
| GET | `/api/meetings/[id]` | Meeting detail with all tabs | Any authenticated |
| PUT | `/api/meetings/[id]` | Update meeting details | Meeting Manager |
| PUT | `/api/meetings/[id]/attendance` | Update attendance | Meeting Manager |
| POST | `/api/meetings/[id]/transcript` | Upload transcript file | Meeting Manager |
| POST | `/api/meetings/[id]/process` | Trigger Atlas transcript processing | Meeting Manager |

### 9.4 Action Items

| Method | Path | Purpose | Role |
|--------|------|---------|------|
| GET | `/api/actions` | List all action items (filterable) | Any authenticated |
| POST | `/api/actions` | Create action item manually | Meeting Manager, Admin |
| PUT | `/api/actions/[id]` | Update status, assignee, due date | Assignee, Admin |
| POST | `/api/actions/[id]/comments` | Add comment to thread | Any authenticated |
| POST | `/api/actions/[id]/escalate` | Escalate to blocker (pre-populates blocker) | Admin, Minister |
| PUT | `/api/actions/[id]/review` | Mark AI-extracted item as reviewed | Meeting Manager |

### 9.5 Blockers

| Method | Path | Purpose | Role |
|--------|------|---------|------|
| GET | `/api/blockers` | List all blockers (filterable) | Any authenticated |
| POST | `/api/blockers` | Create blocker manually | Admin, Minister |
| PUT | `/api/blockers/[id]` | Update status | Assigned resolver, Admin |
| POST | `/api/blockers/[id]/activity` | Add comment or status change | Any authenticated |

### 9.6 OKRs

| Method | Path | Purpose | Role |
|--------|------|---------|------|
| GET | `/api/okrs/[ministryId]` | List OKRs for a ministry | Any authenticated |
| POST | `/api/okrs` | Create objective + key results | PM's Office, Admin |
| PUT | `/api/okrs/[id]` | Update objective | PM's Office, Admin |
| PUT | `/api/okrs/[id]/key-results/[krId]` | Update key result actual/progress | Minister, Admin |

### 9.7 Atlas

| Method | Path | Purpose | Role |
|--------|------|---------|------|
| POST | `/api/atlas/chat` | Send message to Atlas, receive response | Any authenticated |
| POST | `/api/atlas/process-transcript` | Process transcript → extract items | Meeting Manager |

### 9.8 Admin

| Method | Path | Purpose | Role |
|--------|------|---------|------|
| GET | `/api/admin/users` | List users with roles | Super Admin |
| POST | `/api/admin/users/[id]/roles` | Assign role to user | Super Admin |
| DELETE | `/api/admin/users/[id]/roles/[roleId]` | Revoke role | Super Admin |
| GET | `/api/admin/audit-log` | Query audit log (filterable) | Super Admin |

---

## 10. Migration Plan

### Phase 1: Foundation (Meetings + Blockers + Audit)
**Why first:** Self-contained, no cross-route dependencies for blockers. Meetings are the second-largest shared source. Establishes the CRUD + audit pattern for everything else.

- [ ] Expand Drizzle schema: `meetings`, `action_items`, `action_item_comments`, `blockers`, `blocker_activity`, `audit_log`, `users`, `user_roles`
- [ ] Build API routes for meetings, actions, blockers
- [ ] Implement audit log middleware
- [ ] Migrate `/meetings`, `/meetings/[id]`, `/actions`, `/blockers` to fetch from DB
- [ ] Build storage adapter (abstract Supabase Storage)

### Phase 2: Minister Profiles + OKRs
**Why second:** Low complexity, high visibility. Ministers table is needed by Phase 3.

- [ ] Add `ministers`, `objectives`, `key_results` tables
- [ ] Build API routes for OKR CRUD
- [ ] Migrate `/minister/[slug]` to fetch from DB
- [ ] Build OKR management UI for PM's Office role

### Phase 3: Budget Data + CSV Upload
**Why third:** Largest and most complex. Depends on the ministers table from Phase 2.

- [ ] Add full budget schema: `ministries`, `obligations`, `obligation_details`, `entities`, `entity_staffing`, `entity_kpis`, `entity_revenue`, `projects`, `milestones`, `funding_sources`, `monthly_snapshots`, `ministry_revenue`, `csv_uploads`
- [ ] Build CSV template generation + download
- [ ] Build CSV upload, validation, and import pipeline
- [ ] Build annual Estimates upload flow
- [ ] Migrate `/dashboard`, `/ministry/*` to fetch from DB
- [ ] Implement status calculation engine (4 dimensions + worst-of headline)

### Phase 4: Atlas AI
**Why fourth:** Needs all data in the DB to be useful.

- [ ] Build provider-agnostic AI adapter
- [ ] Implement tool definitions for DB queries and mutations
- [ ] Build transcript processing pipeline
- [ ] Wire Atlas UI to `/api/atlas/chat`
- [ ] Implement human review flow for AI-extracted items

### Phase 5: Role-Based Views (v2)
- [ ] Implement middleware for role checking
- [ ] Build minister-scoped dashboard view
- [ ] Build ministry uploader view (upload-only + own ministry data)
- [ ] Build PM's Office view (OKR management + PM-level blockers)

---

## 11. Deferred to v2

| Feature | Notes |
|---------|-------|
| **Notifications** | In-app + email for critical events (assignment, status flip, overdue) |
| **PDF/Excel Export** | Atlas-generated briefing notes, downloadable budget reports |
| **Role-Based Views** | Scoped dashboards per role (minister, uploader, PM) |
| **Google Calendar Integration** | Auto-create meetings from calendar events |
| **Advanced Reporting** | Cross-ministry comparison dashboards, trend analysis |
| **Data Residency** | Evaluate hosting requirements for cabinet-sensitive data |

---

## 12. Open Questions (Require Policy Input)

| # | Question | Needs Input From |
|---|----------|-----------------|
| 1 | Who sets OKRs — PM's office top-down, or negotiated with ministers? | PM's Office |
| 2 | What cadence for OKR review — annual or quarterly? | PM's Office |
| 3 | How are OKR key results updated — manual entry, CSV-derived, or AI-suggested? | PM's Office |
| 4 | What are the exact CSV template columns per ministry? Need sample data from MOFPS. | MOFPS |
| 5 | Data residency requirements for cabinet transcripts and budget actuals? | Cabinet Office / AG |
| 6 | Google Workspace — do all ministry staff have GOJ Google accounts, or is email/password fallback needed? | IT / Cabinet Office |
