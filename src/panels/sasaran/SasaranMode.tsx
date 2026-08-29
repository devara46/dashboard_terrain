import { useEffect } from 'react';
import { PanelG } from './PanelG';
import { PanelH } from './PanelH';
import { PanelI } from './PanelI';
import { navigate } from '../../lib/router';

export function SasaranMode({ activePanel, param }: { activePanel: string; param: string | null }) {
  useEffect(() => {
    if (activePanel === 'desa') return;
    const el = document.getElementById(activePanel);
    if (el) el.scrollIntoView({ behavior: 'auto', block: 'start' });
  }, [activePanel]);

  return (
    <div className="panel-stack">
      <PanelG />
      <PanelI />
      {activePanel === 'desa' && param && (
        <PanelH village_id={param} onClose={() => navigate('sasaran', 'daftar-prioritas')} />
      )}
    </div>
  );
}
