'use client';

import { StatusBadge } from '@/components/ui/StatusBadge';
import { YoYBadge } from '@/components/ui/YoYBadge';
import { SpendTimeSeries } from '@/components/charts/SpendTimeSeries';
import { TrendSparkline } from '@/components/charts/TrendSparkline';
import { formatCurrency, formatPct, formatNumber } from '@/lib/utils';
import { deriveObligationStatus } from '@/lib/status';
import type { Obligation, DebtObligation, PensionObligation, InsuranceObligation, MembershipObligation, TransferObligation } from '@/lib/types';

function isDebt(o: Obligation): o is DebtObligation {
  return o.type === 'debt_amortisation' || o.type === 'debt_interest';
}
function isPension(o: Obligation): o is PensionObligation {
  return o.type === 'pension';
}
function isInsurance(o: Obligation): o is InsuranceObligation {
  return o.type === 'insurance_premium' || o.type === 'health_insurance';
}
function isMembership(o: Obligation): o is MembershipObligation {
  return o.type === 'membership_fee';
}
function isTransfer(o: Obligation): o is TransferObligation {
  return o.type === 'public_body_transfer';
}

export function ObligationCard({ obligation, headless = false }: { obligation: Obligation; headless?: boolean }) {
  const o = obligation;
  const statusResult = deriveObligationStatus([{ status: o.paymentStatus }]);

  return (
    <article className={headless ? '' : 'border-t-2 border-border-strong pt-[var(--space-base)]'}>
      {!headless && (
        <div className="flex items-start justify-between mb-[var(--space-base)]">
          <div>
            <h3 className="font-bold text-[length:var(--text-h3)] text-text-primary">{o.name}</h3>
            <p className="text-[length:var(--text-caption)] text-text-secondary mt-[2px]">Head {o.headCode}</p>
          </div>
          <StatusBadge status={statusResult.status} tooltip={statusResult.tooltip} size="sm" />
        </div>
      )}

      <div className="grid grid-cols-2 gap-[var(--space-lg)] mb-[var(--space-base)]">
        <div>
          <p className="text-[length:var(--text-caption)] text-text-secondary">Annual Budget</p>
          <div className="flex items-baseline gap-[var(--space-sm)]">
            <p className="text-[length:var(--text-h2)] font-bold">{formatCurrency(o.allocation)}</p>
            <YoYBadge current={o.allocation} prior={o.priorYearAllocation} />
          </div>
        </div>
        <div>
          <p className="text-[length:var(--text-caption)] text-text-secondary">Paid to Date</p>
          <p className="text-[length:var(--text-h2)] font-bold">{formatCurrency(o.paid)}</p>
          <p className="text-[length:var(--text-caption)] text-text-secondary">{formatPct((o.paid / o.allocation) * 100)} utilized</p>
        </div>
      </div>

      {isDebt(o) && <DebtDetails details={o.details} />}
      {isPension(o) && <PensionDetails details={o.details} />}
      {isInsurance(o) && <InsuranceDetails details={o.details} />}
      {isMembership(o) && <MembershipDetails details={o.details} />}
      {isTransfer(o) && <TransferDetails details={o.details} />}

      {o.actuals.length > 0 && (
        <div className="mt-[var(--space-base)] pt-[var(--space-md)] border-t border-border-default">
          <p className="text-[length:var(--text-caption)] text-text-secondary mb-[var(--space-sm)]">Payment Progression</p>
          <SpendTimeSeries
            currentYear={o.actuals}
            priorYear={o.priorYearActuals}
            allocation={o.allocation}
            height={140}
            compact
          />
        </div>
      )}
    </article>
  );
}

function DebtDetails({ details }: { details: DebtObligation['details'] }) {
  return (
    <div className="space-y-[var(--space-md)]">
      <div className="grid grid-cols-2 gap-[var(--space-md)] text-[length:var(--text-body)]">
        <div>
          <p className="text-[length:var(--text-caption)] text-text-secondary">Domestic Paid</p>
          <p className="font-semibold">{formatCurrency(details.domesticPaid)}</p>
        </div>
        <div>
          <p className="text-[length:var(--text-caption)] text-text-secondary">External Paid</p>
          <p className="font-semibold">{formatCurrency(details.externalPaid)}</p>
        </div>
        <div>
          <p className="text-[length:var(--text-caption)] text-text-secondary">Payments Current</p>
          <p className="font-semibold">{details.paymentsCurrent}</p>
        </div>
        <div>
          <p className="text-[length:var(--text-caption)] text-text-secondary">Payments Overdue</p>
          <p className="font-semibold">{details.paymentsOverdue}</p>
        </div>
      </div>
      {details.weightedAvgRate !== undefined && (
        <div className="grid grid-cols-2 gap-[var(--space-md)] text-[length:var(--text-body)]">
          <div>
            <p className="text-[length:var(--text-caption)] text-text-secondary">Weighted Avg Rate</p>
            <p className="font-semibold">{formatPct(details.weightedAvgRate)}</p>
          </div>
          <div>
            <p className="text-[length:var(--text-caption)] text-text-secondary">Fixed vs Variable</p>
            <p className="font-semibold text-[length:var(--text-caption)]">{details.fixedVsVariable}</p>
          </div>
        </div>
      )}
      {details.outstandingStock > 0 && (
        <div className="text-[length:var(--text-body)]">
          <p className="text-[length:var(--text-caption)] text-text-secondary">Outstanding Stock</p>
          <p className="font-semibold">{formatCurrency(details.outstandingStock)}</p>
        </div>
      )}
      {details.fourYearTrend && (
        <div>
          <p className="text-[length:var(--text-caption)] text-text-secondary mb-[var(--space-xs)]">4-Year Projection</p>
          <TrendSparkline
            values={details.fourYearTrend}
            labels={['2026-27', '2027-28', '2028-29', '2029-30']}
          />
        </div>
      )}
    </div>
  );
}

function PensionDetails({ details }: { details: PensionObligation['details'] }) {
  return (
    <div className="space-y-[var(--space-md)]">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-[var(--space-md)] text-[length:var(--text-body)]">
        <div>
          <p className="text-[length:var(--text-caption)] text-text-secondary">Total Pensioners</p>
          <p className="font-semibold">{formatNumber(details.pensionerCount)}</p>
        </div>
        <div>
          <p className="text-[length:var(--text-caption)] text-text-secondary">Arrears</p>
          <p className="font-semibold">{details.arrearsOutstanding === 0 ? 'None' : formatCurrency(details.arrearsOutstanding)}</p>
        </div>
        <div>
          <p className="text-[length:var(--text-caption)] text-text-secondary">YoY Growth</p>
          <p className="font-semibold">{formatPct(details.yoyGrowth)}</p>
        </div>
      </div>
      <div>
        <p className="text-[length:var(--text-caption)] text-text-secondary mb-[var(--space-sm)]">By Category</p>
        <div className="space-y-[var(--space-xs)]">
          {details.byCategory.map(cat => (
            <div key={cat.category} className="flex justify-between text-[length:var(--text-caption)]">
              <span className="text-text-secondary">{cat.category}</span>
              <span className="font-semibold">{formatNumber(cat.count)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function InsuranceDetails({ details }: { details: InsuranceObligation['details'] }) {
  return (
    <div>
      <p className="text-[length:var(--text-caption)] text-text-secondary mb-[var(--space-sm)]">Components</p>
      <div className="space-y-[var(--space-sm)]">
        {details.components.map(c => (
          <div key={c.name} className="flex items-center justify-between text-[length:var(--text-caption)]">
            <span className="text-text-secondary">{c.name}</span>
            <div className="flex items-center gap-[var(--space-sm)]">
              <span className="font-semibold">{formatCurrency(c.paid)} / {formatCurrency(c.budget)}</span>
              <span className={`w-[6px] h-[6px] rounded-full ${c.status === 'paid' ? 'bg-jm-green' : 'bg-gold'}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MembershipDetails({ details }: { details: MembershipObligation['details'] }) {
  return (
    <div>
      <p className="text-[length:var(--text-caption)] text-text-secondary mb-[var(--space-sm)]">Organizations</p>
      <div className="space-y-[var(--space-sm)]">
        {details.organizations.map(org => (
          <div key={org.name} className="flex items-center justify-between text-[length:var(--text-caption)]">
            <span className="text-text-secondary">{org.name}</span>
            <div className="flex items-center gap-[var(--space-sm)]">
              <span className="font-semibold">{formatCurrency(org.paid)} / {formatCurrency(org.budget)}</span>
              <span className={`w-[6px] h-[6px] rounded-full ${
                org.status === 'paid' ? 'bg-jm-green' : org.status === 'partial' ? 'bg-gold' : 'bg-border-strong'
              }`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TransferDetails({ details }: { details: TransferObligation['details'] }) {
  return (
    <div>
      <div className="mb-[var(--space-sm)]">
        <p className="text-[length:var(--text-caption)] text-text-secondary">Utilization</p>
        <p className="text-[length:var(--text-body)] font-semibold">{formatPct(details.utilizationPct)}</p>
      </div>
      <p className="text-[length:var(--text-caption)] text-text-secondary mb-[var(--space-sm)]">Entities</p>
      <div className="space-y-[var(--space-sm)] max-h-48 overflow-y-auto">
        {details.entities.map(e => (
          <div key={e.name} className="flex items-center justify-between text-[length:var(--text-caption)]">
            <span className="text-text-secondary truncate mr-[var(--space-sm)]">{e.name}</span>
            <div className="flex items-center gap-[var(--space-sm)] flex-shrink-0">
              <span className="font-semibold">{formatCurrency(e.transferred)} / {formatCurrency(e.budget)}</span>
              <span className={`w-[6px] h-[6px] rounded-full ${
                e.status === 'paid' ? 'bg-jm-green' : e.status === 'partial' ? 'bg-gold' : 'bg-border-strong'
              }`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
