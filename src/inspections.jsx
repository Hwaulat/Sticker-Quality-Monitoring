// Inspection History — table + filters + detail drawer
const { Badge: IBadge, ToggleGroup: IToggle, Checkbox: ICheckbox, Drawer: IDrawer, Modal: IModal, ProgressBar: IProgress, StickerThumb: IThumb, useChartColors: useICol } = window.UI;

function InspectionDetail({ row, onClose }) {
  const [tab, setTab] = useState('vision');
  const [overrideOpen, setOverrideOpen] = useState(false);
  if (!row) return null;
  const def = (code) => window.MOCK.DEFECT_CATEGORIES.find(c => c.code === code);
  return (
    <IDrawer open={!!row} onClose={onClose} width={760}>
      <header>
        <span className="mono text-sm muted">{row.id}</span>
        <IBadge kind={row.verdict === 'OK' ? 'ok' : 'ng'} dot>{row.verdict}</IBadge>
        <span className="text-xs faint">· captured {window.fmtTime(row.ts)} · {window.fmtAgo(row.ts)}</span>
        <span style={{ flex: 1 }} />
        <button className="btn sm ghost icon-only"><Icon name="external-link" size={14} /></button>
        <button className="btn sm ghost icon-only" onClick={onClose}><Icon name="x" size={15} /></button>
      </header>
      <div className="body">
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16 }}>
          <div>
            <div className={`viewer ${row.verdict === 'NG' ? 'ng-sample' : ''}`}>
              <div className="stamp">
                <span className="stamp-tag">CAM-{row.lineId}</span>
                <span className="stamp-tag">{window.fmtTime(row.ts)}</span>
              </div>
              <div className="axes" />
              {row.verdict === 'NG' && row.defects[0] && (
                <div className="bbox" data-label={def(row.defects[0])?.name} style={{ top: '24%', left: '22%', width: '34%', height: '36%' }} />
              )}
              {row.verdict === 'NG' && row.defects[1] && (
                <div className="bbox" data-label={def(row.defects[1])?.name} style={{ top: '54%', left: '58%', width: '22%', height: '24%', borderColor: 'var(--warn)' }} />
              )}
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
              <button className="btn sm ghost"><Icon name="zoom-in" size={13} /> Zoom</button>
              <button className="btn sm ghost"><Icon name="move" size={13} /> Pan</button>
              <button className="btn sm ghost"><Icon name="layers" size={13} /> Overlay</button>
              <span style={{ flex: 1 }} />
              <button className="btn sm ghost"><Icon name="download" size={13} /> Download</button>
            </div>

            <div style={{ marginTop: 14, padding: 12, background: 'var(--surface-2)', borderRadius: 10, border: '1px solid var(--border)' }}>
              <div className="text-xs faint" style={{ marginBottom: 6, letterSpacing: '.04em', textTransform: 'uppercase' }}>Audit history</div>
              <div className="col gap-2 text-sm">
                <div className="row gap-2"><Icon name="circle-check" size={13} className="faint" /> <span>Verdict captured by CAM-{row.lineId}</span> <span className="faint" style={{ marginLeft: 'auto' }}>{window.fmtTime(row.ts)}</span></div>
                {row.verdict === 'NG' && <div className="row gap-2"><Icon name="alert-circle" size={13} style={{ color: 'var(--ng)' }} /> <span>Defects detected: {row.defects.join(', ')}</span> <span className="faint" style={{ marginLeft: 'auto' }}>{window.fmtTime(row.ts)}</span></div>}
                <div className="row gap-2"><Icon name="database" size={13} className="faint" /> <span>Persisted to TimescaleDB</span> <span className="faint" style={{ marginLeft: 'auto' }}>+0.2s</span></div>
              </div>
            </div>
          </div>

          <div>
            <div className="tabs">
              <button className={tab === 'vision' ? 'active' : ''} onClick={() => setTab('vision')}>Vision Data</button>
              <button className={tab === 'meta' ? 'active' : ''} onClick={() => setTab('meta')}>Metadata</button>
              <button className={tab === 'comments' ? 'active' : ''} onClick={() => setTab('comments')}>Comments</button>
            </div>

            {tab === 'vision' && (
              <div className="col gap-3">
                <div>
                  <div className="text-xs faint">Verdict</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
                    <span style={{ fontSize: 20, fontWeight: 600, color: row.verdict === 'OK' ? 'var(--ok)' : 'var(--ng)' }}>{row.verdict}</span>
                    <span className="faint">at confidence {(row.confidence * 100).toFixed(1)}%</span>
                  </div>
                  <div className="mt-2"><IProgress value={row.confidence * 100} tone={row.confidence > 0.9 ? 'ok' : 'warn'} /></div>
                </div>

                {row.verdict === 'NG' && (
                  <div>
                    <div className="text-xs faint">Detected defects</div>
                    <div className="tag-list mt-2">
                      {row.defects.map(c => {
                        const d = def(c);
                        return <span key={c} className="badge" style={{ background: `color-mix(in oklab, ${d?.color || '#888'} 15%, var(--surface))`, color: d?.color || 'inherit', borderColor: 'transparent' }}>{d?.name || c} · {d?.severity}</span>;
                      })}
                    </div>
                  </div>
                )}

                <div>
                  <div className="text-xs faint">Measurements</div>
                  <div className="mt-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <div style={{ padding: 10, border: '1px solid var(--border)', borderRadius: 8 }}>
                      <div className="text-xs faint">Width</div>
                      <div className="row gap-2"><span className="num" style={{ fontSize: 16, fontWeight: 600 }}>{row.width.toFixed(2)} mm</span> <IBadge kind="ok">PASS</IBadge></div>
                      <div className="text-xs faint">spec {row.type === 'small' ? '50 ±1.0' : '120 ±1.5'}</div>
                    </div>
                    <div style={{ padding: 10, border: '1px solid var(--border)', borderRadius: 8 }}>
                      <div className="text-xs faint">Height</div>
                      <div className="row gap-2"><span className="num" style={{ fontSize: 16, fontWeight: 600 }}>{row.height.toFixed(2)} mm</span> <IBadge kind="ok">PASS</IBadge></div>
                      <div className="text-xs faint">spec {row.type === 'small' ? '30 ±1.0' : '80 ±1.5'}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-xs faint">Quality scores</div>
                  <div className="mt-2 col gap-2">
                    <div>
                      <div className="row text-sm"><span>Color deviation</span><span className="num faint" style={{ marginLeft: 'auto' }}>{row.colorDeviation.toFixed(1)} / 100</span></div>
                      <IProgress value={row.colorDeviation} tone={row.colorDeviation > 20 ? 'ng' : row.colorDeviation > 10 ? 'warn' : 'ok'} />
                    </div>
                    <div>
                      <div className="row text-sm"><span>Print quality</span><span className="num faint" style={{ marginLeft: 'auto' }}>{row.printQuality.toFixed(1)} / 100</span></div>
                      <IProgress value={row.printQuality} tone={row.printQuality > 85 ? 'ok' : row.printQuality > 70 ? 'warn' : 'ng'} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {tab === 'meta' && (
              <div className="col gap-3">
                <KV label="Inspection #" value={<span className="mono">{row.id}</span>} />
                <KV label="Timestamp" value={`${window.fmtTime(row.ts)} · 26 May 2026`} />
                <KV label="Line" value={row.lineName} />
                <KV label="Shift" value={row.shift} />
                <KV label="Operator" value={row.operator} />
                <KV label="Sticker SKU" value={<span className="mono">{row.sku}</span>} />
                <KV label="Design" value={`${row.skuName} · ${row.design}`} />
                <KV label="Type" value={row.type === 'small' ? 'Small (50×30 mm)' : 'Medium (120×80 mm)'} />
                <KV label="Camera" value={`CAM-${row.lineId} · 4K`} />
                <KV label="Cycle Time" value="0.82s" />
              </div>
            )}

            {tab === 'comments' && (
              <div className="col gap-3">
                <div style={{ padding: 12, border: '1px solid var(--border)', borderRadius: 10 }}>
                  <div className="row gap-2 text-sm"><span className="avatar sm">MS</span><strong>Made Sukma</strong><span className="faint text-xs">QE · 2m ago</span></div>
                  <p style={{ margin: '6px 0 0', fontSize: 13 }}>Looks like ink supply needs check — same misalignment pattern as INS-…2197.</p>
                </div>
                <textarea
                  rows={3} placeholder="Add a comment or tag a teammate…"
                  style={{ width: '100%', padding: 10, border: '1px solid var(--border-strong)', borderRadius: 8, background: 'var(--surface)', color: 'var(--text)', fontFamily: 'inherit', fontSize: 13, resize: 'vertical' }} />
                <div className="row gap-2"><button className="btn sm primary">Post</button><button className="btn sm ghost"><Icon name="flag" size={13} /> Flag</button></div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="foot">
        <button className="btn ghost"><Icon name="flag" size={14} /> Flag for review</button>
        <button className="btn ghost"><Icon name="message-square-plus" size={14} /> Add comment</button>
        <span style={{ flex: 1 }} />
        <button className="btn" onClick={() => setOverrideOpen(true)}>
          <Icon name="repeat" size={14} /> Override Verdict
        </button>
        <button className="btn primary"><Icon name="check" size={14} /> Mark Reviewed</button>
      </div>

      <IModal open={overrideOpen} onClose={() => setOverrideOpen(false)}>
        <header><Icon name="repeat" size={16} /> <strong>Override Verdict</strong></header>
        <div className="body">
          <p className="muted" style={{ marginTop: 0 }}>You're overriding the camera's verdict for <span className="mono">{row.id}</span>. The change will be logged with your name, timestamp, and justification.</p>
          <div className="col gap-3 mt-3">
            <div>
              <div className="text-xs faint">Original verdict</div>
              <IBadge kind={row.verdict === 'OK' ? 'ok' : 'ng'} dot>{row.verdict}</IBadge>
            </div>
            <div>
              <div className="text-xs faint">New verdict</div>
              <div className="row gap-2 mt-2">
                <label className="btn"><input type="radio" name="newverdict" defaultChecked /> OK</label>
                <label className="btn"><input type="radio" name="newverdict" /> NG</label>
              </div>
            </div>
            <div>
              <div className="text-xs faint">Reason (min 20 chars)</div>
              <textarea rows={3} placeholder="Explain why you're overriding…" style={{ width: '100%', marginTop: 4, padding: 10, border: '1px solid var(--border-strong)', borderRadius: 8, background: 'var(--surface)', color: 'var(--text)', fontFamily: 'inherit', fontSize: 13 }}/>
            </div>
          </div>
        </div>
        <div className="foot"><button className="btn ghost" onClick={() => setOverrideOpen(false)}>Cancel</button><button className="btn primary"><Icon name="check" size={14} /> Submit Override</button></div>
      </IModal>
    </IDrawer>
  );
}

function KV({ label, value }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 10, alignItems: 'center', fontSize: 13 }}>
      <span className="text-xs faint">{label}</span>
      <span>{value}</span>
    </div>
  );
}

function Inspections({ openId, setOpenId }) {
  const [verdict, setVerdict] = useState('all');
  const [selected, setSelected] = useState(new Set());
  const [page, setPage] = useState(1);
  const perPage = 12;

  const filtered = useMemo(() => {
    return window.MOCK.INSPECTIONS.filter(r => verdict === 'all' || r.verdict === verdict.toUpperCase());
  }, [verdict]);
  const total = filtered.length;
  const pageRows = filtered.slice((page - 1) * perPage, page * perPage);

  const allSelected = pageRows.length > 0 && pageRows.every(r => selected.has(r.id));
  const someSelected = pageRows.some(r => selected.has(r.id)) && !allSelected;

  const open = window.MOCK.INSPECTIONS.find(r => r.id === openId);

  return (
    <div className="page">
      <div style={{ display: 'flex', alignItems: 'end', justifyContent: 'space-between', marginBottom: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em' }}>Inspections</h1>
          <p className="muted" style={{ margin: '4px 0 0', fontSize: 13 }}>
            <span className="num">{total.toLocaleString()}</span> records · today 08:00 – now
          </p>
        </div>
        <div className="row gap-2">
          <button className="btn ghost sm"><Icon name="download" size={14} /> Export CSV</button>
          <button className="btn ghost sm"><Icon name="file-spreadsheet" size={14} /> Export XLSX</button>
          <button className="btn primary sm" disabled={selected.size === 0}>
            <Icon name="repeat" size={14} /> Bulk Override {selected.size > 0 && <span className="badge-mini" style={{ background: 'rgba(255,255,255,.2)', color: 'white' }}>{selected.size}</span>}
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: 10, marginBottom: 12 }}>
        <div className="row gap-2" style={{ flexWrap: 'wrap' }}>
          <div className="field"><Icon name="calendar" size={14} /> <span>Today</span> <Icon name="chevron-down" size={13} /></div>
          <IToggle options={[{ value: 'all', label: 'All' }, { value: 'ok', label: 'OK' }, { value: 'ng', label: 'NG' }]} value={verdict} onChange={setVerdict} />
          <div className="field"><Icon name="factory" size={14} /><span className="field-label">Line</span><span>All</span><Icon name="chevron-down" size={13} /></div>
          <div className="field"><Icon name="sticker" size={14} /><span className="field-label">Type</span><span>All</span><Icon name="chevron-down" size={13} /></div>
          <div className="field"><Icon name="user-round" size={14} /><span className="field-label">Operator</span><span>All</span><Icon name="chevron-down" size={13} /></div>
          <div className="field"><Icon name="alert-circle" size={14} /><span className="field-label">Defect</span><span className="faint">Any</span><Icon name="chevron-down" size={13} /></div>
          <div style={{ flex: 1 }} />
          <div className="field" style={{ minWidth: 220 }}>
            <Icon name="search" size={14} />
            <input placeholder="Search inspection #, SKU…" />
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: 36 }}>
                  <ICheckbox
                    checked={allSelected}
                    indeterminate={someSelected}
                    onChange={(v) => {
                      const next = new Set(selected);
                      if (v) pageRows.forEach(r => next.add(r.id));
                      else pageRows.forEach(r => next.delete(r.id));
                      setSelected(next);
                    }}
                  />
                </th>
                <th>Time</th>
                <th>Inspection #</th>
                <th>Line</th>
                <th>SKU</th>
                <th>Type</th>
                <th>Verdict</th>
                <th>Defects</th>
                <th style={{ minWidth: 120 }}>Confidence</th>
                <th>Operator</th>
                <th>Image</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map(r => (
                <tr key={r.id} className={selected.has(r.id) ? 'selected' : ''} onClick={() => setOpenId(r.id)}>
                  <td onClick={(e) => e.stopPropagation()}>
                    <ICheckbox checked={selected.has(r.id)} onChange={(v) => {
                      const next = new Set(selected); v ? next.add(r.id) : next.delete(r.id); setSelected(next);
                    }} />
                  </td>
                  <td className="num text-sm muted">{window.fmtTime(r.ts)}</td>
                  <td className="mono text-sm">{r.id}</td>
                  <td>{r.lineName}</td>
                  <td><span className="mono text-sm">{r.sku}</span></td>
                  <td><IBadge kind={r.type === 'small' ? 'info' : 'accent'}>{r.type === 'small' ? 'Small' : 'Medium'}</IBadge></td>
                  <td><IBadge kind={r.verdict === 'OK' ? 'ok' : 'ng'} dot>{r.verdict}</IBadge></td>
                  <td>
                    {r.defects.length === 0 ? <span className="faint">—</span> : (
                      <div className="row gap-2" style={{ flexWrap: 'wrap' }}>
                        {r.defects.slice(0, 2).map(c => {
                          const d = window.MOCK.DEFECT_CATEGORIES.find(x => x.code === c);
                          return <span key={c} className="badge">{d?.name || c}</span>;
                        })}
                        {r.defects.length > 2 && <span className="badge">+{r.defects.length - 2}</span>}
                      </div>
                    )}
                  </td>
                  <td>
                    <div className="row gap-2">
                      <IProgress value={r.confidence * 100} tone={r.confidence > 0.9 ? 'ok' : 'warn'} />
                      <span className="num text-xs faint">{(r.confidence * 100).toFixed(0)}%</span>
                    </div>
                  </td>
                  <td className="text-sm">{r.operator}</td>
                  <td><IThumb type={r.type} ng={r.verdict === 'NG'} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderTop: '1px solid var(--border)' }}>
          <span className="text-xs faint">
            Showing <span className="num">{(page - 1) * perPage + 1}–{Math.min(page * perPage, total)}</span> of <span className="num">{total}</span>
          </span>
          <span style={{ flex: 1 }} />
          <IToggle options={['25', '50', '100']} value="25" onChange={() => {}} />
          <div className="row gap-2">
            <button className="btn ghost sm icon-only" disabled={page === 1} onClick={() => setPage(p => p - 1)}><Icon name="chevron-left" size={14} /></button>
            <span className="text-sm muted">Page {page} of {Math.ceil(total / perPage)}</span>
            <button className="btn ghost sm icon-only" disabled={page >= Math.ceil(total / perPage)} onClick={() => setPage(p => p + 1)}><Icon name="chevron-right" size={14} /></button>
          </div>
        </div>
      </div>

      <InspectionDetail row={open} onClose={() => setOpenId(null)} />
    </div>
  );
}

window.Inspections = Inspections;
window.InspectionDetail = InspectionDetail;
