export function NoDataState({ context }: { context?: string }) {
  return (
    <div className="flex flex-col items-start py-[var(--space-4xl)] max-w-lg">
      <div className="w-10 h-10 rounded-full bg-gold-light flex items-center justify-center mb-[var(--space-lg)]">
        <svg className="w-5 h-5 text-gold-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
        </svg>
      </div>
      <h3 className="text-[length:var(--text-h2)] font-bold text-text-primary mb-[var(--space-sm)]">No Data Connected</h3>
      <p className="text-[length:var(--text-body)] text-text-secondary leading-relaxed max-w-md">
        {context
          ? `Upload a ${context} spreadsheet to populate this view. The data template is available for download.`
          : 'This view will populate once a ministry uploads their expenditure data. Enable mock data to see a demonstration.'}
      </p>
    </div>
  );
}
