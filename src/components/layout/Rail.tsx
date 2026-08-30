import { navigate, routeHref, RINGKASAN_SECTIONS, DASAR_BUKTI_SECTIONS } from '../../lib/router';
import './layout.css';

export function Rail({ active }: { active: string }) {
  return (
    <nav className="rail" aria-label="Navigasi bagian">
      <div className="rail-group">
        <span className="rail-group-label">Ringkasan</span>
        <ol>
          {RINGKASAN_SECTIONS.map((s) => (
            <li key={s.id}>
              <a
                href={routeHref(s.id)}
                className={active === s.id ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); navigate(s.id); }}
              >
                {s.label}
              </a>
            </li>
          ))}
        </ol>
      </div>
      <div className="rail-boundary">Dasar bukti</div>
      <div className="rail-group">
        <ol>
          {DASAR_BUKTI_SECTIONS.map((s) => (
            <li key={s.id}>
              <a
                href={routeHref(s.id)}
                className={active === s.id ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); navigate(s.id); }}
              >
                {s.label}
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
