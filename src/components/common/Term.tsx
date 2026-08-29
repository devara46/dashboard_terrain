import { useState } from 'react';
import { useVizConfig } from '../../context/VizConfigContext';
import './common.css';

export function Term({ id, children }: { id: string; children: React.ReactNode }) {
  const config = useVizConfig();
  const [open, setOpen] = useState(false);
  const def = config?.definitions[id];
  if (!def) return <>{children}</>;
  return (
    <span
      className="term"
      tabIndex={0}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      <sup className="term-mark">?</sup>
      {open && (
        <span role="tooltip" className="term-tooltip">
          <strong>{id}</strong> — {def}
        </span>
      )}
    </span>
  );
}
