import type { ReactNode } from 'react';

export function PanelSection({
  id, letter, title, children,
}: { id: string; letter: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="panel-section" aria-labelledby={id + '-h'}>
      <div className="panel-heading">
        <span className="panel-letter">{letter}</span>
        <h2 id={id + '-h'}>{title}</h2>
      </div>
      {children}
    </section>
  );
}
