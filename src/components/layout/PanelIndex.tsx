import { navigate, routeHref, type Mode } from '../../lib/router';
import './layout.css';

export function PanelIndex({
  mode, panels, active, onNavigate,
}: { mode: Mode; panels: readonly { id: string; label: string }[]; active: string; onNavigate: (id: string) => void }) {
  return (
    <nav className="panel-index" aria-label="Indeks panel">
      <ol>
        {panels.map((p) => (
          <li key={p.id}>
            <a
              href={routeHref(mode, p.id)}
              className={active === p.id ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); navigate(mode, p.id); onNavigate(p.id); }}
            >
              {p.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
