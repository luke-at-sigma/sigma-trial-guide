# Sigma Free Trial Learning Path

Two-part structure: **Getting Started** (3 tracks for primary entry points) and **Deep Dive** (3 tracks for specialized audiences).

---

# Part 1 — Getting Started

## Track 1: Start from an Existing Workbook

*Progression: orient → view as a Viewer → explore as a Builder → extend*

### About Sigma

| Lesson | Type | Notes |
|--------|------|-------|
| What is Sigma? | Video | Warehouse-native, spreadsheet-familiar — position vs. Tableau, Looker, Excel |
| Get around in Sigma | Interactive | Home page, left rail, search, create new menu |

### Start as a Viewer

*Begin by interacting with a pre-built workbook as a consumer — before touching edit mode.*

| Lesson | Type | Notes |
|--------|------|-------|
| Opening and navigating a shared workbook | Interactive | Pages, elements, data connections — what you're looking at |
| Using controls and filters | Interactive | Listboxes, date pickers, sliders — interact without editing |
| Drilling down into data | Interactive | Click-through actions, maximizing elements |
| Creating and managing bookmarks | Interactive | Save your personal filter state without affecting the published workbook |
| Exporting data as a Viewer | Interactive | Download CSV, export to PDF — and what permissions control this |

### Spreadsheet — Start Editing

*Transition from viewing to making your first edits.*

| Lesson | Type | Notes |
|--------|------|-------|
| Sorting, filtering, and searching in a table | Interactive | The spreadsheet-familiar layer — no SQL required |
| Reading what's already built | Interactive | Understand how existing filters, charts, and tables were constructed |

### Functions — Build on Top of It

| Lesson | Type | Notes |
|--------|------|-------|
| Adding a column with a formula | Interactive | Formula bar, column references, basic arithmetic |
| Sigma functions vs. Excel functions | Video | Syntax differences, where to find the function index |
| Conditional logic with If/Switch | Interactive | Building conditional columns |

### Input Table — Extend Further

| Lesson | Type | Notes |
|--------|------|-------|
| What is an Input Table and when to use one | Video | Manual data entry written back to your warehouse |
| Adding a filter control (listbox or date range) | Interactive | Make the workbook interactive for other viewers |
| Adding a KPI and a bar chart | Interactive | Extend existing data with new visualizations |
| Sharing the workbook | Interactive | Share vs. schedule — two distinct workflows, commonly conflated |

---

## Track 2: Build from Scratch

*Every step in this track can also be completed using Sigma Assistant — this is called out inline at each step.*

### Connect to a Data Source

| Lesson | Type | Notes |
|--------|------|-------|
| Browsing your connection in the data panel | Interactive | Finding tables, previewing schema |
| Adding a table element to your canvas | Interactive | Floating toolbar → Data → Table flow |
| Understanding live queries (no data copy) | Video | Why Sigma queries the warehouse directly — no ETL, no extract |

### Filter & Control

| Lesson | Type | Notes |
|--------|------|-------|
| Adding a column filter | Interactive | Exact match, contains, Top-N — and why Top-N behaves differently |
| Creating a filter control (listbox, date range) | Interactive | Controls that viewers can interact with |
| Cascading filters: making controls depend on each other | Interactive | Top community question — cover scope and parent/child setup |
| Non-exact (partial) string matching | Interactive | How to filter for values that "contain" a string |

### Group & Summarize

| Lesson | Type | Notes |
|--------|------|-------|
| Grouping rows by a dimension | Interactive | Right-click column → Group |
| Adding an aggregation (Sum, Count, Average) | Interactive | Add column → aggregate functions |
| Multi-level grouping | Interactive | Grouping by two or more dimensions simultaneously |

### Functions — Build 2 Calculations

| Lesson | Type | Notes |
|--------|------|-------|
| Writing your first calculated column | Interactive | Formula bar, column references, basic arithmetic |
| Building a date-based KPI | Interactive | DateDiff + conditional formatting (e.g. days since last order) |
| Building a running total or rank | Interactive | Window functions — CumulativeSum, Rank |

### Add KPI + Bar Chart

| Lesson | Type | Notes |
|--------|------|-------|
| Adding a KPI element | Interactive | Data source → KPI chart type → Value + Timeline + Comparison channels |
| Adding a bar chart | Interactive | Chart picker, axis mapping, color by dimension |
| Formatting your chart | Interactive | Axis labels, currency/percent, legend position |

### Input Tables

| Lesson | Type | Notes |
|--------|------|-------|
| Adding an Input Table | Interactive | New element → Input Table — column types: text, number, date, checkbox, user |
| Adding two column types | Interactive | Numeric input + text annotation — common planning use case |
| Building a form from an Input Table | Interactive | Form element — collect structured input without exposing the table |
| VLookup back into your workbook | Interactive | Join Input Table data back to warehouse data using a lookup |

### Create a Data Model

| Lesson | Type | Notes |
|--------|------|-------|
| When to build a data model vs. use a raw table | Video | The most common decision new users get wrong |
| Creating a data model | Interactive | New → Data model → adding elements and defining relationships |
| Adding metrics | Interactive | Shared calculated columns available across all workbooks |
| Publishing a data model | Interactive | Draft → Publish flow |

### Ask Sigma & Sigma Agent

| Lesson | Type | Notes |
|--------|------|-------|
| Ask Sigma: natural language to analysis | Interactive | "Show me monthly revenue by region as a bar chart" |
| Editing AI-generated elements | Interactive | Refine what Sigma generates without starting over |
| Sigma Agent (Beta) | Video | Agentic workflows — multi-step automated analysis |

---

## Track 3: Admin

### Connect to Your Warehouse

| Lesson | Type | Notes |
|--------|------|-------|
| Connecting to Snowflake | Interactive | Connection setup, credentials, OAuth vs. service account |

### Manage Users & Licenses

| Lesson | Type | Notes |
|--------|------|-------|
| License types and account type capabilities | Video | Admin, Creator, Explorer, Viewer — what each can do and cost implications |
| Managing account types for your org | Interactive | Assigning types to users, bulk updates, team-based assignment |
| Workspace and document-level permissions | Interactive | How org-level grants interact with document-level grants |

### Configure the Platform

| Lesson | Type | Notes |
|--------|------|-------|
| Configuring AI features | Interactive | Enable/disable Sigma Assistant, AI column suggestions, model selection |
| Create and publish a data model | Interactive | Semantic layer setup for org-wide shared metrics |
| Materialization strategy | Video | *Top admin pitfall:* when to materialize, Sigma-side vs. warehouse-side, and how filters interact with materialized elements |
| Scheduling and conditional exports | Interactive | Email, Slack, Drive — each requires separate auth; conditional send threshold behavior |

---

# Part 2 — Deep Dive

## Track 1: Viewer

*A focused track on the Viewer experience — the "role gap" between Viewers and Creators is one of the most under-documented areas in Sigma.*

| Lesson | Type | Notes |
|--------|------|-------|
| What Viewers can and cannot do | Video | The role gap — Viewers see a fundamentally different product than Creators |
| Navigating a shared workbook | Interactive | Pages, elements, switching between views |
| Using controls and filters | Interactive | Listboxes, date pickers, sliders — all the interactive elements |
| Drilling down into data | Interactive | Click-through actions, element maximize |
| Creating and managing bookmarks | Interactive | Personal filter state that doesn't affect the published workbook |
| Exporting data | Interactive | CSV, PDF — permission layers that control what's available |

---

## Track 2: Embed

*For customers embedding Sigma into their own products.*

| Lesson | Type | Notes |
|--------|------|-------|
| Intro to Sigma embedding | Video | Two embed types: secure embed (JWT) vs. public embed |
| Setting up a secure embed (JWT) | Interactive | Constructing the JWT, required claims, signing key setup |
| Passing user attributes through embed parameters | Interactive | How to enforce RLS in an embedded context — most common embed pain point |
| Customizing the embedded experience | Interactive | Hiding UI elements, theming, responsive sizing |
| Plugin development basics | Video | The Plugin Dev Playground requirement — commonly undiscovered |

---

## Track 3: TBD

*Placeholder — to be defined in a follow-up session.*

> **Candidates from research:** Joins & relationships, row-level security with user attributes, pivot table limitations, actions & interactivity (data apps), advanced data modeling, materialization deep dive.

---

# Summary

| Part | Track | Primary Audience | Format Mix |
|------|-------|-----------------|------------|
| Getting Started | 1 — Start from an Existing Workbook | All new users | Video + Interactive |
| Getting Started | 2 — Build from Scratch | Builders / analysts | Mostly Interactive |
| Getting Started | 3 — Admin | Admins | Video + Interactive |
| Deep Dive | 1 — Viewer | Consumers / Viewers | Interactive |
| Deep Dive | 2 — Embed | Developers | Video + Interactive |
| Deep Dive | 3 — TBD | TBD | TBD |
