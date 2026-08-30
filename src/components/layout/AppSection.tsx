import type { ReactNode } from 'react';

export function AppSection({
  id, number, title, children,
}: { id: string; number: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="app-section" aria-labelledby={id + '-h'}>
      <div className="section-heading">
        <span className="section-number">{number}</span>
        <h2 id={id + '-h'}>{title}</h2>
      </div>
      {children}
    </section>
  );
}
