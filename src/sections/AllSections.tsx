import { useEffect } from 'react';
import { Hero } from './Hero';
import { Section1 } from './Section1';
import { Section2 } from './Section2';
import { Section3 } from './Section3';
import { Section4 } from './Section4';
import { Section5 } from './Section5';
import { EvidenceBoundary } from './EvidenceBoundary';
import { Section6 } from './Section6';
import { Section7 } from './Section7';
import { Section8 } from './Section8';
import { Section9 } from './Section9';
import { Section10 } from './Section10';
import { Section11 } from './Section11';
import { Section12 } from './Section12';

export function AllSections({ activeSection }: { activeSection: string }) {
  useEffect(() => {
    const el = document.getElementById(activeSection);
    if (el) el.scrollIntoView({ behavior: 'auto', block: 'start' });
  }, [activeSection]);

  return (
    <div className="section-stack">
      <Hero />
      <Section1 />
      <Section2 />
      <Section3 />
      <Section4 />
      <Section5 />
      <EvidenceBoundary />
      <Section6 />
      <Section7 />
      <Section8 />
      <Section9 />
      <Section10 />
      <Section11 />
      <Section12 />
    </div>
  );
}
