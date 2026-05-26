// Shared UI primitives
const { useState, useEffect, useRef, useMemo, useCallback } = React;

function Badge({ kind = '', children, dot = false }) {
  return <span className={`badge ${kind}${dot ? ' dot' : ''}`}>{children}</span>;
}

function StatusBadge({ status }) {
  const cfg = {
    running: { cls: 'ok', label: 'Running', icon: 'circle-play' },
    idle: { cls: '', label: 'Idle', icon: 'pause' },
    stopped: { cls: 'ng', label: 'Stopped', icon: 'circle-stop' },
    maint: { cls: 'warn', label: 'Maintenance', icon: 'wrench' },
    calib: { cls: 'info', label: 'Calibrating', icon: 'target' },
  }[status] || { cls: '', label: status };
  return (
    <span className={`badge ${cfg.cls}`}>
      <span className={`status-dot ${status}`} />
      {cfg.label}
    </span>
  );
}

function Checkbox({ checked, indeterminate, onChange, size = 16 }) {
  return (
    <span
      className={`checkbox ${checked ? 'checked' : ''} ${indeterminate ? 'indeterminate' : ''}`}
      onClick={(e) => { e.stopPropagation(); onChange?.(!checked); }}
      style={{ width: size, height: size }}
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
    >
      {checked && <Icon name="check" size={12} strokeWidth={3} />}
      {indeterminate && !checked && <Icon name="minus" size={12} strokeWidth={3} />}
    </span>
  );
}

function ToggleGroup({ options, value, onChange, size }) {
  return (
    <div className="toggle-group">
      {options.map(o => (
        <button key={o.value || o} className={(value === (o.value || o)) ? 'on' : ''} onClick={() => onChange(o.value || o)}>
          {o.icon && <Icon name={o.icon} size={13} />} {o.label || o}
        </button>
      ))}
    </div>
  );
}

function Drawer({ open, onClose, children, width = 720 }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="scrim" onClick={onClose}>
      <div className="drawer" style={{ width }} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

function Modal({ open, onClose, children }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="modal" onClick={onClose}>
      <div className="box" onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  );
}

function ProgressBar({ value, max = 100, tone = 'accent' }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const color =
    tone === 'ok' ? 'var(--ok)' :
    tone === 'ng' ? 'var(--ng)' :
    tone === 'warn' ? 'var(--warn)' : 'var(--accent)';
  return (
    <div className="progress">
      <span style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

// Sticker thumbnail placeholder — striped chip with a sticker silhouette
function StickerThumb({ type = 'small', ng = false, defect = null, size = 'sm' }) {
  const sizes = { sm: { w: 56, h: 40 }, md: { w: 72, h: 56 }, lg: { w: 96, h: 76 } };
  const s = sizes[size];
  return (
    <div className={`thumb ${ng ? 'ng' : ''}`} style={{ width: s.w, height: s.h }}>
      <div style={{
        width: type === 'small' ? '60%' : '76%',
        height: type === 'small' ? '50%' : '64%',
        background: ng ? 'color-mix(in oklab, var(--ng) 14%, var(--surface))' : 'var(--surface)',
        border: '1px dashed var(--border-strong)',
        borderRadius: 4,
      }} />
      {ng && (
        <div className="corner">
          <span className="badge solid-ng" style={{ fontSize: 9, padding: '1px 4px' }}>NG</span>
        </div>
      )}
    </div>
  );
}

// Recharts color helpers — readable in light & dark
function useChartColors() {
  return useMemo(() => {
    const cs = getComputedStyle(document.documentElement);
    return {
      text: cs.getPropertyValue('--text-muted').trim(),
      grid: cs.getPropertyValue('--border').trim(),
      accent: cs.getPropertyValue('--accent').trim(),
      ok: cs.getPropertyValue('--ok').trim(),
      ng: cs.getPropertyValue('--ng').trim(),
      warn: cs.getPropertyValue('--warn').trim(),
      surface: cs.getPropertyValue('--surface').trim(),
    };
  }, []);
}

// Section header inside card-body
function SectionHead({ title, right, sub }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
      <div>
        <div style={{ fontWeight: 600, fontSize: 13.5 }}>{title}</div>
        {sub && <div className="faint text-xs">{sub}</div>}
      </div>
      <div style={{ flex: 1 }} />
      {right}
    </div>
  );
}

function EmptyState({ icon = 'inbox', title, sub, action }) {
  return (
    <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-faint)' }}>
      <Icon name={icon} size={28} />
      <div style={{ marginTop: 10, fontWeight: 500, color: 'var(--text-muted)' }}>{title}</div>
      {sub && <div className="text-xs mt-2">{sub}</div>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}

window.UI = { Badge, StatusBadge, Checkbox, ToggleGroup, Drawer, Modal, ProgressBar, StickerThumb, useChartColors, SectionHead, EmptyState };
