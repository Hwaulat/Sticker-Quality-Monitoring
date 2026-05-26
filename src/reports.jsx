// Reports — Report builder
const { Badge: RBadge, ToggleGroup: RToggle } = window.UI;

function Reports() {
  const [step, setStep] = useState(2);
  const [selectedType, setSelectedType] = useState('daily');
  const [include, setInclude] = useState({ charts: true, tables: true, rootCause: true, photos: true, overrides: false });

  const types = [
    { id: 'shift', label: 'Shift Report', desc: 'End-of-shift summary auto-generated for supervisor', icon: 'clipboard-list', badge: 'Auto' },
    { id: 'daily', label: 'Daily Quality Report', desc: 'Daily yield, defects, lines and operator notes', icon: 'sun', badge: 'Most used' },
    { id: 'weekly', label: 'Weekly Summary', desc: 'Week trend, top defects, by line', icon: 'calendar-days', badge: '' },
    { id: 'monthly', label: 'Monthly Review', desc: 'Comprehensive monthly with customer breakdown', icon: 'calendar', badge: '' },
    { id: 'defect', label: 'Defect Analysis', desc: 'Deep dive into defect patterns & Pareto', icon: 'bug', badge: '' },
    { id: 'operator', label: 'Operator Performance', desc: 'Per-operator metrics (HR-restricted)', icon: 'user-round', badge: 'Restricted' },
    { id: 'spc', label: 'SPC Out-of-Control', desc: 'Periods outside statistical control limits', icon: 'activity', badge: '' },
  ];

  const recent = [
    { name: 'Daily Quality Report — 25 May 2026', status: 'Sent', when: '8h ago', size: '2.4 MB', kind: 'pdf' },
    { name: 'Shift 1 Report — 25 May 2026', status: 'Sent', when: '14h ago', size: '1.1 MB', kind: 'pdf' },
    { name: 'Weekly Summary — Week 21', status: 'Scheduled', when: 'In 2 days', size: '—', kind: 'xlsx' },
    { name: 'Defect Analysis — Line 02', status: 'Draft', when: '2d ago', size: '3.8 MB', kind: 'pdf' },
    { name: 'Monthly Review — April 2026', status: 'Sent', when: '24d ago', size: '6.2 MB', kind: 'pdf' },
  ];

  return (
    <div className="page">
      <div style={{ display: 'flex', alignItems: 'end', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em' }}>Reports</h1>
          <p className="muted" style={{ margin: '4px 0 0', fontSize: 13 }}>Generate, schedule, and distribute quality reports.</p>
        </div>
        <div className="stepper">
          {[{ id: 1, l: 'Type' }, { id: 2, l: 'Configure' }, { id: 3, l: 'Preview' }, { id: 4, l: 'Export' }].map((s, i) => (
            <React.Fragment key={s.id}>
              <div className={`step ${step === s.id ? 'current' : step > s.id ? 'done' : ''}`} onClick={() => setStep(s.id)}>
                <span className="num">{step > s.id ? '✓' : s.id}</span>
                <span>{s.l}</span>
              </div>
              {i < 3 && <Icon name="chevron-right" size={13} className="faint" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="grid-2" style={{ gridTemplateColumns: '1.25fr 1fr' }}>
        {/* LEFT — Wizard */}
        <div className="card">
          {step === 1 && (
            <div className="card-body">
              <h3 style={{ margin: '0 0 4px', fontSize: 16 }}>Choose a report type</h3>
              <p className="muted text-sm" style={{ margin: '0 0 14px' }}>Pick the report you want to generate.</p>
              <div className="report-types">
                {types.map(t => (
                  <div key={t.id} className={`report-type ${selectedType === t.id ? 'selected' : ''}`} onClick={() => setSelectedType(t.id)}>
                    <div className="row" style={{ alignItems: 'center' }}>
                      <div className="ico-bubble"><Icon name={t.icon} size={18} /></div>
                      <span style={{ flex: 1 }} />
                      {t.badge && <RBadge kind={t.badge === 'Restricted' ? 'ng' : t.badge === 'Auto' ? 'info' : 'accent'}>{t.badge}</RBadge>}
                    </div>
                    <h4>{t.label}</h4>
                    <p>{t.desc}</p>
                  </div>
                ))}
              </div>
              <div className="row gap-2 mt-4" style={{ marginTop: 16, justifyContent: 'flex-end' }}>
                <button className="btn primary" onClick={() => setStep(2)}>Continue <Icon name="arrow-right" size={14} /></button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="card-body">
              <h3 style={{ margin: '0 0 4px', fontSize: 16 }}>Configure parameters</h3>
              <p className="muted text-sm" style={{ margin: '0 0 14px' }}>{types.find(t => t.id === selectedType)?.label}</p>

              <div className="col gap-3">
                <Row label="Date range">
                  <div className="field" style={{ flex: 1 }}>
                    <Icon name="calendar" size={14} />
                    <span>26 May 2026 — Today</span>
                  </div>
                  <div className="toggle-group">
                    <button>Today</button>
                    <button className="on">Yesterday</button>
                    <button>This week</button>
                    <button>Custom</button>
                  </div>
                </Row>
                <Row label="Production line">
                  <div className="field" style={{ flex: 1 }}><Icon name="factory" size={14} /><span>All 6 lines</span><Icon name="chevron-down" size={13} /></div>
                </Row>
                <Row label="Sticker SKU">
                  <div className="field" style={{ flex: 1 }}><Icon name="sticker" size={14} /><span>All SKUs</span><Icon name="chevron-down" size={13} /></div>
                </Row>
                <Row label="Shift">
                  <div className="field" style={{ flex: 1 }}><Icon name="clock" size={14} /><span>All shifts</span><Icon name="chevron-down" size={13} /></div>
                </Row>
                <Row label="Customer">
                  <div className="field" style={{ flex: 1 }}><Icon name="building-2" size={14} /><span>PT Astra Honda, PT Yamaha Indonesia</span><Icon name="chevron-down" size={13} /></div>
                </Row>

                <div className="divider" />

                <div>
                  <div className="text-xs faint" style={{ textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 6 }}>Include sections</div>
                  <div className="col gap-2">
                    {[
                      { k: 'charts', l: 'Charts & visualizations', icon: 'bar-chart-3' },
                      { k: 'tables', l: 'Data tables', icon: 'table' },
                      { k: 'rootCause', l: 'Root cause analysis', icon: 'git-branch' },
                      { k: 'photos', l: 'Defect photos (sample)', icon: 'image' },
                      { k: 'overrides', l: 'Manual override audit log', icon: 'repeat' },
                    ].map(o => (
                      <label key={o.k} className="row gap-2" style={{ padding: 10, border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer' }}>
                        <span style={{ width: 28, height: 28, borderRadius: 7, background: 'var(--surface-2)', display: 'grid', placeItems: 'center', color: 'var(--accent)' }}>
                          <Icon name={o.icon} size={14} />
                        </span>
                        <span style={{ flex: 1, fontSize: 13 }}>{o.l}</span>
                        <Switch on={include[o.k]} onChange={(v) => setInclude(i => ({ ...i, [o.k]: v }))} />
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="row gap-2 mt-4" style={{ marginTop: 16, justifyContent: 'space-between' }}>
                <button className="btn ghost" onClick={() => setStep(1)}><Icon name="arrow-left" size={14} /> Back</button>
                <button className="btn primary" onClick={() => setStep(3)}>Preview <Icon name="arrow-right" size={14} /></button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="card-body">
              <h3 style={{ margin: '0 0 4px', fontSize: 16 }}>Preview</h3>
              <p className="muted text-sm" style={{ margin: '0 0 14px' }}>Rendered preview of the report PDF.</p>
              <ReportPreview />
              <div className="row gap-2 mt-4" style={{ marginTop: 16, justifyContent: 'space-between' }}>
                <button className="btn ghost" onClick={() => setStep(2)}><Icon name="arrow-left" size={14} /> Back</button>
                <button className="btn primary" onClick={() => setStep(4)}>Export options <Icon name="arrow-right" size={14} /></button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="card-body">
              <h3 style={{ margin: '0 0 4px', fontSize: 16 }}>Export & deliver</h3>
              <p className="muted text-sm" style={{ margin: '0 0 14px' }}>Choose a format or schedule a recurring delivery.</p>
              <div className="grid-3">
                <ExportTile icon="file-text" label="PDF" sub="Formatted with logo" tone="ng" />
                <ExportTile icon="file-spreadsheet" label="Excel" sub="Pivot + raw data" tone="ok" />
                <ExportTile icon="file" label="CSV" sub="Flat raw export" tone="info" />
              </div>
              <div className="divider" />
              <div className="col gap-3">
                <Row label="Schedule">
                  <div className="toggle-group"><button className="on">One-time</button><button>Daily</button><button>Weekly</button><button>Monthly</button></div>
                </Row>
                <Row label="Recipients">
                  <div className="field" style={{ flex: 1 }}><Icon name="mail" size={14} /><span>rina.k@pabrik.id, hendra.w@pabrik.id</span></div>
                </Row>
                <Row label="Subject line">
                  <div className="field" style={{ flex: 1 }}><Icon name="text" size={14} /><input defaultValue="Daily Quality Report — 26 May 2026" /></div>
                </Row>
              </div>
              <div className="row gap-2 mt-4" style={{ marginTop: 16, justifyContent: 'space-between' }}>
                <button className="btn ghost" onClick={() => setStep(3)}><Icon name="arrow-left" size={14} /> Back</button>
                <div className="row gap-2">
                  <button className="btn"><Icon name="save" size={14} /> Save as template</button>
                  <button className="btn primary"><Icon name="send" size={14} /> Generate & Send</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT — Recent reports */}
        <div className="card">
          <div className="card-head">
            <h3>Recent reports</h3>
            <span style={{ flex: 1 }} />
            <button className="btn xs ghost"><Icon name="bell" size={12} /> Subscriptions</button>
          </div>
          <div>
            {recent.map((r, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '36px 1fr auto', gap: 10, padding: '12px 16px', borderBottom: '1px solid var(--border)', alignItems: 'center', cursor: 'pointer' }}>
                <div style={{
                  width: 36, height: 44, borderRadius: 5,
                  background: r.kind === 'pdf' ? 'var(--ng-soft)' : 'var(--ok-soft)',
                  color: r.kind === 'pdf' ? 'var(--ng)' : 'var(--ok)',
                  display: 'grid', placeItems: 'center', fontSize: 9, fontWeight: 700, letterSpacing: '.08em',
                  border: '1px solid var(--border)'
                }}>
                  {r.kind.toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{r.name}</div>
                  <div className="text-xs faint">{r.when} · {r.size}</div>
                </div>
                <RBadge kind={r.status === 'Sent' ? 'ok' : r.status === 'Scheduled' ? 'info' : 'warn'}>{r.status}</RBadge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, children }) {
  return (
    <div className="row gap-3" style={{ alignItems: 'center' }}>
      <div style={{ width: 130 }} className="text-xs faint">{label}</div>
      <div className="row gap-2" style={{ flex: 1 }}>{children}</div>
    </div>
  );
}

function Switch({ on, onChange }) {
  return (
    <span
      onClick={() => onChange(!on)}
      style={{
        width: 34, height: 20, borderRadius: 999,
        background: on ? 'var(--accent)' : 'var(--border-strong)',
        position: 'relative', cursor: 'pointer', transition: 'background .2s',
        flexShrink: 0,
      }}
    >
      <span style={{
        position: 'absolute', top: 2, left: on ? 16 : 2, width: 16, height: 16,
        background: 'white', borderRadius: '50%', transition: 'left .2s',
        boxShadow: '0 1px 3px rgba(0,0,0,.2)'
      }}/>
    </span>
  );
}

function ExportTile({ icon, label, sub, tone }) {
  return (
    <div className="report-type" style={{ alignItems: 'center', textAlign: 'center' }}>
      <div className="ico-bubble" style={{ width: 48, height: 48, background: `var(--${tone}-soft)`, color: `var(--${tone})` }}>
        <Icon name={icon} size={22} />
      </div>
      <h4>{label}</h4>
      <p style={{ margin: 0 }}>{sub}</p>
    </div>
  );
}

function ReportPreview() {
  return (
    <div style={{
      background: 'white',
      color: '#0e1116',
      borderRadius: 8,
      border: '1px solid var(--border)',
      padding: 28,
      aspectRatio: '8.5 / 11',
      maxHeight: 540,
      overflow: 'hidden',
      boxShadow: 'var(--shadow-md)',
      fontSize: 11,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, borderBottom: '2px solid #0f766e', paddingBottom: 10 }}>
        <div style={{ width: 28, height: 28, borderRadius: 6, background: '#0f766e' }} />
        <div>
          <div style={{ fontWeight: 700, fontSize: 13 }}>Daily Quality Report</div>
          <div style={{ color: '#5b6573', fontSize: 10 }}>Plant A · 26 May 2026 · All shifts</div>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ textAlign: 'right', fontSize: 10, color: '#5b6573' }}>
          Generated 26 May 2026 19:14<br />Page 1 of 8
        </div>
      </div>
      <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        {[
          { l: 'Total inspected', v: '5,526', t: '' },
          { l: 'Yield', v: '97.56%', t: '#16a34a' },
          { l: 'NG count', v: '135', t: '#dc2626' },
          { l: 'OEE', v: '88.2%', t: '#0f766e' },
        ].map((k, i) => (
          <div key={i} style={{ padding: 8, border: '1px solid #ebecef', borderRadius: 6 }}>
            <div style={{ fontSize: 9, color: '#5b6573' }}>{k.l}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: k.t || '#0e1116' }}>{k.v}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 14, fontWeight: 600, fontSize: 12 }}>Yield trend (per hour)</div>
      <div style={{ height: 110, marginTop: 6, padding: 8, border: '1px solid #ebecef', borderRadius: 6, display: 'flex', alignItems: 'flex-end', gap: 4 }}>
        {window.MOCK.HOURLY_TREND.map((d, i) => {
          const h = (d.total / 510) * 80;
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 1 }}>
              <div style={{ height: (d.ng / d.total) * h, background: '#dc2626', borderRadius: '2px 2px 0 0' }} />
              <div style={{ height: (d.ok / d.total) * h, background: '#16a34a' }} />
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 12, fontWeight: 600, fontSize: 12 }}>Top defects</div>
      <table style={{ width: '100%', fontSize: 10, borderCollapse: 'collapse', marginTop: 4 }}>
        <thead><tr style={{ background: '#f7f8fa' }}><th style={{ textAlign: 'left', padding: 4 }}>Defect</th><th style={{ textAlign: 'right', padding: 4 }}>Count</th><th style={{ textAlign: 'right', padding: 4 }}>%</th></tr></thead>
        <tbody>
          {window.MOCK.PARETO.slice(0, 5).map((p, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #ebecef' }}>
              <td style={{ padding: 4 }}>{p.name}</td>
              <td style={{ textAlign: 'right', padding: 4 }}>{p.count}</td>
              <td style={{ textAlign: 'right', padding: 4 }}>{((p.count / 135) * 100).toFixed(1)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

window.Reports = Reports;
