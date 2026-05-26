// Defect Review — 3-column workflow
const { Badge: DB, ToggleGroup: DTG, StickerThumb: DThumb } = window.UI;

function Defects() {
  const queue = useMemo(() => window.MOCK.INSPECTIONS.filter(i => i.verdict === 'NG').slice(0, 14), []);
  const [selectedId, setSelectedId] = useState(queue[0]?.id);
  const [sort, setSort] = useState('newest');
  const [filter, setFilter] = useState('unreviewed');

  const selected = queue.find(q => q.id === selectedId) || queue[0];
  const def = (c) => window.MOCK.DEFECT_CATEGORIES.find(x => x.code === c);

  const [rootCause, setRootCause] = useState({
    defect: selected?.defects[0] || 'MISALIGN',
    category: 'Machine',
    specific: 'Print head misalignment',
    corrective: '',
    preventive: '',
    severity: 'Major',
  });

  useEffect(() => {
    if (selected) {
      setRootCause(r => ({ ...r, defect: selected.defects[0] || r.defect, specific: '' }));
    }
  }, [selectedId]);

  return (
    <div className="page" style={{ paddingBottom: 22 }}>
      <div style={{ display: 'flex', alignItems: 'end', justifyContent: 'space-between', marginBottom: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em' }}>Defect Review</h1>
          <p className="muted" style={{ margin: '4px 0 0', fontSize: 13 }}>
            Quality team workflow — review NG events, validate verdicts, assign root causes.
          </p>
        </div>
        <div className="row gap-2">
          <span className="badge ng dot">{queue.length} unreviewed</span>
          <span className="badge ok dot">22 reviewed today</span>
          {/* <button className="btn sm"><Icon name="settings-2" size={13} /> Thresholds</button> */}
        </div>
      </div>

      <div className="workflow">
        {/* Left — Queue */}
        <div className="col-card">
          <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)' }}>
            <div className="row gap-2 mb-2" style={{ marginBottom: 8 }}>
              <strong style={{ fontSize: 13 }}>NG Queue</strong>
              <span className="badge ng">{queue.length}</span>
            </div>
            <DTG
              options={[{ value: 'unreviewed', label: 'Unreviewed' }, { value: 'today', label: 'Today' }, { value: 'pending', label: 'Pending' }, { value: 'closed', label: 'Closed' }]}
              value={filter} onChange={setFilter}
            />
            <div className="row gap-2 mt-3" style={{ marginTop: 8 }}>
              <span className="text-xs faint">Sort</span>
              <select
                value={sort} onChange={(e) => setSort(e.target.value)}
                style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 6, padding: '3px 6px', color: 'var(--text)', fontSize: 12, fontFamily: 'inherit' }}>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="line">By line</option>
                <option value="defect">By defect</option>
                <option value="conf">By confidence</option>
              </select>
            </div>
          </div>
          <div className="queue">
            {queue.map(q => (
              <div key={q.id} className={`queue-item ${q.id === selected?.id ? 'active' : ''}`} onClick={() => setSelectedId(q.id)}>
                <DThumb type={q.type} ng />
                <div>
                  <div className="meta-row">
                    <span className="id">{q.id.split('-').pop()}</span>
                    <DB kind="ng" dot>NG</DB>
                  </div>
                  <div className="second">
                    <span>{q.lineName}</span>
                    <span>·</span>
                    <span>{def(q.defects[0])?.name || q.defects[0]}</span>
                  </div>
                  <div className="text-xs faint" style={{ marginTop: 2 }}>{window.fmtAgo(q.ts)} · conf {(q.confidence * 100).toFixed(0)}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center — Detail + image */}
        <div className="col-card">
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{selected?.id}</div>
              <div className="text-xs faint">{selected?.lineName} · {selected?.skuName} · {window.fmtTime(selected?.ts)}</div>
            </div>
            <div style={{ flex: 1 }} />
            <span className="text-xs faint">Confidence</span>
            <span className="num" style={{ fontSize: 14, fontWeight: 600 }}>{(selected?.confidence * 100).toFixed(1)}%</span>
            <DB kind="ng" dot>NG</DB>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
            <div className={`viewer ng-sample`}>
              <div className="stamp">
                <span className="stamp-tag">CAM-{selected?.lineId}</span>
                <span className="stamp-tag">{window.fmtTime(selected?.ts)}</span>
              </div>
              <div className="axes" />
              <div className="bbox" data-label={def(selected?.defects[0])?.name} style={{ top: '22%', left: '20%', width: '40%', height: '40%' }} />
              {selected?.defects[1] && (
                <div className="bbox" data-label={def(selected.defects[1])?.name} style={{ top: '58%', left: '55%', width: '22%', height: '24%', borderColor: 'var(--warn)' }} />
              )}
            </div>

            <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
              <button className="btn sm ghost"><Icon name="zoom-in" size={13} /> Zoom</button>
              <button className="btn sm ghost"><Icon name="grid-3x3" size={13} /> Grid</button>
              <button className="btn sm ghost"><Icon name="contrast" size={13} /> Contrast</button>
              <span style={{ flex: 1 }} />
              <button className="btn sm"><Icon name="rotate-cw" size={13} /> Re-analyze</button>
            </div>

            <div className="mt-4" style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <InfoTile label="Sticker" value={selected?.type === 'small' ? 'Small · 50×30mm' : 'Medium · 120×80mm'} icon="sticker" />
              <InfoTile label="Operator" value={selected?.operator} icon="user-round" />
              <InfoTile label="Shift" value={selected?.shift} icon="clock" />
              <InfoTile label="Cycle time" value="0.83s" icon="timer" />
            </div>

            <div style={{ marginTop: 14 }}>
              <div className="text-xs faint" style={{ marginBottom: 6 }}>NOTES</div>
              <textarea
                placeholder="Add inspection notes — visible to Quality team…"
                rows={3}
                style={{ width: '100%', padding: 10, border: '1px solid var(--border-strong)', borderRadius: 8, background: 'var(--surface)', color: 'var(--text)', fontFamily: 'inherit', fontSize: 13, resize: 'vertical' }}
              />
            </div>
          </div>

          <div style={{ padding: 12, borderTop: '1px solid var(--border)', display: 'flex', gap: 8 }}>
            <button className="btn"><Icon name="x" size={14} /> Override → OK</button>
            <button className="btn"><Icon name="flag" size={14} /> Flag</button>
            <span style={{ flex: 1 }} />
            <button className="btn primary"><Icon name="check-check" size={14} /> Confirm NG & Mark Reviewed</button>
          </div>
        </div>

        {/* Right — Root cause logging */}
        <div className="col-card">
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
            <div className="row gap-2">
              <Icon name="git-branch" size={15} />
              <strong style={{ fontSize: 13 }}>Root Cause</strong>
              <span style={{ flex: 1 }} />
              <DB kind="warn">5W2H</DB>
            </div>
            <p className="text-xs faint" style={{ margin: '6px 0 0' }}>Tag each NG with category and corrective action.</p>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
            <Field label="Defect category">
              <select className="select-clean" value={rootCause.defect} onChange={(e) => setRootCause(r => ({ ...r, defect: e.target.value }))}>
                {window.MOCK.DEFECT_CATEGORIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
              </select>
            </Field>

            <Field label="Severity">
              <div className="toggle-group">
                {['Critical', 'Major', 'Minor'].map(s => (
                  <button key={s} className={rootCause.severity === s ? 'on' : ''} onClick={() => setRootCause(r => ({ ...r, severity: s }))}>{s}</button>
                ))}
              </div>
            </Field>

            <Field label="Root cause category (4M+1E)">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
                {['Material', 'Machine', 'Method', 'Operator', 'Environment', 'Other'].map(c => (
                  <button key={c} className={`btn xs ${rootCause.category === c ? 'primary' : ''}`} onClick={() => setRootCause(r => ({ ...r, category: c }))}>{c}</button>
                ))}
              </div>
            </Field>

            <Field label="Specific cause">
              <input
                value={rootCause.specific}
                onChange={(e) => setRootCause(r => ({ ...r, specific: e.target.value }))}
                placeholder="e.g. Print head misalignment"
                className="input-clean"
              />
            </Field>

            <Field label="Corrective action taken">
              <textarea rows={2} placeholder="What was done immediately…" className="input-clean" />
            </Field>

            <Field label="Preventive action recommended">
              <textarea rows={2} placeholder="To prevent recurrence…" className="input-clean" />
            </Field>

            <div style={{ marginTop: 14, padding: 12, background: 'var(--accent-soft)', borderRadius: 10, border: '1px solid var(--border)' }}>
              <div className="row gap-2 text-sm" style={{ color: 'var(--accent-ink)' }}>
                <Icon name="lightbulb" size={14} />
                <strong>Pattern detected</strong>
              </div>
              <p className="text-xs" style={{ margin: '4px 0 0', color: 'var(--accent-ink)' }}>
                4 NG with <strong>Misalignment</strong> on Line 02 in last 30 min. Recommend pausing line and re-calibrating CAM-02.
              </p>
            </div>
          </div>

          <div style={{ padding: 12, borderTop: '1px solid var(--border)', display: 'flex', gap: 8 }}>
            <button className="btn ghost flex-1"><Icon name="ticket" size={13} /> Create CA ticket</button>
            <button className="btn primary flex-1"><Icon name="save" size={13} /> Save Root Cause</button>
          </div>
        </div>
      </div>

      <style>{`
        .input-clean, .select-clean {
          width: 100%; padding: 7px 10px; border: 1px solid var(--border-strong);
          background: var(--surface); color: var(--text); border-radius: 7px;
          font: inherit; font-size: 13px;
        }
        .input-clean:focus, .select-clean:focus { outline: 0; border-color: var(--accent); box-shadow: 0 0 0 3px color-mix(in oklab, var(--accent) 18%, transparent); }
      `}</style>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div className="text-xs faint" style={{ marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.04em' }}>{label}</div>
      {children}
    </div>
  );
}

function InfoTile({ label, value, icon }) {
  return (
    <div style={{ padding: 10, border: '1px solid var(--border)', borderRadius: 10, background: 'var(--surface-2)' }}>
      <div className="row gap-2 text-xs faint"><Icon name={icon} size={12} /> {label}</div>
      <div style={{ fontSize: 13, fontWeight: 500, marginTop: 2 }}>{value}</div>
    </div>
  );
}

window.Defects = Defects;
