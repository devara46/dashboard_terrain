import type { ReactNode } from 'react';
import './common.css';

export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label={title}>
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal-box">
        <div className="modal-head">
          <h3>{title}</h3>
          <button className="card-close" onClick={onClose} aria-label="Tutup">×</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
