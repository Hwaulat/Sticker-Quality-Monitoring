// Master Data — tabbed CRUD across master entities
const { Badge: MB, Drawer: MD } = window.UI;

function Master() {
  const sub = [
    { id: 'line', label: 'Lines', icon: 'factory', count: 6 },
    { id: 'sku', label: 'Sticker SKUs', icon: 'sticker', count: 28 },
    { id: 'defect', label: 'Defect Categories', icon: 'alert-circle', count: 14 },
    { id: 'rc', label: 'Root Causes', icon: 'git-branch', count: 22 },
    { id: 'customer', label: 'Customers', icon: 'building-2', count: 9 },
    { id: 'shift', label: 'Shifts', icon: 'clock', count: 3 },
    { id: 'material', label: 'Materials', icon: 'layers', count: 12 },
    { id: 'camera', label: 'Cameras / Vision', icon: 'camera', count: 6 },
  ];
  const [active, setActive] = useState('line');
  const [drawer, setDrawer] = useState(null);

  return (
    <div className="page">
      <div style={{ display: 'flex', alignItems: 'end', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em' }}>Master Data</h1>
          <p className="muted" style={{ margin: '4px 0 0', fontSize: 13 }}>Configure lines, SKUs, defects, root causes, and other reference data.</p>
        </div>
        <button className="btn primary" onClick={() => setDrawer({ kind: active, isNew: true })}>
          <Icon name="plus" size={14} /> New {sub.find(s => s.id === active)?.label.replace(/s$/, '')}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 14 }}>
        <div className="card" style={{ padding: 8, alignSelf: 'flex-start' }}>
          {sub.map(s => (
            <div
              key={s.id}
              onClick={() => setActive(s.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px',
                borderRadius: 7, cursor: 'pointer',
                background: active === s.id ? 'var(--surface-2)' : 'transparent',
                color: active === s.id ? 'var(--text)' : 'var(--text-muted)',
                fontSize: 13, fontWeight: 500,
              }}>
              <Icon name={s.icon} size={15} />
              <span style={{ flex: 1 }}>{s.label}</span>
              <span className="text-xs faint num">{s.count}</span>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-head">
            <h3>{sub.find(s => s.id === active)?.label}</h3>
            <span className="sub">— {sub.find(s => s.id === active)?.count} records</span>
            <div style={{ flex: 1 }} />
            <div className="field" style={{ minWidth: 200 }}>
              <Icon name="search" size={14} />
              <input placeholder="Search…" />
            </div>
          </div>
          {active === 'line' && <LinesTable onEdit={(l) => setDrawer({ kind: 'line', row: l })} />}
          {active === 'sku' && <SKUsTable onEdit={(l) => setDrawer({ kind: 'sku', row: l })} />}
          {active === 'defect' && <DefectsTable onEdit={(l) => setDrawer({ kind: 'defect', row: l })} />}
          {active === 'rc' && <RCTable />}
          {active === 'customer' && <CustomersTable />}
          {active === 'shift' && <ShiftsTable />}
          {active === 'material' && <MaterialsTable />}
          {active === 'camera' && <CamerasTable />}
        </div>
      </div>

      <MD open={!!drawer} onClose={() => setDrawer(null)} width={560}>
        {drawer && <MasterEditDrawer kind={drawer.kind} row={drawer.row} isNew={drawer.isNew} onClose={() => setDrawer(null)} />}
      </MD>
    </div>
  );
}

function MasterEditDrawer({ kind, row, isNew, onClose }) {
  const titles = {
    line: isNew ? 'New Production Line' : 'Edit Line',
    sku: isNew ? 'New Sticker SKU' : 'Edit Sticker SKU',
    defect: isNew ? 'New Defect Category' : 'Edit Defect Category',
  };
  return (
    <>
      <header>
        <h2>{titles[kind] || (isNew ? 'New record' : 'Edit record')}</h2>
        <div style={{ flex: 1 }} />
        <button className="btn ghost sm icon-only" onClick={onClose}><Icon name="x" size={15} /></button>
      </header>
      <div className="body">
        {kind === 'line' && <LineForm row={row} />}
        {kind === 'sku' && <SKUForm row={row} />}
        {kind === 'defect' && <DefectForm row={row} />}
      </div>
      <div className="foot">
        <button className="btn ghost" onClick={onClose}>Cancel</button>
        {!isNew && <button className="btn"><Icon name="archive" size={14} /> Deactivate</button>}
        <button className="btn primary"><Icon name="save" size={14} /> Save</button>
      </div>
    </>
  );
}

function FormGrid({ children }) { return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>{children}</div>; }
function FormField({ label, full, children }) {
  return (
    <div style={{ gridColumn: full ? '1 / -1' : 'auto' }}>
      <div className="text-xs faint" style={{ marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.04em' }}>{label}</div>
      {children}
    </div>
  );
}
const Input = (p) => <input {...p} style={{ width: '100%', padding: '7px 10px', border: '1px solid var(--border-strong)', borderRadius: 7, background: 'var(--surface)', color: 'var(--text)', font: 'inherit', fontSize: 13, ...(p.style || {}) }} />;
const Select = (p) => <select {...p} style={{ width: '100%', padding: '7px 10px', border: '1px solid var(--border-strong)', borderRadius: 7, background: 'var(--surface)', color: 'var(--text)', font: 'inherit', fontSize: 13 }}>{p.children}</select>;

function LineForm({ row }) {
  return (
    <FormGrid>
      <FormField label="Line code"><Input defaultValue={row?.code || 'L07'} /></FormField>
      <FormField label="Line name"><Input defaultValue={row?.name || 'Line 07'} /></FormField>
      <FormField label="Sticker type">
        <Select defaultValue={row?.stickerType || 'small'}>
          <option value="small">Small only</option><option value="medium">Medium only</option><option value="both">Both</option>
        </Select>
      </FormField>
      <FormField label="Location"><Input defaultValue="Building A · Bay 3" /></FormField>
      <FormField label="Vision camera">
        <Select>
          <option>CAM-07 — Cognex In-Sight</option><option>CAM-08 — Keyence CV-X</option>
        </Select>
      </FormField>
      <FormField label="Status">
        <Select defaultValue={row?.status || 'running'}>
          <option value="running">Running</option><option value="idle">Idle</option><option value="maint">Maintenance</option>
        </Select>
      </FormField>
      <FormField label="Target throughput (pcs/hr)"><Input type="number" defaultValue={row?.target || 1200} /></FormField>
      <FormField label="Target yield %"><Input type="number" step="0.1" defaultValue={98} /></FormField>
      <FormField label="Description" full><Input defaultValue="Primary line for body decals" /></FormField>
      <FormField label="Active" full>
        <label className="row gap-2"><input type="checkbox" defaultChecked /> <span className="text-sm">Line is active and visible across the app</span></label>
      </FormField>
    </FormGrid>
  );
}

function SKUForm({ row }) {
  return (
    <FormGrid>
      <FormField label="SKU code"><Input defaultValue={row?.sku || 'STK-NEW-S-001'} /></FormField>
      <FormField label="Name"><Input defaultValue={row?.name || ''} /></FormField>
      <FormField label="Sticker type">
        <Select defaultValue={row?.type || 'small'}><option value="small">Small</option><option value="medium">Medium</option></Select>
      </FormField>
      <FormField label="Customer"><Select><option>PT Astra Honda</option><option>PT Yamaha Indonesia</option></Select></FormField>
      <FormField label="Design version"><Input defaultValue="v2.3" /></FormField>
      <FormField label="Spec dimensions">
        <div className="row gap-2"><Input style={{ width: 70 }} placeholder="W" defaultValue="50" /><span className="faint">×</span><Input style={{ width: 70 }} placeholder="H" defaultValue="30" /><span className="faint text-xs">mm</span></div>
      </FormField>
      <FormField label="Tolerance ±mm"><Input type="number" step="0.1" defaultValue="1.0" /></FormField>
      <FormField label="Pantone colors" full><Input defaultValue="Pantone 185 C, Pantone Black 6 C" /></FormField>
      <FormField label="Reference image" full>
        <div style={{
          padding: 14, border: '1.5px dashed var(--border-strong)', borderRadius: 8,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, color: 'var(--text-muted)'
        }}>
          <Icon name="upload-cloud" size={20} />
          <div className="text-sm">Drop image or <span style={{ color: 'var(--accent)' }}>browse</span></div>
          <div className="text-xs faint">PNG, JPG up to 4MB</div>
        </div>
      </FormField>
    </FormGrid>
  );
}

function DefectForm({ row }) {
  return (
    <FormGrid>
      <FormField label="Code"><Input defaultValue={row?.code || 'NEW_CODE'} className="mono" /></FormField>
      <FormField label="Name"><Input defaultValue={row?.name || ''} /></FormField>
      <FormField label="Default severity">
        <Select defaultValue={row?.severity || 'Major'}><option>Critical</option><option>Major</option><option>Minor</option></Select>
      </FormField>
      <FormField label="Color (badge)">
        <div className="row gap-2"><Input defaultValue={row?.color || '#dc2626'} /><span style={{ width: 28, height: 28, borderRadius: 6, background: row?.color || '#dc2626' }}></span></div>
      </FormField>
      <FormField label="Description" full>
        <textarea rows={3} defaultValue="Air bubbles in laminate or substrate impacting visual quality." style={{ width: '100%', padding: 10, border: '1px solid var(--border-strong)', borderRadius: 8, background: 'var(--surface)', color: 'var(--text)', font: 'inherit', fontSize: 13 }} />
      </FormField>
      <FormField label="Default root cause">
        <Select><option>Machine — Print head</option><option>Material — Adhesive</option><option>Method — Lamination</option></Select>
      </FormField>
      <FormField label="Active">
        <label className="row gap-2"><input type="checkbox" defaultChecked /> <span className="text-sm">Visible in inspector UI</span></label>
      </FormField>
    </FormGrid>
  );
}

/* ----- Tables ----- */

function LinesTable({ onEdit }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="table">
        <thead><tr>
          <th>Code</th><th>Name</th><th>Sticker type</th><th>Camera</th><th>Status</th><th>Target / hr</th><th>Target yield</th><th>Today yield</th><th></th>
        </tr></thead>
        <tbody>
          {window.MOCK.LINES.map(l => (
            <tr key={l.id} onClick={() => onEdit?.(l)}>
              <td className="mono">{l.code}</td>
              <td>{l.name}</td>
              <td><MB kind={l.stickerType === 'small' ? 'info' : 'accent'}>{l.stickerType === 'small' ? 'Small' : 'Medium'}</MB></td>
              <td className="mono text-sm">CAM-{l.id}</td>
              <td><MB kind={l.status === 'running' ? 'ok' : l.status === 'maint' ? 'warn' : 'info'} dot>{l.status}</MB></td>
              <td className="num">{l.target.toLocaleString()}</td>
              <td className="num">98.00%</td>
              <td className="num" style={{ color: l.yield >= 98 ? 'var(--ok)' : l.yield >= 95 ? 'var(--warn)' : 'var(--ng)' }}>
                {l.total ? l.yield.toFixed(2) + '%' : '—'}
              </td>
              <td><button className="btn ghost xs icon-only"><Icon name="more-horizontal" size={14} /></button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SKUsTable({ onEdit }) {
  const rows = window.MOCK.SKUS;
  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="table">
        <thead><tr><th>SKU</th><th>Name</th><th>Type</th><th>Customer</th><th>Dimensions</th><th>Active</th></tr></thead>
        <tbody>
          {rows.map(s => (
            <tr key={s.sku} onClick={() => onEdit?.(s)}>
              <td className="mono">{s.sku}</td>
              <td>{s.name}</td>
              <td><MB kind={s.type === 'small' ? 'info' : 'accent'}>{s.type}</MB></td>
              <td>{s.customer}</td>
              <td className="num text-sm">{s.type === 'small' ? '50 × 30 mm' : '120 × 80 mm'}</td>
              <td><MB kind="ok" dot>active</MB></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DefectsTable({ onEdit }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="table">
        <thead><tr><th>Code</th><th>Name</th><th>Severity</th><th>Color</th><th>30-day count</th><th>Active</th></tr></thead>
        <tbody>
          {window.MOCK.DEFECT_CATEGORIES.map(c => (
            <tr key={c.code} onClick={() => onEdit?.(c)}>
              <td className="mono">{c.code}</td>
              <td>{c.name}</td>
              <td><MB kind={c.severity === 'Critical' ? 'ng' : c.severity === 'Major' ? 'warn' : 'info'}>{c.severity}</MB></td>
              <td><span style={{ width: 18, height: 18, borderRadius: 4, background: c.color, display: 'inline-block', verticalAlign: 'middle' }} /> <span className="mono text-xs faint">{c.color}</span></td>
              <td className="num">{Math.floor(Math.random() * 80) + 5}</td>
              <td><MB kind="ok" dot>active</MB></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RCTable() {
  const rcs = [
    { cat: 'Machine', cause: 'Print head misalignment', cor: 'Re-calibrate print head', sev: 'Major' },
    { cat: 'Machine', cause: 'Ink supply low', cor: 'Refill ink cartridge', sev: 'Minor' },
    { cat: 'Material', cause: 'Adhesive contamination', cor: 'Replace material roll', sev: 'Major' },
    { cat: 'Method', cause: 'Lamination temp too high', cor: 'Adjust laminator setting', sev: 'Major' },
    { cat: 'Operator', cause: 'Incorrect setup', cor: 'Re-train operator', sev: 'Minor' },
    { cat: 'Environment', cause: 'Humidity above threshold', cor: 'Adjust AC, log condition', sev: 'Minor' },
  ];
  return (
    <table className="table">
      <thead><tr><th>Category</th><th>Specific cause</th><th>Standard corrective</th><th>Severity</th></tr></thead>
      <tbody>{rcs.map((r, i) => (
        <tr key={i}><td><MB kind="accent">{r.cat}</MB></td><td>{r.cause}</td><td className="muted">{r.cor}</td><td><MB kind={r.sev === 'Critical' ? 'ng' : r.sev === 'Major' ? 'warn' : 'info'}>{r.sev}</MB></td></tr>
      ))}</tbody>
    </table>
  );
}

function CustomersTable() {
  const rows = [
    { code: 'AHM', name: 'PT Astra Honda Motor', city: 'Jakarta', sla: '98% yield' },
    { code: 'YIMM', name: 'PT Yamaha Indonesia Motor', city: 'Jakarta', sla: '97% yield' },
    { code: 'SIM', name: 'PT Suzuki Indomobil Motor', city: 'Bekasi', sla: '96% yield' },
    { code: 'KIM', name: 'PT Kawasaki Motor Indonesia', city: 'Cikarang', sla: '97% yield' },
  ];
  return (
    <table className="table">
      <thead><tr><th>Code</th><th>Name</th><th>City</th><th>SLA</th></tr></thead>
      <tbody>{rows.map(r => (<tr key={r.code}><td className="mono">{r.code}</td><td>{r.name}</td><td>{r.city}</td><td>{r.sla}</td></tr>))}</tbody>
    </table>
  );
}

function ShiftsTable() {
  const rows = [
    { name: 'Shift 1', start: '06:00', end: '14:00', days: 'Mon-Sat' },
    { name: 'Shift 2', start: '14:00', end: '22:00', days: 'Mon-Sat' },
    { name: 'Shift 3', start: '22:00', end: '06:00', days: 'Mon-Sat' },
  ];
  return (
    <table className="table">
      <thead><tr><th>Shift</th><th>Start</th><th>End</th><th>Days</th><th>Active</th></tr></thead>
      <tbody>{rows.map(r => (<tr key={r.name}><td>{r.name}</td><td className="num">{r.start}</td><td className="num">{r.end}</td><td>{r.days}</td><td><MB kind="ok" dot>active</MB></td></tr>))}</tbody>
    </table>
  );
}

function MaterialsTable() {
  const rows = [
    { code: 'MAT-PVC-001', name: 'PVC Glossy White', sup: 'Avery Dennison', cost: 'Rp 22.500/m²' },
    { code: 'MAT-PVC-002', name: 'PVC Matte White', sup: 'Avery Dennison', cost: 'Rp 23.000/m²' },
    { code: 'MAT-PET-001', name: 'Polyester Clear', sup: '3M', cost: 'Rp 31.200/m²' },
    { code: 'MAT-VIN-001', name: 'Vinyl Reflective', sup: 'Oracal', cost: 'Rp 48.000/m²' },
  ];
  return (
    <table className="table">
      <thead><tr><th>Code</th><th>Name</th><th>Supplier</th><th>Cost</th></tr></thead>
      <tbody>{rows.map(r => (<tr key={r.code}><td className="mono">{r.code}</td><td>{r.name}</td><td>{r.sup}</td><td className="num">{r.cost}</td></tr>))}</tbody>
    </table>
  );
}

function CamerasTable() {
  return (
    <table className="table">
      <thead><tr><th>Camera</th><th>Line</th><th>Resolution</th><th>Last calibrated</th><th>Confidence threshold</th><th>Status</th></tr></thead>
      <tbody>{window.MOCK.LINES.map(l => (
        <tr key={l.id}>
          <td className="mono">CAM-{l.id}</td>
          <td>{l.name}</td>
          <td className="text-sm">3840 × 2160</td>
          <td className="text-sm">12 May 2026</td>
          <td className="num">0.85</td>
          <td><MB kind={l.status === 'maint' ? 'warn' : 'ok'} dot>{l.status === 'maint' ? 'maintenance' : 'online'}</MB></td>
        </tr>
      ))}</tbody>
    </table>
  );
}

window.Master = Master;
