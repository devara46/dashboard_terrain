import { useEffect } from 'react';
import { PanelA } from './PanelA';
import { PanelB } from './PanelB';
import { PanelC } from './PanelC';
import { PanelD } from './PanelD';
import { PanelE } from './PanelE';
import { PanelF } from './PanelF';

export function BuktiMode({ activePanel }: { activePanel: string }) {
  useEffect(() => {
    const el = document.getElementById(activePanel);
    if (el) el.scrollIntoView({ behavior: 'auto', block: 'start' });
  }, [activePanel]);

  return (
    <div className="panel-stack">
      <PanelA />
      <PanelB />
      <PanelC />
      <PanelD />
      <PanelE />
      <PanelF />
    </div>
  );
}
