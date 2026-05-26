// Dashboard page
const { Badge, StatusBadge, ToggleGroup, useChartColors, SectionHead, StickerThumb } = window.UI;
const { StackedBarLineChart, ParetoBarChart, HorizontalBarChart, DonutChart, MultiLineChart } = window.Charts;

function FilterBar({ filters, setFilters, right }) {
  return (
    <div className="card" style={{ position: 'sticky', top: 0, zIndex: 5, padding: 0, marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', flexWrap: 'wrap' }}>
        <div className="field" style={{ minWidth: 220 }}>
          <Icon name="calendar" size={14} />
          <span style={{ color: 'var(--text)' }}>26 May 2026</span>
          <span className="faint">— Today</span>
          <Icon name="chevron-down" size={13} />
        </div>
        <div className="field">
          <Icon name="layers" size={14} />
          <span className="field-label">Shift</span>
          <span>All</span>
          <Icon name="chevron-down" size={13} />
        </div>
        <div className="field">
          <Icon name="factory" size={14} />
          <span className="field-label">Line</span>
          <span>6 of 6</span>
          <Icon name="chevron-down" size={13} />
        </div>
        <ToggleGroup
          options={[{ value: 'all', label: 'All' }, { value: 'small', label: 'Small' }, { value: 'medium', label: 'Medium' }]}
          value={filters.type}
          onChange={(v) => setFilters(f => ({ ...f, type: v }))}
        />
        <div className="field">
          <Icon name="sticker" size={14} />
          <span className="field-label">SKU</span>
          <span>All</span>
          <Icon name="chevron-down" size={13} />
        </div>
        <div style={{ flex: 1 }} />
        <span className="badge ok dot" style={{ fontWeight: 500 }}>
          Live · streaming
        </span>
        <button className="btn sm ghost"><Icon name="rotate-cw" size={13} /> Refresh</button>
        {right}
      </div>
    </div>
  );
}

function KpiRow() {
  const { total, ok, ng, yld } = window.MOCK.KPI_TOTALS;
  const tone = yld >= 98 ? 'ok' : yld >= 95 ? 'warn' : 'ng';
  const cards = [
    { label: 'Total Inspected', num: total.toLocaleString(), icon: 'clipboard-check', delta: { dir: 'up', text: '+8.4% vs yesterday' } },
    { label: 'OK Count', num: ok.toLocaleString(), icon: 'circle-check', tone: 'ok', delta: { dir: 'up', text: '+8.6% vs yesterday' } },
    { label: 'NG Count', num: ng.toLocaleString(), icon: 'circle-x', tone: 'ng', delta: { dir: 'down', text: '+12 vs yesterday' } },
    { label: 'Yield', num: yld.toFixed(2) + '%', icon: 'trending-up', tone, delta: { dir: 'up', text: '+0.4% vs target 98%' } },
    { label: 'Avg Cycle Time', num: '0.82s', icon: 'timer', delta: { dir: 'up', text: '−0.04s vs last hour' } },
    // { label: 'Throughput / hr', num: '1,240', icon: 'gauge', delta: { dir: 'up', text: '+3.1% vs target' } },
  ];
  return (
    <div className="kpi-grid">
      {cards.map((k, i) => (
        <div key={i} className="kpi">
          <div className="label">
            <Icon name={k.icon} size={14} className="ico" />
            {k.label}
          </div>
          <div className={`num ${k.tone || ''}`}>{k.num}</div>
          <div className={`delta ${k.delta.dir}`}>
            <Icon name={k.delta.dir === 'up' ? 'trending-up' : 'trending-down'} size={12} />
            {k.delta.text}
          </div>
        </div>
      ))}
    </div>
  );
}

function LineCard({ line, onView }) {
  return (
    <div className={`line-card ${line.alarm ? 'alarm' : ''}`}>
      {line.alarm && (
        <div style={{
          position: 'absolute', top: -10, right: 16, background: 'var(--ng)', color: 'white',
          padding: '2px 8px', borderRadius: 999, fontSize: 11, fontWeight: 600, display: 'flex', gap: 4, alignItems: 'center'
        }}>
          <Icon name="siren" size={11} /> ALERT
        </div>
      )}
      <div className="top">
        <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--surface-2)', display: 'grid', placeItems: 'center', color: 'var(--accent)' }}>
          <Icon name={line.stickerType === 'small' ? 'sticker' : 'rectangle-horizontal'} size={18} />
        </div>
        <div>
          <div className="name">{line.name}</div>
          <div className="sub">Sticker {line.stickerType === 'small' ? 'Small' : 'Medium'} · {line.shift}</div>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <StatusBadge status={line.status} />
        </div>
      </div>

      <div className="stats">
        <div className="stat"><div className="v" style={{ color: line.yield >= 98 ? 'var(--ok)' : line.yield >= 95 ? 'var(--warn)' : 'var(--ng)' }}>{line.total ? line.yield.toFixed(1) + '%' : '—'}</div><div className="l">Yield</div></div>
        <div className="stat"><div className="v">{line.total.toLocaleString()}</div><div className="l">Inspected</div></div>
        <div className="stat"><div className="v" style={{ color: 'var(--ok)' }}>{line.ok.toLocaleString()}</div><div className="l">OK</div></div>
        <div className="stat"><div className="v" style={{ color: 'var(--ng)' }}>{line.ng.toLocaleString()}</div><div className="l">NG</div></div>
      </div>

      <div className="verdict-strip" aria-label="Recent verdicts">
        {Array.from({ length: 24 }).map((_, i) => {
          const ng = (line.alarm && [3, 7, 11, 14, 18, 21].includes(i)) || (!line.alarm && (i === 4 || i === 17));
          return <span key={i} className={`v ${ng ? 'ng' : ''}`} title={`Inspection ${i}`} />;
        })}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 4, borderTop: '1px solid var(--border)' }}>
        <Icon name="user" size={13} className="faint" />
        <span className="text-xs muted">{line.operator}</span>
        <span style={{ flex: 1 }} />
        <span className="text-xs faint">
          {line.lastInspectionSec != null ? `${line.lastInspectionSec}s ago` : 'idle'}
        </span>
      </div>

      {/* <div style={{ display: 'flex', gap: 6 }}>
        <button className="btn sm" style={{ flex: 1 }} onClick={() => onView?.(line)}>
          <Icon name="bar-chart-2" size={13} /> Details
        </button>
        <button className="btn sm">
          <Icon name="video" size={13} /> Live Feed
        </button>
      </div> */}
    </div>
  );
}

function TrendChart() {
  const [view, setView] = useState('stacked');
  return (
    <div className="card">
      <div className="card-head">
        <h3>OK vs NG Trend</h3>
        <span className="sub">— per hour, today</span>
        <div style={{ flex: 1 }} />
        <ToggleGroup
          options={[{ value: 'today', label: 'Today' }, { value: 'week', label: 'Week' }, { value: 'month', label: 'Month' }]}
          value="today" onChange={() => {}} />
        <div style={{ width: 8 }} />
        <ToggleGroup
          options={[{ value: 'stacked', label: 'Stacked' }, { value: 'side', label: 'Side' }, { value: 'line', label: 'Line' }]}
          value={view} onChange={setView} />
      </div>
      <div className="card-body" style={{ paddingBottom: 30 }}>
        <StackedBarLineChart data={window.MOCK.HOURLY_TREND} view={view} height={280} />
      </div>
    </div>
  );
}

function ParetoChart() {
  return (
    <div className="card">
      <div className="card-head"><h3>Defect Pareto</h3><span className="sub">— vital few causing 80% of NG</span></div>
      <div className="card-body">
        <ParetoBarChart data={window.MOCK.PARETO} height={290} />
      </div>
    </div>
  );
}

function YieldByLineChart() {
  const data = window.MOCK.YIELD_BY_LINE.slice().sort((a, b) => b.yield - a.yield);
  return (
    <div className="card">
      <div className="card-head"><h3>Yield by Line</h3><span className="sub">— sorted desc, target 98%</span></div>
      <div className="card-body">
        <HorizontalBarChart data={data} height={290} valueKey="yield" labelKey="line" />
      </div>
    </div>
  );
}

// function DefectDonut() {
//   const data = window.MOCK.DEFECT_DIST;
//   const total = data.reduce((s, d) => s + d.value, 0);
//   return (
//     <div className="card">
//       <div className="card-head"><h3>Defect Distribution</h3><span className="sub">— today</span></div>
//       <div className="card-body" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
//         <div style={{ position: 'relative', width: 200, height: 200 }}>
//           <DonutChart data={data} size={200} total={total} />
//           <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', pointerEvents: 'none' }}>
//             <div style={{ textAlign: 'center' }}>
//               <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em' }}>{total}</div>
//               <div className="faint text-xs">Total NG</div>
//             </div>
//           </div>
//         </div>
//         <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
//           {data.map((d, i) => (
//             <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5 }}>
//               <span className="legend-swatch" style={{ background: d.color }} />
//               <span style={{ flex: 1 }}>{d.name}</span>
//               <span className="num mono faint">{d.value}</span>
//               <span className="faint text-xs" style={{ width: 38, textAlign: 'right' }}>{((d.value / total) * 100).toFixed(0)}%</span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// function HourlyThroughput() {
//   const palette = ['#0f766e', '#2563eb', '#9333ea', '#ea580c'];
//   const series = ['L01', 'L02', 'L03', 'L04'].map((k, i) => ({ key: k, label: `Line ${k.slice(1)}`, color: palette[i] }));
//   return (
//     <div className="card">
//       <div className="card-head"><h3>Hourly Throughput</h3><span className="sub">— pieces per hour by line</span></div>
//       <div className="card-body" style={{ paddingTop: 20 }}>
//         <MultiLineChart data={window.MOCK.THROUGHPUT} series={series} height={270} target={400} />
//       </div>
//     </div>
//   );
// }

function NGFeed({ onOpen }) {
  return (
    <div className="card">
      <div className="card-head">
        <h3>Recent NG Events</h3>
        <span className="sub">— live feed</span>
        <div style={{ flex: 1 }} />
        <button className="btn sm ghost">Filter <Icon name="chevron-down" size={12} /></button>
        <button className="btn sm">View all NG</button>
      </div>
      <div className="ng-feed">
        {window.MOCK.RECENT_NG.map((row, i) => (
          <div key={row.id} className="ng-row" onClick={() => onOpen?.(row)}>
            <StickerThumb type={row.type} ng />
            <div className="meta">
              <div className="first">
                <span className="id mono">{row.id}</span>
                <Badge kind="ng" dot>NG</Badge>
                <span className="muted">·</span>
                <span>{row.lineName}</span>
                <span className="muted">·</span>
                <span>{row.type === 'small' ? 'Small' : 'Medium'}</span>
              </div>
              <div className="second">
                {row.defects.map(d => {
                  const def = window.MOCK.DEFECT_CATEGORIES.find(c => c.code === d);
                  return <span key={d}><Badge kind="">{def?.name || d}</Badge></span>;
                })}
                <span>·</span>
                <span>conf {(row.confidence * 100).toFixed(0)}%</span>
                <span>·</span>
                <span>{row.operator}</span>
              </div>
            </div>
            <div className="time">{window.fmtAgo(row.ts)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Dashboard({ openInspection }) {
  const [filters, setFilters] = useState({ type: 'all', period: 'today' });
  return (
    <div className="page">
      <FilterBar filters={filters} setFilters={setFilters} />

      <div style={{ display: 'flex', alignItems: 'end', justifyContent: 'space-between', marginBottom: 10 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em' }}>Production Overview</h1>
          <p className="muted" style={{ margin: '4px 0 0', fontSize: 13 }}>
            Real-time view across <span className="num">6</span> active lines · Shift 2 (14:00 – 22:00)
          </p>
        </div>
        <div className="row text-xs faint">
          <Icon name="clock" size={13} /> Updated <span className="num">2s</span> ago
        </div>
      </div>

      <KpiRow />

      <div style={{ marginTop: 14 }}>
        <SectionHead title="Live Line Status" sub="6 lines · 4 running · 1 maintenance · 1 calibrating"
          right={<ToggleGroup options={['Grid', 'Compact']} value="Grid" onChange={() => {}} />} />
        <div className="lines-row">
          {window.MOCK.LINES.map(l => <LineCard key={l.id} line={l} />)}
        </div>
      </div>

      <div style={{ marginTop: 18 }} className="grid-2">
        <TrendChart />
        <NGFeed onOpen={openInspection} />
      </div>

      <div style={{ marginTop: 14 }} className="grid-2">
        <ParetoChart />
        <YieldByLineChart />
      </div>

      <div style={{ marginTop: 14 }} className="grid-2">
        <DefectDonut />
        <HourlyThroughput />
      </div>
    </div>
  );
}

window.Dashboard = Dashboard;
