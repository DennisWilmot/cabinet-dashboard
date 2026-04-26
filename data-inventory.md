# Cabinet Dashboard — Ministry Data Inventory

> **Purpose:** Comprehensive inventory of all datasets required per ministry, including every data attribute. Use this as a reference for data collection, validation, and future API integration.
>
> **Current state:** All 18 ministries have structural data (allocations, entity names, project names) sourced from the 2026-27 and 2025-26 Estimates of Expenditure. Monthly actuals (time series) are mock-generated. Revenue data is only populated for MOF. Debt service data is only populated for MOF.

---

## Global Data Model

Every ministry conforms to the `MinistryData` interface, which contains **6 top-level datasets**:

| # | Dataset | Description |
|---|---------|-------------|
| 1 | `overview` | Ministry-level summary: totals, minister, time series |
| 2 | `revenue` | Revenue collection vs targets (if applicable) |
| 3 | `fixedObligations` | Recurring expenditure: debt, pensions, insurance, memberships, transfers |
| 4 | `operational` | Operational programmes: entities, staffing, KPIs |
| 5 | `capital` | Capital expenditure: projects, milestones, funding sources |
| 6 | `leadership` | Senior officers: minister, PS, heads |

---

## Dataset 1: Ministry Overview (`MinistryOverview`)

| Attribute | Type | Description |
|-----------|------|-------------|
| `id` | string | URL slug (e.g. `mof`, `education`) |
| `name` | string | Full ministry name |
| `shortName` | string | Abbreviated name for breadcrumbs/cards |
| `minister` | SeniorOfficer | Minister's name, title, avatar, role |
| `totalAllocation` | number | FY 2026-27 total budget (J$ millions) |
| `priorYearAllocation` | number | FY 2025-26 total budget |
| `totalSpent` | number | Year-to-date expenditure |
| `recurrentTotal` | number | Recurrent allocation subtotal |
| `capitalTotal` | number | Capital allocation subtotal |
| `actuals` | MonthlySnapshot[] | Current year cumulative spend (6 months mock) |
| `priorYearActuals` | MonthlySnapshot[] | Prior year cumulative spend (12 months) |

**MonthlySnapshot** attributes: `period` (e.g. "2026-04"), `cumulative` (J$ millions), `monthly` (that month's increment).

---

## Dataset 2: Revenue Data (`RevenueData`)

| Attribute | Type | Description |
|-----------|------|-------------|
| `totalCollected` | number | Revenue collected year-to-date |
| `totalTarget` | number | Annual revenue target |
| `variance` | number | Absolute variance (collected − target) |
| `variancePct` | number | Percentage variance |
| `bySplit` | { entity, amount, pct }[] | Revenue breakdown by collecting entity |
| `actuals` | MonthlySnapshot[] | Monthly revenue time series |
| `priorYearActuals` | MonthlySnapshot[] | Prior year revenue time series |

> **Status:** Only MOF has populated revenue data (TAJ, Customs, RPD splits). All other ministries use `EMPTY_REVENUE`.

---

## Dataset 3: Recurring Expenditure (`FixedObligationsData`)

### Summary attributes

| Attribute | Type | Description |
|-----------|------|-------------|
| `totalAllocation` | number | Total recurring expenditure allocation |
| `priorYearAllocation` | number | Prior year allocation |
| `totalPaid` | number | Year-to-date payments |
| `pctOfMinistry` | number | % of total ministry budget |
| `obligations` | Obligation[] | Individual obligations (see below) |
| `actuals` | MonthlySnapshot[] | Aggregate spend time series |
| `priorYearActuals` | MonthlySnapshot[] | Prior year aggregate time series |
| `debtService` | DebtServiceSummary? | Debt amortisation vs new borrowing (MOF only) |

### DebtServiceSummary (optional, MOF only)

| Attribute | Type | Description |
|-----------|------|-------------|
| `amortisationPaid` | number | Principal repaid year-to-date |
| `interestPaid` | number | Interest serviced year-to-date |
| `newBorrowing` | number | New debt taken on this fiscal year |
| `outstandingStock` | number | Total outstanding debt stock |

### Obligation (base)

| Attribute | Type | Description |
|-----------|------|-------------|
| `id` | string | Unique identifier |
| `type` | string | Category (see types below) |
| `name` | string | Display name |
| `headCode` | string | Estimates of Expenditure reference number |
| `allocation` | number | FY 2026-27 allocation |
| `priorYearAllocation` | number | FY 2025-26 allocation |
| `paid` | number | Amount paid year-to-date |
| `paymentStatus` | PaymentStatus | `current` / `paid` / `partial` / `overdue` / `pending` |
| `actuals` | MonthlySnapshot[] | Payment time series |
| `priorYearActuals` | MonthlySnapshot[] | Prior year payment time series |
| `details` | (varies) | Type-specific detail object (see below) |

### Obligation types and their detail attributes

**`debt_amortisation` / `debt_interest` (DebtObligation)**
| Detail attribute | Type |
|-----------------|------|
| `domesticPaid` | number |
| `externalPaid` | number |
| `paymentsCurrent` | number |
| `paymentsOverdue` | number |
| `nextMajorMaturity` | string (date) |
| `outstandingStock` | number |
| `fourYearTrend` | number[] (4 years) |
| `weightedAvgRate` | number? |
| `fixedVsVariable` | string? |

**`pension` (PensionObligation)**
| Detail attribute | Type |
|-----------------|------|
| `pensionerCount` | number |
| `byCategory` | { category, count }[] |
| `arrearsOutstanding` | number |
| `yoyGrowth` | number (%) |

**`insurance_premium` / `health_insurance` (InsuranceObligation)**
| Detail attribute | Type |
|-----------------|------|
| `components` | { name, budget, paid, status }[] |

**`membership_fee` (MembershipObligation)**
| Detail attribute | Type |
|-----------------|------|
| `organizations` | { name, budget, paid, status }[] |
| `overdueCount` | number |

**`public_body_transfer` (TransferObligation)**
| Detail attribute | Type |
|-----------------|------|
| `entities` | { name, budget, transferred, status }[] |
| `utilizationPct` | number |

---

## Dataset 4: Operational Programmes (`OperationalData`)

### Summary attributes

| Attribute | Type | Description |
|-----------|------|-------------|
| `totalAllocation` | number | Total operational allocation |
| `priorYearAllocation` | number | Prior year allocation |
| `totalSpent` | number | Year-to-date operational spend |
| `utilizationPct` | number | Spend / allocation × 100 |
| `totalFilledPosts` | number | Filled establishment posts |
| `totalApprovedPosts` | number | Approved establishment posts |
| `vacancyRate` | number | Vacancy percentage |
| `entities` | OperationalEntity[] | Individual entities (see below) |
| `actuals` | MonthlySnapshot[] | Aggregate spend time series |
| `priorYearActuals` | MonthlySnapshot[] | Prior year time series |

### OperationalEntity

| Attribute | Type | Description |
|-----------|------|-------------|
| `id` | string | Unique identifier |
| `name` | string | Entity/department name |
| `headCode` | string | Estimates reference number |
| `allocation` | number | FY 2026-27 allocation |
| `priorYearAllocation` | number | FY 2025-26 allocation |
| `spent` | number | Year-to-date spend |
| `utilizationPct` | number | Spend / allocation × 100 |
| `staffing` | StaffingData | Posts and vacancy data |
| `kpis` | KPI[] | Key performance indicators |
| `actuals` | MonthlySnapshot[] | Spend time series |
| `priorYearActuals` | MonthlySnapshot[] | Prior year time series |
| `headOfficer` | SeniorOfficer? | Entity head (if known) |
| `revenueData` | RevenueEntityData? | Revenue collection (if applicable) |

### StaffingData

| Attribute | Type |
|-----------|------|
| `approvedPosts` | number |
| `filledPosts` | number |
| `vacantPosts` | number |
| `vacancyRate` | number (%) |

### KPI

| Attribute | Type | Description |
|-----------|------|-------------|
| `name` | string | Indicator name |
| `type` | `output` / `outcome` | KPI classification |
| `unit` | string | Unit of measure (e.g. `%`, `#`) |
| `target` | number | Annual target |
| `actual` | number | Year-to-date actual |
| `priorYearActual` | number? | Prior year value |
| `trend` | number[]? | Historical trend values |

### RevenueEntityData (optional, nested in entity)

| Attribute | Type |
|-----------|------|
| `collected` | number |
| `target` | number |
| `variance` | number |
| `variancePct` | number |
| `byType` | { type, amount }[]? |
| `actuals` | MonthlySnapshot[] |

---

## Dataset 5: Capital Expenditure (`CapitalData`)

### Summary attributes

| Attribute | Type | Description |
|-----------|------|-------------|
| `totalAllocation` | number | Total capital allocation |
| `priorYearAllocation` | number | Prior year allocation |
| `totalSpent` | number | Year-to-date capital spend |
| `projects` | CapitalProject[] | Individual projects (see below) |
| `actuals` | MonthlySnapshot[] | Aggregate spend time series |
| `priorYearActuals` | MonthlySnapshot[] | Prior year time series |

### CapitalProject

| Attribute | Type | Description |
|-----------|------|-------------|
| `id` | string | Unique identifier |
| `code` | string | Project code |
| `name` | string | Project name |
| `currentYearBudget` | number | FY 2026-27 allocation |
| `currentYearSpent` | number | Year-to-date spend |
| `totalProjectCost` | number | Lifetime project cost |
| `cumulativeSpend` | number | All-years cumulative spend |
| `financialProgressPct` | number | Financial completion % |
| `physicalProgressPct` | number | Physical completion % |
| `startDate` | string | Project start date |
| `originalEndDate` | string | Original completion date |
| `revisedEndDate` | string? | Revised completion date (if delayed) |
| `status` | ProjectStatus | `on_track` / `delayed` / `at_risk` / `completed` / `not_started` |
| `riskLevel` | RiskLevel | `low` / `moderate` / `high` |
| `narrative` | string | 1-2 sentence description |
| `milestones` | Milestone[] | Project milestones |
| `funding` | FundingSource[] | Funding sources |
| `actuals` | MonthlySnapshot[] | Spend time series |
| `isContingency` | boolean? | Contingency reserve flag |
| `mediumTermProjection` | number[]? | 4-year spending projection |

### Milestone

| Attribute | Type |
|-----------|------|
| `name` | string |
| `plannedDate` | string |
| `revisedDate` | string? |
| `actualDate` | string? |
| `status` | `completed` / `in_progress` / `upcoming` / `delayed` / `cancelled` |
| `weightPct` | number (% of project) |

### FundingSource

| Attribute | Type |
|-----------|------|
| `source` | string |
| `committed` | number |
| `disbursed` | number |
| `nextTrancheDate` | string? |
| `conditions` | string? |

---

## Dataset 6: Leadership & People (`SeniorOfficer[]`)

| Attribute | Type | Description |
|-----------|------|-------------|
| `name` | string | Full name with honorifics |
| `title` | string | Position title |
| `headCode` | string? | Linked head code (for entity heads) |
| `avatarUrl` | string | Path to avatar image |
| `role` | OfficerRole | `minister` / `state_minister` / `ps` / `deputy_ps` / `head_officer` / `director` |

---

## Per-Ministry Inventory

### 1. Ministry of Finance & the Public Service (`mof`)

| Dataset | Items | Details |
|---------|-------|---------|
| **Leadership** | 4 | Minister, State Minister, Financial Secretary, Deputy Financial Secretary |
| **Entity Officers** | 7 | TAJ, Customs, Accountant General, PIOJ, STATIN, FID, RPD |
| **Recurring Obligations** | 7 | Debt Amortisation, Debt Interest, Pensions, Health Insurance, Catastrophe Insurance, International Memberships, Public Body Transfers |
| **Operational Entities** | 9 | Tax Administration Jamaica, Jamaica Customs Agency, Accountant General, PIOJ, STATIN, Public Procurement Commission, Core Ministry Divisions, Financial Investigations Division, Revenue Protection Department |
| **Capital Projects** | 5 | TAJ RAIS Upgrade, Public Sector Transformation Programme, Contingency Provision, Hills to Ocean, Agri & Coastal Resilience |
| **Revenue** | ✅ Populated | TAJ, Customs, RPD splits |
| **Debt Service** | ✅ Populated | Amortisation, interest, new borrowing, outstanding stock |

### 2. Ministry of Education, Skills, Youth and Information (`education`)

| Dataset | Items | Details |
|---------|-------|---------|
| **Leadership** | 3 | Minister, State Minister, Permanent Secretary |
| **Entity Officers** | 2 | JIS, CPFSA |
| **Recurring Obligations** | 7 | University & Tertiary Grants, School Feeding & Nutrition, Hurricane Melissa Relief, Scholarships/Exam Fees/Memberships, Early Childhood Subsidies, Textbook & Materials, Skills Training & Youth |
| **Operational Entities** | 9 | Primary Education, Secondary Education, Pre-Primary & Early Childhood, Tertiary Education (Ops), Core Ministry & Admin, Regional Education Services, Special Needs/Curriculum/Libraries, JIS, CPFSA |
| **Capital Projects** | 4 | Education Transformation Programme, Primary & Secondary Infrastructure, Education System Transformation Phase II, Jamaica Education Project |
| **Revenue** | ❌ Empty | — |
| **Debt Service** | ❌ N/A | — |

### 3. Ministry of Health & Wellness (`health`)

| Dataset | Items | Details |
|---------|-------|---------|
| **Leadership** | 4 | Minister, State Minister, Permanent Secretary, Chief Medical Officer |
| **Entity Officers** | 5 | RHA, Core Ministry, Bellevue Hospital, Govt Chemist, NCDA |
| **Recurring Obligations** | 4 | NHF Transfer, Hospital Authority Grants, Drug & Medical Supplies, Health Insurance |
| **Operational Entities** | 6 | Public Health & Primary Care, Disease Surveillance & Prevention, Bellevue Hospital, Govt Chemist, NCDA, Core Ministry Admin |
| **Capital Projects** | 3 | Hospital Construction & Upgrades, Health Information Systems, Medical Equipment Procurement |
| **Revenue** | ❌ Empty | — |
| **Debt Service** | ❌ N/A | — |

### 4. Ministry of National Security & Peace (`national-security`)

| Dataset | Items | Details |
|---------|-------|---------|
| **Leadership** | 3 | Minister, State Minister, Permanent Secretary |
| **Entity Officers** | 5 | JCF, Corrections, PICA, Forensics, MOCA |
| **Recurring Obligations** | 3 | Pension Contributions (Security Forces), Statutory Allowances & Transfers, Insurance Premiums |
| **Operational Entities** | 6 | JCF, Correctional Services, PICA, Forensic Science & Legal Medicine, MOCA, Core Ministry & Policy Coordination |
| **Capital Projects** | 2 | Security Infrastructure Upgrades, Security & Surveillance IT Systems |
| **Revenue** | ❌ Empty | — |
| **Debt Service** | ❌ N/A | — |

### 5. Office of the Prime Minister (`opm`)

| Dataset | Items | Details |
|---------|-------|---------|
| **Leadership** | 3 | Prime Minister, State Minister, Permanent Secretary |
| **Entity Officers** | 3 | JIS, Post & Telecom, NIRA |
| **Recurring Obligations** | 4 | JIS Agency Grant, Post & Telecom Transfer, NIRA Establishment Transfer, Statutory Provisions |
| **Operational Entities** | 4 | PM's Office Divisions, JIS, Post & Telecom Dept, NIRA |
| **Capital Projects** | 2 | National ID System Infrastructure, OPM IT Modernisation |
| **Revenue** | ❌ Empty | — |
| **Debt Service** | ❌ N/A | — |

### 6. Ministry of Energy, Transport & Telecommunications (`energy-transport`)

| Dataset | Items | Details |
|---------|-------|---------|
| **Leadership** | 2 | Minister, Permanent Secretary |
| **Entity Officers** | 1 | Transport Authority |
| **Recurring Obligations** | 4 | Road Maintenance Fund, Energy Subsidy & Transfers, Telecom Universal Service Fund, Insurance Contributions |
| **Operational Entities** | 4 | Transport Authority & Regulation, Energy Policy & Regulation, Telecom Regulation, Core Ministry Admin |
| **Capital Projects** | 3 | Major Road Construction & Rehabilitation, Energy Infrastructure & Grid Modernization, National Broadband Expansion |
| **Revenue** | ❌ Empty | — |
| **Debt Service** | ❌ N/A | — |

### 7. Ministry of Local Government & Community Development (`local-govt`)

| Dataset | Items | Details |
|---------|-------|---------|
| **Leadership** | 2 | Minister, Permanent Secretary |
| **Entity Officers** | 1 | SDC |
| **Recurring Obligations** | 3 | Municipal Corporation Grants, Parochial Revenue Fund, Poor Relief & Social Assistance |
| **Operational Entities** | 5 | SDC, Community Development Programme, Local Govt Admin, Parish Council Oversight, Core Ministry Admin |
| **Capital Projects** | 2 | Parish Infrastructure Programme, Community Facilities Development |
| **Revenue** | ❌ Empty | — |
| **Debt Service** | ❌ N/A | — |

### 8. Ministry of Labour & Social Security (`labour`)

| Dataset | Items | Details |
|---------|-------|---------|
| **Leadership** | 3 | Minister, State Minister, Permanent Secretary |
| **Entity Officers** | 1 | PATH |
| **Recurring Obligations** | 3 | PATH Cash Transfers, NIS Employer Contributions, Pension Transfers |
| **Operational Entities** | 5 | PATH Administration, Employment Services Bureau, Labour Relations & Industrial Safety, Social Security Division, Core Ministry Admin |
| **Capital Projects** | 2 | PATH Modernization Programme, Employment Centre Upgrades |
| **Revenue** | ❌ Empty | — |
| **Debt Service** | ❌ N/A | — |

### 9. Ministry of Economic Growth & Job Creation (`economic-growth`)

| Dataset | Items | Details |
|---------|-------|---------|
| **Leadership** | 3 | Minister, State Minister, Permanent Secretary |
| **Entity Officers** | 4 | NWA, NLA, NEPA, Forestry |
| **Recurring Obligations** | 3 | NWA Transfer (Road Maintenance), NEPA Transfer, Statutory & Environmental Provisions |
| **Operational Entities** | 5 | NWA, NLA, NEPA, Forestry Department, Core Ministry Divisions |
| **Capital Projects** | 5 | Major Highway Infrastructure, Southern Coastal Highway, Bridge Replacement & Rehabilitation, Montego Bay Perimeter Road, Rural Roads Rehabilitation |
| **Revenue** | ❌ Empty | — |
| **Debt Service** | ❌ N/A | — |

### 10. Ministry of Justice & Constitutional Affairs (`justice`)

| Dataset | Items | Details |
|---------|-------|---------|
| **Leadership** | 2 | Minister, Permanent Secretary |
| **Entity Officers** | 4 | Judiciary, DPP, Attorney General, Administrator General |
| **Recurring Obligations** | 3 | Legal Aid Fund, Judicial Allowances & Benefits, Judges Pension Supplement |
| **Operational Entities** | 6 | Judiciary, DPP, Attorney General's Dept, Administrator General's Dept, Legal Affairs Division, Core Ministry Divisions |
| **Capital Projects** | 2 | Court Digitization Programme, Court Infrastructure Improvement |
| **Revenue** | ❌ Empty | — |
| **Debt Service** | ❌ N/A | — |

### 11. Ministry of Tourism (`tourism`)

| Dataset | Items | Details |
|---------|-------|---------|
| **Leadership** | 2 | Minister, Permanent Secretary |
| **Entity Officers** | 2 | JTB, TPDCO |
| **Recurring Obligations** | 4 | Jamaica Tourist Board Grant, TPDCO Grant, Resort Board Contributions, Statutory Provisions |
| **Operational Entities** | 3 | Ministry Core Divisions, Tourism Regulation & Licensing, Tourism Enhancement Fund Support |
| **Capital Projects** | 2 | Tourism Enhancement Projects, Resort Area Infrastructure Improvement |
| **Revenue** | ❌ Empty | — |
| **Debt Service** | ❌ N/A | — |

### 12. Ministry of Agriculture, Fisheries & Mining (`agriculture`)

| Dataset | Items | Details |
|---------|-------|---------|
| **Leadership** | 3 | Minister, State Minister, Permanent Secretary |
| **Entity Officers** | 1 | RADA |
| **Recurring Obligations** | 6 | RADA Recurrent Grant, Fisheries Division Transfer, Commodity Board Contributions, Agricultural Insurance Fund, Jamaica Agricultural Society Grant, National Irrigation Commission Transfer |
| **Operational Entities** | 5 | Extension Services Division, Veterinary Services, Crop Research & Development, Mines & Geology Division, Core Ministry Admin |
| **Capital Projects** | 4 | Irrigation Infrastructure Programme, Farm Roads Rehabilitation, Agro-Processing Facilities Upgrade, Essex Valley Agricultural Station Modernisation |
| **Revenue** | ❌ Empty | — |
| **Debt Service** | ❌ N/A | — |

### 13. Ministry of Foreign Affairs & Foreign Trade (`foreign-affairs`)

| Dataset | Items | Details |
|---------|-------|---------|
| **Leadership** | 2 | Minister, Permanent Secretary |
| **Entity Officers** | 0 | — |
| **Recurring Obligations** | 4 | International Organisation Membership Fees, Embassy & Mission Lease Obligations, Diplomatic Allowances & Immunities, CARICOM & Commonwealth Contributions |
| **Operational Entities** | 6 | Core Foreign Service, Bilateral Relations, Multilateral Affairs, Protocol & Consular Services, Trade Promotion, Diaspora Affairs |
| **Capital Projects** | 2 | Embassy & Mission Upgrades, IT & Secure Communications Modernization |
| **Revenue** | ❌ Empty | — |
| **Debt Service** | ❌ N/A | — |

### 14. Ministry of Industry, Investment & Commerce (`industry`)

| Dataset | Items | Details |
|---------|-------|---------|
| **Leadership** | 2 | Minister, Permanent Secretary |
| **Entity Officers** | 1 | Registrar of Companies |
| **Recurring Obligations** | 5 | JAMPRO Grant, Bureau of Standards Grant, Fair Trading Commission, Trade Board Transfer, Consumer Affairs Commission Grant |
| **Operational Entities** | 5 | Office of the Registrar, Trade & Commerce, Standards & Certification, Commerce & Investment, Core Ministry Admin |
| **Capital Projects** | 2 | National Trade Facilitation Platform, Special Economic Zone Development |
| **Revenue** | ❌ Empty | — |
| **Debt Service** | ❌ N/A | — |

### 15. Ministry of Culture, Gender, Entertainment & Sport (`culture`)

| Dataset | Items | Details |
|---------|-------|---------|
| **Leadership** | 2 | Minister, Permanent Secretary |
| **Entity Officers** | 1 | JCDC |
| **Recurring Obligations** | 5 | JCDC Grant, Sports Development Foundation Grants, Entertainment Industry Fund, National Gallery Transfer, Jamaica Library Service Grant |
| **Operational Entities** | 5 | Bureau of Gender Affairs, Cultural Affairs & Heritage, Sports Division, Entertainment & Creative Industries, Core Ministry Admin |
| **Capital Projects** | 2 | National Sports Facilities Programme, Cultural Infrastructure Rehabilitation |
| **Revenue** | ❌ Empty | — |
| **Debt Service** | ❌ N/A | — |

### 16. Ministry of Water, Environment & Climate Change (`water`)

| Dataset | Items | Details |
|---------|-------|---------|
| **Leadership** | 2 | Minister, Permanent Secretary |
| **Entity Officers** | 1 | Forestry |
| **Recurring Obligations** | 5 | NWC Transfer, National Environment Fund, Climate Fund Contributions, Health Insurance Contributions, Forestry Conservation Levy |
| **Operational Entities** | 5 | Core Ministry Divisions, Forestry Department, Water Resources Authority, Climate Change Division, NEPA |
| **Capital Projects** | 3 | Rural Water Supply Programme, Climate Resilience Infrastructure, Watershed Management Programme |
| **Revenue** | ❌ Empty | — |
| **Debt Service** | ❌ N/A | — |

### 17. Office of the Cabinet (`cabinet`)

| Dataset | Items | Details |
|---------|-------|---------|
| **Leadership** | 2 | Cabinet Secretary, Deputy Cabinet Secretary |
| **Entity Officers** | 1 | MIND |
| **Recurring Obligations** | 2 | MIND Transfer, Statutory Provisions |
| **Operational Entities** | 2 | Cabinet Office Operations, MIND |
| **Capital Projects** | 1 | Cabinet Office IT Modernisation |
| **Revenue** | ❌ Empty | — |
| **Debt Service** | ❌ N/A | — |

### 18. Ministry of Legal & Constitutional Affairs (`legal`)

| Dataset | Items | Details |
|---------|-------|---------|
| **Leadership** | 2 | Minister, Permanent Secretary |
| **Entity Officers** | 0 | — |
| **Recurring Obligations** | 1 | Statutory Legislative Provisions |
| **Operational Entities** | 2 | Legal Affairs Operations, Legislative Drafting & Review |
| **Capital Projects** | 1 | Legal Database Modernisation |
| **Revenue** | ❌ Empty | — |
| **Debt Service** | ❌ N/A | — |

---

## Summary Counts

| Ministry | Slug | Leadership | Entity Officers | Obligations | Entities | Projects | Revenue | Debt Service |
|----------|------|:----------:|:---------------:|:-----------:|:--------:|:--------:|:-------:|:------------:|
| Finance & Public Service | `mof` | 4 | 7 | 7 | 9 | 5 | ✅ | ✅ |
| Education | `education` | 3 | 2 | 7 | 9 | 4 | — | — |
| Health & Wellness | `health` | 4 | 5 | 4 | 6 | 3 | — | — |
| National Security & Peace | `national-security` | 3 | 5 | 3 | 6 | 2 | — | — |
| Office of the Prime Minister | `opm` | 3 | 3 | 4 | 4 | 2 | — | — |
| Energy, Transport & Telecom | `energy-transport` | 2 | 1 | 4 | 4 | 3 | — | — |
| Local Government & Community Dev | `local-govt` | 2 | 1 | 3 | 5 | 2 | — | — |
| Labour & Social Security | `labour` | 3 | 1 | 3 | 5 | 2 | — | — |
| Economic Growth & Job Creation | `economic-growth` | 3 | 4 | 3 | 5 | 5 | — | — |
| Justice & Constitutional Affairs | `justice` | 2 | 4 | 3 | 6 | 2 | — | — |
| Tourism | `tourism` | 2 | 2 | 4 | 3 | 2 | — | — |
| Agriculture, Fisheries & Mining | `agriculture` | 3 | 1 | 6 | 5 | 4 | — | — |
| Foreign Affairs & Foreign Trade | `foreign-affairs` | 2 | 0 | 4 | 6 | 2 | — | — |
| Industry, Investment & Commerce | `industry` | 2 | 1 | 5 | 5 | 2 | — | — |
| Culture, Gender, Entertainment & Sport | `culture` | 2 | 1 | 5 | 5 | 2 | — | — |
| Water, Environment & Climate Change | `water` | 2 | 1 | 5 | 5 | 3 | — | — |
| Office of the Cabinet | `cabinet` | 2 | 1 | 2 | 2 | 1 | — | — |
| Legal & Constitutional Affairs | `legal` | 2 | 0 | 1 | 2 | 1 | — | — |
| **TOTALS** | | **46** | **40** | **73** | **92** | **47** | **1** | **1** |

---

## Data Sources

| Source | What it provides |
|--------|-----------------|
| **Estimates of Expenditure 2026-27 (PDF)** | Allocations, head codes, entity names, obligation names, project names, establishment posts, prior year estimates |
| **Estimates of Expenditure 2025-26 (PDF)** | Historical allocations, 2023-24 actuals, 2024-25 approved/revised estimates |
| **Mock generation (helpers.ts)** | Monthly actuals (cumulative time series), KPI actuals, payment statuses, project progress |
| **Manual research** | Minister names, PS names, entity head names, avatar images |

---

## Gaps & Future Data Needs

1. **Revenue data** — Only MOF has populated revenue. Ministries with revenue-generating entities (e.g. Customs under MOF, NLA under Economic Growth) should have real revenue targets and actuals.
2. **Debt service** — Only MOF has debt service summary. This is correct since debt is centrally managed by Finance.
3. **Entity officers** — Foreign Affairs and Legal have 0 entity officers. All other ministries have at least 1. Names should be verified and updated with real personnel.
4. **KPI targets** — Currently mock. Need real performance targets from ministry corporate plans.
5. **Project milestones** — Currently mock. Need real milestone schedules from project implementation units.
6. **Actuals time series** — Currently mock-generated. To be replaced with real expenditure uploads.
7. **Avatar images** — Only MOF has real photos. All other ministries use placeholder avatars.
