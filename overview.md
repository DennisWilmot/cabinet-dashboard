# Jamaica Cabinet Budget Dashboard — Technical Specification

## Project background

The Government of Jamaica publishes a document called the **Estimates of Expenditure** every fiscal year. For 2026-27, this is a 716-page PDF covering every ministry, department, and agency — line-by-line spending authorizations passed in the House of Representatives on March 24, 2026. It is prepared by the Ministry of Finance and the Public Service.

The Estimates document tells you **what was planned**. It does not tell you what actually happened. There is no public-facing system that tracks actual expenditure against the budget in real time.

**We are building that system.**

The product is a **Cabinet Dashboard** — a web application that Jamaica's cabinet ministers pull up on Monday nights when cabinet meets. They see every ministry's budget, how much has been spent, whether things are on track, and where the problems are. Each ministry gets its own dashboard view. We are prototyping with the **Ministry of Finance** first.

The ultimate workflow is: each week, someone from a ministry uploads a spreadsheet with actual figures. The dashboard updates. Cabinet sees reality vs plan.

For now, we are building with **mock data** derived from the real Estimates document. The mock data toggle lets us show the prototype with simulated actuals, and turn it off to show the empty "no data connected" state. This is for demonstration purposes — to show government stakeholders what the system will look like and what data they need to provide.

---

## Why the Ministry of Finance first

Finance is the most complex ministry in the budget. It has 9 budget heads, J$583.4B in total allocation (recurrent + capital), and three fundamentally different types of spending: fixed obligations (debt, pensions, insurance), operational programmes (tax collection, statistics, planning), and capital projects. If the dashboard design works for Finance, it works for every other ministry — they are all simpler.

Finance also has a unique dimension no other ministry has: **revenue collection**. TAJ and Jamaica Customs are the government's cash register. Cabinet needs to see both sides — what Finance spent and what it collected.

---

## Key design decisions and rationale

### 1. Three-bucket spending split

Not all government spending behaves the same way. Debt payments happen on a contractual schedule. Staff salaries and office costs flow continuously. Capital projects have milestones and end dates. Treating them all the same (one big utilization bar) hides more than it reveals.

**Decision:** Split the Ministry of Finance's budget into three buckets:
- **Fixed obligations (~78% of budget):** Debt servicing, pensions, health insurance contributions, catastrophe insurance, international membership fees, public body transfers. These are contractual or legal. The tracking question is binary: are payments current?
- **Operational programmes (~18% of budget):** TAJ, Customs, Accountant General, PIOJ, STATIN, PPC, Financial Investigations, Revenue Protection, and the core ministry divisions. These are ongoing operations. The tracking question is: are they spending on pace and delivering on KPIs?
- **Capital projects (~3% of budget, but high visibility):** 5 discrete projects with timelines, milestones, and funding partners. The tracking question is: are milestones being hit on time and on budget?

**Why:** A cabinet minister looking at Finance doesn't need to manage debt payments — they just need to know it's current. But they do need to dig into why TAJ's compliance rate is below target, or why the RAIS upgrade procurement is delayed. The three buckets surface the right information at the right altitude.

### 2. Schema Approach 3 — Universal core + typed extensions

**Decision:** Use a small number of universal tables (budget lines, expenditure actuals, projects, milestones, staffing, KPIs) that every ministry shares, plus a typed `obligations` table and a `revenue_collections` table for ministry-specific data. This is not full EAV (entity-attribute-value) — every table has real typed columns. But the obligations table is generic enough that Finance's debt payments and Education's school feeding programme can live in the same structure.

**Why:** We need to move fast across 16+ ministries. If every ministry gets bespoke tables, the system becomes unmaintainable. But if we go fully generic (EAV), we lose type safety and the dashboard code becomes impossible to reason about. Approach 3 gives us structure where it matters (expenditure, projects, KPIs) and flexibility where ministries diverge (obligations, revenue).

### 3. Mock data toggle

**Decision:** The dashboard has a toggle that switches between mock data (on by default) and live data (empty until ministries upload). When mock data is off, the dashboard shows a clean empty state explaining what data is needed.

**Why:** We need to demo this to government stakeholders before any ministry has uploaded a single spreadsheet. The mock data is realistic — derived from actual figures in the 2026-27 Estimates — so the demo feels real. The toggle makes it honest: "this is what it will look like, and here's what we need from you to make it live."

### 4. Weekly spreadsheet upload as data ingestion

**Decision:** The primary data input is a spreadsheet upload. Each ministry downloads a template, fills in their actuals for the reporting period, and uploads it. The system validates against the budget structure and updates the dashboard.

**Why:** This matches how government actually works. Ministries already produce expenditure reports from their FMIS. Asking them to export a spreadsheet is a low-friction ask. Building a full API integration with FMIS is a Phase 2 concern — for Phase 1, spreadsheets get us live data fastest.

---

## Dashboard structure — all levels and cards

### Level 0 — Cabinet overview

A grid of ministry cards. Each card shows:
- Ministry name
- Total allocation (single number)
- Budget utilization % with progress bar
- Status badge (on-track / at-risk / off-track)

Click any ministry card to enter that ministry's Level 1 view.

For the prototype, only Finance is interactive. Other ministries show as grayed-out placeholder cards with plausible numbers.

**Placeholder ministry data for cabinet grid:**

| Ministry | Budget | Utilization | Status |
|---|---|---|---|
| Finance & Public Service | J$583.4B | 49.2% | At risk |
| Education, Skills, Youth & Info | J$217.3B | 52.1% | On track |
| Health & Wellness | J$189.1B | 47.8% | At risk |
| National Security & Peace | J$123.9B | 50.4% | On track |
| Economic Growth & Infrastructure | J$18.6B | 44.2% | At risk |
| Justice & Constitutional Affairs | J$21.8B | 51.0% | On track |
| Labour & Social Security | J$14.2B | 48.6% | On track |
| Agriculture, Fisheries & Mining | J$12.8B | 42.1% | At risk |

---

### Level 1 — Ministry of Finance summary bar

Three metric cards across the top:

#### Card 1: Total allocation
| Metric | Composition | Value |
|---|---|---|
| Total allocation | `SUM(approved_estimate)` across all heads (20000–20061), both recurrent and capital | J$583.4B |
| Recurrent subtotal | `SUM(approved_estimate) WHERE budget_type = 'recurrent'` | J$565.5B |
| Capital subtotal | `SUM(approved_estimate) WHERE budget_type = 'capital'` | J$17.9B |

#### Card 2: Budget utilization
| Metric | Composition | Value |
|---|---|---|
| Total spent | `SUM(actual_expenditure)` across all heads | Mock: J$287.3B |
| Utilization % | `total_spent / total_approved × 100` | Mock: 49.2% |
| Expected utilization % | `(months_elapsed / 12) × 100` — reporting period is Sept 2026 = 6 months | 50.0% |
| Pace indicator | `IF utilization% > (expected% + 10) → "Ahead" ELIF utilization% < (expected% - 10) → "Behind" ELSE → "On pace"` | On pace |

#### Card 3: Revenue performance (unique to Finance)
| Metric | Composition | Value |
|---|---|---|
| Total collected YTD | `SUM(cumulative_collected)` across TAJ + Customs + Revenue Protection | Mock: J$613.2B |
| YTD target | `SUM(cumulative_target)` | Mock: J$599.8B |
| Variance | `collected - target` | +J$13.4B |
| Variance % | `(collected - target) / target × 100` | +2.2% |
| Split bar | Stacked bar showing TAJ vs Customs vs RPD proportions | TAJ: 67.2%, Customs: 32.3%, RPD: 0.5% |

---

### Level 2 — Three bucket summary cards

These sit below the Level 1 bar. Each is clickable to drill into Level 3.

#### Bucket card: Fixed obligations
| Metric | Composition | Value |
|---|---|---|
| Total allocation | Sum of: Head 20017 + 20018 + 20019 + activities 10451, 11808, 10007, 10660, 10882 | ~J$444B |
| Total paid | Actual expenditure across the same scope | Mock: ~J$247B |
| % of ministry budget | `fixed_total / ministry_total × 100` | ~78% |
| Obligations current | `COUNT(*)` where `payment_status IN ('current','paid')` across debt, pensions, transfers | Mock: 58 |
| Obligations overdue | `COUNT(*)` where `payment_status = 'overdue'` | Mock: 0 |
| Status badge | `IF overdue_count = 0 → "All current" ELSE → "X overdue"` | All current |

**Scope definition — what budget lines are IN this bucket:**
- Head 20017 (Debt Amortisation) — entire head, J$167.6B
- Head 20018 (Debt Interest) — entire head, J$211.0B
- Head 20019 (Pensions) — entire head, J$50.3B
- Head 20000, Programme 138, Activity 10451 (Health Insurance) — J$8.5B
- Head 20000, Programme 137, Activity 11808 (Catastrophe Insurance) — J$4.5B
- Head 20000, Programme 137, Activity 10007 (International Memberships) — J$2.2B
- Head 20000, Programme 137, Activity 10660 (NHT + Municipal Corporations) — J$4.6B
- Head 20000, Programme 137, Activity 10882 (Public Body Transfers) — J$16.0B

#### Bucket card: Operational programmes
| Metric | Composition | Value |
|---|---|---|
| Total allocation | `ministry_recurrent_total - fixed_obligations_total` (i.e. everything recurrent that isn't fixed obligations) | ~J$104B |
| Total spent | Same subtraction on actuals | Mock: ~J$32B |
| Utilization % | `ops_spent / ops_allocated × 100` | Mock: ~31% |
| Entities count | Static: 9 | 9 |
| Entities on track | Entities within ±10% of expected pace | Mock: 6 |
| Total filled posts | `SUM(filled_posts)` across ops scope | Mock: 6,793 |
| Vacancy rate | `SUM(vacant) / SUM(approved_posts) × 100` | Mock: 11.8% |

**Scope — what's IN this bucket:**
- Head 20000, recurrent, MINUS the fixed obligation activities listed above (Programmes 001, 132, 137 operational lines, 138 non-health, 142, 144)
- Head 20011 (Accountant General)
- Head 20012 (Jamaica Customs Agency)
- Head 20056 (Tax Administration Jamaica)
- Head 20060 (Financial Investigations Division)
- Head 20061 (Revenue Protection Department)

#### Bucket card: Capital projects
| Metric | Composition | Value |
|---|---|---|
| Total allocation | `SUM(approved_estimate) WHERE budget_type = 'capital' AND head = '20000'` | J$17.9B |
| Total spent | `SUM(current_year_spend)` across 5 projects | Mock: J$583.8M |
| Projects count | Static: 5 | 5 |
| On track | `COUNT(*) WHERE status = 'on_track'` | Mock: 3 |
| Delayed / at-risk | `COUNT(*) WHERE status IN ('delayed','at_risk')` | Mock: 1 |
| Avg physical progress | `AVG(physical_progress_pct)` excluding contingency (21686) | Mock: 35% |

**Scope — what's IN this bucket:**
- Head 20000C — all capital lines
- Projects: 21686, 29399, 29571, 29601, 29602

---

### Level 3 — Fixed obligations drill-down (7 cards)

#### Card: Debt amortisation
Head 20017 · J$167.6B

| Metric | Composition | Mock value |
|---|---|---|
| Annual budget | `SUM(approved_estimate) WHERE head = '20017'` | J$167,590M |
| Paid to date | `SUM(amount_paid) WHERE payment_type = 'amortisation'` | J$89,246M |
| Domestic paid | `SUM(amount_paid) WHERE domestic_external = 'domestic' AND payment_type = 'amortisation'` | J$52,340M |
| External paid | `SUM(amount_paid) WHERE domestic_external = 'external' AND payment_type = 'amortisation'` | J$36,906M |
| Payments current | `COUNT(*) WHERE payment_status = 'current'` | 42 |
| Payments overdue | `COUNT(*) WHERE payment_status = 'overdue'` | 0 |
| Next major maturity | `MIN(maturity_date) WHERE outstanding_balance > threshold` | 2026-11-15 |
| Outstanding stock | `SUM(outstanding_balance)` | J$2,847B |
| 4-year trend | Approved estimates 2026-27 through 2029-30 from Estimates doc | [167.6, 254.0, 339.2, 141.9] |

#### Card: Debt interest
Head 20018 · J$211.0B

| Metric | Composition | Mock value |
|---|---|---|
| Annual budget | `SUM(approved_estimate) WHERE head = '20018'` | J$210,956M |
| Paid to date | `SUM(amount_paid) WHERE payment_type = 'interest'` | J$109,697M |
| Domestic paid | Filtered by domestic_external | J$71,802M |
| External paid | Filtered by domestic_external | J$37,895M |
| Weighted avg rate | `SUM(rate × balance) / SUM(balance)` | 6.8% |
| Fixed vs variable | `SUM(balance) GROUP BY rate_type` as percentages | 72% fixed / 28% variable |
| 4-year trend | From Estimates | [211.0, 202.7, 187.3, 174.9] — declining |

#### Card: Pensions
Head 20019 · J$50.3B

| Metric | Composition | Mock value |
|---|---|---|
| Annual budget | Approved estimate | J$50,261M |
| Disbursed to date | `SUM(actual_disbursed)` | J$24,626M |
| Utilization % | `disbursed / budget × 100` | 49.0% |
| Total pensioner count | `SUM(pensioner_count)` | 48,720 |
| By category | `GROUP BY pension_category` | Civil Service: 22,400 / Teachers: 14,800 / Police: 6,200 / Military: 3,120 / Other: 2,200 |
| Arrears outstanding | `SUM(arrears)` | J$0 |
| YoY growth | `(current_budget - prior_actual) / prior_actual × 100` | 10.8% |

#### Card: Health insurance contributions
Programme 138, Activity 10451 · J$8.5B

| Metric | Composition | Mock value |
|---|---|---|
| Annual budget | Approved estimate for activity 10451 | J$8,475M |
| Transferred to date | `SUM(amount_transferred)` | J$4,238M |
| GEASO | Budget J$8,399M | Paid: J$4,200M · Status: paid |
| GPASO | Budget J$42M | Paid: J$21M · Status: paid |
| Senior Managers | Budget J$34.2M | Paid: J$17.1M · Status: paid |

#### Card: Catastrophe insurance
Programme 137, Activity 11808 · J$4.5B

| Metric | Composition | Mock value |
|---|---|---|
| Annual budget | Approved estimate | J$4,487M |
| CCRIF premium | Budget J$2,323M | Paid: J$2,323M · Status: paid |
| CAT Bond premium | Budget J$2,164M | Paid: J$2,164M · Status: paid |
| Status | All premiums paid in full (annual payments typically made early in FY) | Fully paid |

#### Card: International memberships
Programme 137, Activity 10007 · J$2.2B

| Metric | Composition | Mock value |
|---|---|---|
| Annual budget | Approved estimate | J$2,234M |
| Total paid | `SUM(amount_transferred)` | J$1,489M |
| Per org breakdown | `GROUP BY recipient_entity` | CDB: J$703M (paid) · IFC: J$757M (J$378M paid, partial) · IDB: J$340M (J$170M paid, partial) · IIC: J$319M (J$160M paid, partial) · MIF IV: J$59M (paid) · CFTC: J$36M (pending) · CARTAC: J$15M (paid) · ECLAC: J$5M (J$4.5M paid, partial) |
| Overdue count | `COUNT(*) WHERE status = 'overdue'` | 0 |

#### Card: Public body transfers
Activities 10660 + 10882 · J$20.5B

| Metric | Composition | Mock value |
|---|---|---|
| Annual budget | `SUM(approved)` for activities 10660 + 10882 | J$20,547M |
| Total transferred | `SUM(amount_transferred)` | J$13,247M |
| Utilization % | `transferred / budget × 100` | 64.5% |
| Per entity | See below | |

Entity breakdown:
| Entity | Budget (J$M) | Transferred (J$M) | Status |
|---|---|---|---|
| Airports Authority of Jamaica | 13,000 | 6,500 | Partial |
| Students' Loan Bureau (SET) | 1,000 | 1,000 | Paid |
| Students' Loan Bureau (STEM) | 750 | 750 | Paid |
| Students' Loan Bureau (Debt Reset) | 500 | 500 | Paid |
| Municipal Corporations | 3,200 | 3,200 | Paid |
| NHT | 1,379 | 689 | Partial |
| Jamaica Racing Commission | 380 | 380 | Paid |
| Casino Gaming Commission | 250 | 190 | Partial |
| Others | 88 | 38 | Partial |

---

### Level 3 — Operational programmes drill-down (9 cards)

Every operational card shares a common structure:

**Common fields (all 9 cards):**
| Metric | Composition |
|---|---|
| Allocation | `SUM(approved_estimate) WHERE head = X` |
| Spent to date | `SUM(actual_expenditure) WHERE head = X` |
| Utilization % | `spent / allocation × 100` |
| Approved posts | From staffing dataset |
| Filled posts | From staffing dataset |
| Vacancy rate % | `vacant / approved × 100` |

**Entity-specific fields listed below each card.**

#### Card: Tax Administration Jamaica
Head 20056 · J$25.5B

| Metric | Composition | Mock value |
|---|---|---|
| Allocation | Head 20056 approved | J$25,501M |
| Spent | Head 20056 actual | J$12,496M |
| Utilization | 49.0% | 49.0% |
| Filled / approved posts | 3,240 / 3,600 | Vacancy: 10.0% |
| Tax collected YTD | `SUM(cumulative_collected) WHERE entity = 'TAJ'` | J$412,000M |
| Collection vs target | `collected - target` | +J$7,000M (+1.7%) |
| By tax type | `GROUP BY revenue_type` | Income tax, GCT, SCT, stamp duty, etc. |
| Taxpayer compliance rate | KPI actual vs target | 74.2% / 78.0% — at risk |
| Tax-to-GDP ratio | KPI | 27.1% / 27.5% — on track |
| E-filing adoption | KPI | 62% / 65% — on track |
| Cost of collection | `expenditure / revenue_collected × 100` | 3.03% |

#### Card: Jamaica Customs Agency
Head 20012 · J$23.8B · Self-funded via A-in-A

| Metric | Composition | Mock value |
|---|---|---|
| Allocation / spent / utilization | Standard | J$23,768M / J$12,360M / 52.0% |
| Filled / approved posts | 1,860 / 2,100 | Vacancy: 11.4% |
| Revenue collected | `SUM(cumulative_collected) WHERE entity = 'Customs'` | J$198,000M |
| Revenue vs target | Variance | +J$6,000M (+3.1%) |
| Self-funding ratio | `customs_revenue / customs_expenditure × 100` | 104.2% |
| Contribution to GDP | KPI | 37.8% / 39.0% — at risk |
| Cargo clearance time | KPI | 4.3 hrs / 4.0 hrs — at risk |
| Detection rate | KPI | 13.5% / 12.0% — on track |

#### Card: Accountant General
Head 20011 · J$1.8B

| Metric | Composition | Mock value |
|---|---|---|
| Allocation / spent / utilization | Standard | J$1,834M / J$898M / 49.0% |
| Filled / approved posts | 310 / 340 | Vacancy: 8.8% |
| Financial reports on time | KPI | 92% / 100% — at risk |
| Cash management improvement | KPI | 25% / 25% — on track |

#### Card: PIOJ (Planning Institute of Jamaica)
Programme 142, Sub-programme 20 · J$2.6B

| Metric | Composition | Mock value |
|---|---|---|
| Allocation | `SUM(approved) WHERE head='20000' AND prog='142' AND subprog='20'` | J$2,623M |
| Spent / utilization | Standard | J$1,286M / 49.0% |
| Filled / approved posts | 188 / 210 | Vacancy: 10.5% |
| Vision 2030 indicators tracked | KPI | 108 / 120 — on track |
| Policy advisories delivered | KPI | 9 / 18 — on track (annual) |

#### Card: STATIN (Statistical Institute of Jamaica)
Programme 142, Sub-programme 21 · J$3.1B

| Metric | Composition | Mock value |
|---|---|---|
| Allocation | `SUM(approved) WHERE head='20000' AND prog='142' AND subprog='21'` | J$3,087M |
| Spent / utilization | Standard | J$1,421M / 46.0% |
| Filled / approved posts | 420 / 480 | Vacancy: 12.5% |
| Statistical releases published | KPI | 22 / 48 — on track |
| Office relocation progress | KPI | 35% / 100% — at risk |

#### Card: Public Procurement Commission
Programme 144 · J$550M

| Metric | Composition | Mock value |
|---|---|---|
| Allocation / spent / utilization | Standard | J$550M / J$262M / 47.6% |
| Filled / approved posts | 62 / 72 | Vacancy: 13.9% |
| Contracts reviewed | KPI | 380 / 800 — on track |
| Procurement compliance rate | KPI | 86% / 90% — at risk |

#### Card: Core ministry divisions
Head 20000, Programmes 001 + 132 + 137 (operational lines only)

| Metric | Composition | Mock value |
|---|---|---|
| Total allocation | Programmes 001 + 132 + 137 operational sub-programmes, EXCLUDING activities 10007, 10097, 10099, 10660, 10882, 11808, 12824 | J$5,496M |
| Spent / utilization | Standard | J$2,637M / 48.0% |
| Filled / approved posts | 450 / 520 | Vacancy: 13.5% |
| Sub-division breakdown: | | |
| — Macrofiscal Policy (Prog 132) | Budget / spent | J$861M / J$412M |
| — Budget & Financial Mgmt (137/20) | Budget / spent | J$399M / J$196M |
| — Policy & Regulatory (137/21) | Budget / spent | J$617M / J$302M |
| — Public Bodies Oversight (137/23) | Budget / spent | J$218M / J$98M |
| — Executive Direction (Prog 001) | Budget / spent | J$3,401M / J$1,629M |

#### Card: Financial Investigations Division
Head 20060 · J$1.5B

| Metric | Composition | Mock value |
|---|---|---|
| Allocation / spent / utilization | Standard | J$1,464M / J$689M / 47.0% |
| Filled / approved posts | 185 / 220 | Vacancy: 15.9% |
| Investigations completed | KPI | 24 / 60 — at risk |
| Prosecutions referred | KPI | 5 / 15 — at risk |
| Assets frozen | KPI | J$1,340M / J$2,000M — on track |

#### Card: Revenue Protection Department
Head 20061 · J$514M

| Metric | Composition | Mock value |
|---|---|---|
| Allocation / spent / utilization | Standard | J$514M / J$247M / 48.0% |
| Filled / approved posts | 78 / 90 | Vacancy: 13.3% |
| Revenue recovered | `SUM(collected) WHERE entity = 'Revenue_Protection'` | J$3,200M |
| Revenue vs target | Variance | +J$400M (+14.3%) |
| Cases processed | KPI | 128 / 240 — on track |
| Recovery ratio | `revenue_recovered / expenditure` | 12.98x |

---

### Level 3 — Capital projects drill-down (5 cards)

Every project card shares a common structure:

**Common fields (all 5 cards):**
| Metric | Composition |
|---|---|
| Current year budget | `approved_estimate` for this project |
| Current year spent | `current_year_spend` |
| Total project cost | `total_project_cost` (lifetime) |
| Cumulative spend | `cumulative_spend` (all years) |
| Financial progress % | `cumulative_spend / total_project_cost × 100` |
| Physical progress % | `physical_progress_pct` from project status report |
| Start date | `start_date` |
| Original end date | `original_end_date` |
| Revised end date | `revised_end_date` (null if unchanged) |
| Status | Enum: on_track, delayed, at_risk, completed, not_started |
| Risk level | Enum: low, moderate, high |
| Status narrative | Free text, 2-3 sentences |
| Milestone track | Visual progress dots from milestones sub-table |
| Funding sources | From disbursements sub-table |

#### Project: TAJ RAIS Upgrade
Code 29601 · J$1.09B (2026-27) · J$1.93B total · GOJ · Apr 2026 → Mar 2028

| Field | Mock value |
|---|---|
| Current year budget | J$1,089,600K |
| Current year spent | J$217,920K |
| Total project cost | J$1,932,335K |
| Cumulative spend | J$217,920K |
| Financial progress | 11.3% |
| Physical progress | 12% |
| Status | On track |
| Risk | Low |
| Narrative | Procurement of GenTax Core26 license completed. Configuration phase initiated. Vendor team on-site. |
| Funding | GOJ: committed J$1,932M, disbursed J$218M |

Milestones:
| Milestone | Planned | Status | Weight |
|---|---|---|---|
| GenTax Core26 license procurement | 2026-06-30 | Completed | 15% |
| Core26 installation & configuration | 2026-12-31 | In progress | 30% |
| CRM & queue system configuration | 2027-06-30 | Upcoming | 20% |
| User acceptance testing | 2027-09-30 | Upcoming | 20% |
| Training & go-live | 2028-02-28 | Upcoming | 15% |

#### Project: Public Sector Transformation Programme
Code 29602 · J$1.66B (2026-27) · J$8.72B total · GOJ + IDB · Apr 2025 → Mar 2030

| Field | Mock value |
|---|---|
| Current year budget | J$1,663,439K |
| Current year spent | J$315,053K |
| Total project cost | J$8,724,169K |
| Cumulative spend | J$404,301K |
| Financial progress | 4.6% |
| Physical progress | 8% |
| Status | On track |
| Risk | Moderate |
| Narrative | Institutional strengthening component progressing. IDB first disbursement received. HR module design underway. |

Funding:
| Source | Committed | Disbursed | Next tranche | Conditions |
|---|---|---|---|---|
| GOJ | J$5,200,000K | J$280,000K | — | — |
| IDB | J$3,524,169K | J$124,301K | 2027-01-15 | Completion of institutional assessment |

Milestones:
| Milestone | Planned | Status | Weight |
|---|---|---|---|
| Institutional assessment | 2026-09-30 | In progress | 15% |
| HR modernisation module | 2027-06-30 | Upcoming | 25% |
| Digital service delivery platform | 2028-03-31 | Upcoming | 30% |
| Change management rollout | 2029-06-30 | Upcoming | 20% |
| Evaluation & closure | 2030-03-31 | Upcoming | 10% |

Medium-term projection from Estimates: J$1.66B → J$2.04B → J$2.38B → J$2.64B

#### Project: Contingency Provision
Code 21686 · J$15.0B · GOJ · Annual reserve

| Field | Mock value |
|---|---|
| Current year budget | J$15,000,000K |
| Drawn down to date | J$0 |
| Remaining reserve | J$15,000,000K |
| Status | Not started (no drawdowns triggered) |
| Risk | Low |
| Narrative | No drawdowns triggered. Full reserve intact. |

**Note:** This card behaves differently — no milestones, no physical progress. It's a reserve fund. Show drawdown tracking and a narrative for what triggered any releases. The medium-term trajectory is notable: J$15.0B → J$21.6B → J$43.8B → J$57.9B (grows 4x).

#### Project: Hills to Ocean
Code 29571 · J$120M (2026-27) · J$580M total · GOJ + EU · Jan 2024 → Sep 2027

| Field | Mock value |
|---|---|
| Current year budget | J$119,957K |
| Current year spent | J$42,385K |
| Total project cost | J$580,000K |
| Cumulative spend | J$312,000K |
| Financial progress | 53.8% |
| Physical progress | 58% |
| Status | Delayed |
| Risk | Moderate |
| Narrative | Coastal assessment phase complete. Watershed management implementation delayed 3 months due to procurement. EU disbursement on track. |

Funding:
| Source | Committed | Disbursed | Next tranche | Conditions |
|---|---|---|---|---|
| GOJ | J$200,000K | J$142,000K | — | — |
| EU | J$380,000K | J$170,000K | 2026-12-01 | Q2 progress report submission |

Milestones:
| Milestone | Planned | Status | Weight |
|---|---|---|---|
| Coastal vulnerability assessment | 2025-06-30 | Completed | 25% |
| Watershed management plan | 2026-06-30 | Completed | 25% |
| Implementation phase 1 | 2026-12-31 | In progress | 30% |
| Monitoring & evaluation | 2027-06-30 | Upcoming | 20% |

#### Project: Agri & Coastal Resilience
Code 29399 · J$30M (2026-27) · J$120M total · GOJ · Jun 2024 → Mar 2027

| Field | Mock value |
|---|---|
| Current year budget | J$30,000K |
| Current year spent | J$8,400K |
| Total project cost | J$120,000K |
| Cumulative spend | J$78,000K |
| Financial progress | 65% |
| Physical progress | 62% |
| Status | On track |
| Risk | Low |
| Narrative | Soil conservation works ongoing in St. Thomas. Coastal planting programme on schedule. |
| Funding | GOJ: committed J$120,000K, disbursed J$78,000K |

Milestones:
| Milestone | Planned | Status | Weight |
|---|---|---|---|
| Site assessment | 2024-12-31 | Completed | 20% |
| Soil conservation works | 2026-06-30 | Completed | 30% |
| Coastal planting programme | 2026-12-31 | In progress | 30% |
| Evaluation & handover | 2027-03-31 | Upcoming | 20% |

---

## Database schema — Approach 3 (Universal core + typed extensions)

### Universal tables (every ministry uses these)

```sql
-- The budget structure itself — loaded from Estimates document
-- One row per budget line. This is the "plan" side.
CREATE TABLE budget_lines (
  id UUID PRIMARY KEY,
  fiscal_year VARCHAR(9) NOT NULL,           -- '2026-2027'
  ministry_id VARCHAR(10) NOT NULL,          -- 'MOF', 'MOE', 'MOH'
  head_code VARCHAR(10) NOT NULL,            -- '20000', '20011'
  head_name TEXT NOT NULL,
  programme_code VARCHAR(10),                -- '001', '132', '137'
  programme_name TEXT,
  subprogramme_code VARCHAR(10),             -- '20', '21', '22'
  activity_code VARCHAR(10),                 -- '10005', '10099'
  activity_name TEXT,
  object_code VARCHAR(5),                    -- '21', '22', '25', '27', '32'
  object_name TEXT,                          -- 'Compensation of Employees'
  budget_type VARCHAR(10) NOT NULL,          -- 'recurrent' | 'capital'
  approved_estimate DECIMAL(18,2) NOT NULL,  -- J$'000
  projected_2027_28 DECIMAL(18,2),
  projected_2028_29 DECIMAL(18,2),
  projected_2029_30 DECIMAL(18,2),
  UNIQUE(fiscal_year, head_code, programme_code, subprogramme_code, activity_code, object_code, budget_type)
);

-- Actual expenditure — uploaded monthly by ministry
-- One row per budget line per reporting period
CREATE TABLE expenditure_actuals (
  id UUID PRIMARY KEY,
  budget_line_id UUID REFERENCES budget_lines(id),
  reporting_period DATE NOT NULL,            -- month-end date, e.g. '2026-09-30'
  actual_expenditure DECIMAL(18,2),          -- cumulative YTD
  period_expenditure DECIMAL(18,2),          -- this month only
  revised_estimate DECIMAL(18,2),            -- if in-year adjustment
  warrants_issued DECIMAL(18,2),
  uploaded_at TIMESTAMP DEFAULT NOW(),
  uploaded_by TEXT,
  UNIQUE(budget_line_id, reporting_period)
);

-- Capital projects — loaded from Estimates, updated quarterly
CREATE TABLE projects (
  id UUID PRIMARY KEY,
  ministry_id VARCHAR(10) NOT NULL,
  project_code VARCHAR(10) NOT NULL,         -- '29601', '21686'
  project_name TEXT NOT NULL,
  budget_line_id UUID REFERENCES budget_lines(id),
  start_date DATE,
  original_end_date DATE,
  revised_end_date DATE,
  total_project_cost DECIMAL(18,2),
  current_year_budget DECIMAL(18,2),
  current_year_spend DECIMAL(18,2),
  cumulative_spend DECIMAL(18,2),
  physical_progress_pct DECIMAL(5,2),
  financial_progress_pct DECIMAL(5,2),
  status VARCHAR(20),                        -- 'on_track','delayed','at_risk','completed','not_started'
  risk_level VARCHAR(10),                    -- 'low','moderate','high'
  status_narrative TEXT,
  reporting_period DATE,
  UNIQUE(project_code, ministry_id)
);

-- Project milestones — multiple per project
CREATE TABLE milestones (
  id UUID PRIMARY KEY,
  project_id UUID REFERENCES projects(id),
  milestone_name TEXT NOT NULL,
  planned_date DATE,
  revised_date DATE,
  actual_date DATE,
  status VARCHAR(20),                        -- 'completed','in_progress','upcoming','delayed','cancelled'
  weight_pct DECIMAL(5,2),                   -- contribution to physical progress
  sort_order INT
);

-- Project funding sources — multiple per project
CREATE TABLE project_funding (
  id UUID PRIMARY KEY,
  project_id UUID REFERENCES projects(id),
  funding_source TEXT NOT NULL,              -- 'GOJ', 'IDB', 'EU', 'World Bank'
  committed_amount DECIMAL(18,2),
  disbursed_to_date DECIMAL(18,2),
  pending_amount DECIMAL(18,2),
  next_disbursement_date DATE,
  disbursement_conditions TEXT,
  reporting_period DATE
);

-- KPIs — loaded from Estimates (targets), updated quarterly (actuals)
CREATE TABLE kpis (
  id UUID PRIMARY KEY,
  ministry_id VARCHAR(10) NOT NULL,
  head_code VARCHAR(10),
  programme_code VARCHAR(10),
  kpi_name TEXT NOT NULL,
  kpi_type VARCHAR(10),                      -- 'output' | 'outcome'
  unit VARCHAR(20),                          -- '%', 'count', 'J$M', 'days', 'hrs'
  target_value DECIMAL(18,2),
  actual_value DECIMAL(18,2),
  prior_year_actual DECIMAL(18,2),
  status VARCHAR(20),                        -- 'on_track','at_risk','off_track','not_yet_due'
  reporting_period DATE,
  UNIQUE(ministry_id, head_code, kpi_name, reporting_period)
);

-- Staffing — updated quarterly
CREATE TABLE staffing (
  id UUID PRIMARY KEY,
  ministry_id VARCHAR(10) NOT NULL,
  head_code VARCHAR(10) NOT NULL,
  programme_code VARCHAR(10),
  approved_posts INT,
  filled_posts INT,
  vacant_posts INT,
  contract_officers INT,
  vacancy_rate_pct DECIMAL(5,2),
  reporting_period DATE,
  UNIQUE(ministry_id, head_code, programme_code, reporting_period)
);
```

### Typed extension tables (ministry-specific, but structured)

```sql
-- Obligations & transfers — generic enough for any ministry
-- Finance uses this for debt, insurance, memberships, public body transfers
-- Education would use it for school feeding contracts, textbook procurement
-- Health would use it for drug procurement, hospital supply contracts
CREATE TABLE obligations (
  id UUID PRIMARY KEY,
  ministry_id VARCHAR(10) NOT NULL,
  obligation_type VARCHAR(30) NOT NULL,      -- 'debt_amortisation','debt_interest','pension',
                                             -- 'insurance_premium','membership_fee',
                                             -- 'public_body_transfer','health_insurance',
                                             -- 'procurement_contract','grant_payment'
  instrument_id VARCHAR(50),                 -- unique ID for the instrument/contract
  instrument_name TEXT,
  counterparty TEXT,                         -- who receives the payment
  currency VARCHAR(5) DEFAULT 'JMD',
  domestic_external VARCHAR(10),             -- 'domestic' | 'external' (for debt)
  outstanding_balance DECIMAL(18,2),         -- for debt instruments
  interest_rate DECIMAL(5,2),                -- for debt
  rate_type VARCHAR(10),                     -- 'fixed' | 'variable'
  maturity_date DATE,
  budget_line_id UUID REFERENCES budget_lines(id),
  budgeted_amount DECIMAL(18,2),             -- full-year planned
  amount_due DECIMAL(18,2),                  -- amount due this period
  amount_paid DECIMAL(18,2),                 -- amount actually paid
  payment_date_actual DATE,
  scheduled_date DATE,
  payment_status VARCHAR(10),                -- 'current','paid','partial','overdue','pending'
  reporting_period DATE,
  UNIQUE(ministry_id, instrument_id, reporting_period)
);

-- Revenue collections — Finance-specific, but structured for reuse
-- Could extend to NHW (National Health Fund collections) or other revenue ministries
CREATE TABLE revenue_collections (
  id UUID PRIMARY KEY,
  ministry_id VARCHAR(10) NOT NULL,
  collecting_entity VARCHAR(30) NOT NULL,    -- 'TAJ','Customs','Revenue_Protection'
  revenue_type TEXT,                         -- 'income_tax','GCT','customs_duties','SCT','stamp_duty'
  target_amount DECIMAL(18,2),               -- target for the period
  actual_collected DECIMAL(18,2),            -- collected for the period
  cumulative_target DECIMAL(18,2),           -- YTD target
  cumulative_collected DECIMAL(18,2),        -- YTD actual
  reporting_period DATE,
  UNIQUE(ministry_id, collecting_entity, revenue_type, reporting_period)
);

-- Pension-specific detail (extension of obligations for richer data)
CREATE TABLE pension_details (
  id UUID PRIMARY KEY,
  obligation_id UUID REFERENCES obligations(id),
  pension_category TEXT,                     -- 'Civil Service','Teachers','Police','Military'
  pensioner_count INT,
  disbursed_amount DECIMAL(18,2),
  arrears_outstanding DECIMAL(18,2),
  reporting_period DATE
);
```

### Enum values

```
budget_type:        'recurrent' | 'capital'
obligation_type:    'debt_amortisation' | 'debt_interest' | 'pension' |
                    'insurance_premium' | 'membership_fee' | 'public_body_transfer' |
                    'health_insurance' | 'procurement_contract' | 'grant_payment'
payment_status:     'current' | 'paid' | 'partial' | 'overdue' | 'pending'
project_status:     'on_track' | 'delayed' | 'at_risk' | 'completed' | 'not_started'
risk_level:         'low' | 'moderate' | 'high'
milestone_status:   'completed' | 'in_progress' | 'upcoming' | 'delayed' | 'cancelled'
kpi_status:         'on_track' | 'at_risk' | 'off_track' | 'not_yet_due'
kpi_type:           'output' | 'outcome'
domestic_external:  'domestic' | 'external'
rate_type:          'fixed' | 'variable'
```

---

## Technical implementation — Next.js

### Stack
- **Next.js 14+** with App Router
- **TypeScript**
- **Tailwind CSS** for styling
- React state for mock data toggle (no backend needed for prototype)
- All mock data in a single `/lib/mock-data.ts` file matching the schema above

### Route structure
```
/                        → Cabinet overview (Level 0)
/ministry/[id]           → Ministry summary (Level 1 + Level 2)
/ministry/[id]/fixed     → Fixed obligations drill-down (Level 3)
/ministry/[id]/ops       → Operational programmes drill-down (Level 3)
/ministry/[id]/capital   → Capital projects drill-down (Level 3)
```

For the prototype, only `/ministry/mof` routes are functional.

### Component structure
```
components/
  layout/
    CabinetNav.tsx          — breadcrumb nav with mock data toggle
    DashboardShell.tsx      — page wrapper
  cards/
    MetricCard.tsx          — reusable: label, value, subtext
    BucketCard.tsx          — the three bucket summary cards
    ObligationCard.tsx      — individual fixed obligation
    EntityCard.tsx          — operational programme entity
    ProjectCard.tsx         — capital project with milestones
  ui/
    ProgressBar.tsx
    StatusBadge.tsx
    MilestoneTrack.tsx
    TrendSparkline.tsx      — mini line chart for 4-year trends
    FundingSplit.tsx         — stacked bar for GOJ/IDB/EU split
  empty/
    NoDataState.tsx         — shown when mock toggle is off
```

### Mock data toggle
- Global state via React Context or Zustand
- Toggle in the top nav bar
- When OFF: every page shows `<NoDataState />` explaining what data is needed
- When ON: pages render with mock data from `/lib/mock-data.ts`
- Default: ON

### Design direction
- Clean, authoritative, institutional feel — not startup-playful
- Warm neutral palette: cream/ivory backgrounds, dark text, green/amber/red for status
- Inspired by the screenshots provided (the "Digital Jamaica / Powered by Atlas" aesthetic)
- No purple gradients, no dark mode required for V1
- Typography: clean sans-serif, nothing decorative
- Generous whitespace, clear hierarchy
- Cards with subtle borders, not heavy shadows

### Reporting period
All mock data assumes a reporting period of **September 30, 2026** — the end of Q2 (6 months into the April 2026 – March 2027 fiscal year). This means:
- Expected utilization is ~50%
- Seasonal spending patterns may cause some items to be above or below 50%
- KPIs that are annual targets should be roughly 50% achieved
- Catastrophe insurance premiums are 100% paid (paid early in FY)

---

## What this spec does NOT cover (Phase 2+)

- Actual spreadsheet upload/validation pipeline
- User authentication and role-based access
- Backend API and database
- Other ministry dashboards (Education, Health, etc.)
- AI-powered risk analysis and pattern detection
- Historical trend comparison across fiscal years
- Export to PDF/CSV
- Mobile-responsive layout (desktop-first for cabinet setting)
- Real-time data integration with FMIS

---

## Source data reference

All plan-side numbers (approved estimates, projected estimates, programme structures, activity descriptions, project details, KPI targets) are extracted from:

**2026-2027 Estimates of Expenditure As Passed in the House of Representatives, 24th day of March 2026**
- Ministry of Finance and the Public Service
- Head 20000 (pages 226–269)
- Head 20000C Capital (pages 251–269)
- Head 20011 Accountant General (pages 270–274)
- Head 20012 Jamaica Customs Agency (pages 275–282)
- Head 20017 Public Debt Amortisation (pages 283–288)
- Head 20018 Public Debt Interest (pages 289–297)
- Head 20019 Pensions (pages 298–306)
- Head 20056 Tax Administration Jamaica (pages 307–311)
- Head 20060 Financial Investigations Division (pages 312–315)
- Head 20061 Revenue Protection Department (pages 316–318)

All mock "actual" values are simulated at approximately 48-52% of approved estimates to represent a mid-year reporting position, with realistic variations (catastrophe insurance at 100% because premiums are paid annually upfront, some KPIs slightly behind target, one capital project delayed).