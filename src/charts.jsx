// Custom SVG chart components — replaces Recharts
// Lightweight, minimalist, dark/light-mode aware

const { useChartColors: useCC } = window.UI;

// Generic tooltip overlay using hovered index state
function useHover() {
  const [idx, setIdx] = useState(null);
  return [idx, setIdx];
}

function Tooltip({ x, y, items, title }) {
  if (!items || items.length === 0) return null;
  return (
    <div style={{
      position: 'absolute', left: x, top: y, pointerEvents: 'none',
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 8, padding: '8px 10px', fontSize: 12, boxShadow: 'var(--shadow-md)',
      minWidth: 120, transform: 'translate(8px, 8px)', zIndex: 5,
    }}>
      {title && <div style={{ fontWeight: 600, marginBottom: 4 }}>{title}</div>}
      {items.map((it, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 8, height: 8, background: it.color, borderRadius: 2 }} />
          <span style={{ flex: 1 }} className="muted">{it.label}</span>
          <span className="num" style={{ fontWeight: 600 }}>{it.value}</span>
        </div>
      ))}
    </div>
  );
}

// ---- Stacked Bar + Line (Trend) ----
function StackedBarLineChart({ data, height = 280, view = 'stacked' }) {
  const C = useCC();
  const ref = useRef(null);
  const [w, setW] = useState(600);
  const [hover, setHover] = useHover();

  useEffect(() => {
    if (!ref.current) return;
    const obs = new ResizeObserver(es => setW(es[0].contentRect.width));
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const pad = { l: 36, r: 36, t: 14, b: 28 };
  const innerW = Math.max(0, w - pad.l - pad.r);
  const innerH = height - pad.t - pad.b;
  const maxVal = Math.max(...data.map(d => d.ok + d.ng)) * 1.1 || 1;
  const slot = innerW / data.length;
  const barW = view === 'side' ? Math.min(18, slot * 0.32) : Math.min(28, slot * 0.55);

  const yScale = (v) => pad.t + innerH - (v / maxVal) * innerH;
  const yScalePct = (v) => pad.t + innerH - ((v - 80) / 20) * innerH;

  // ticks
  const yTicks = [0, Math.round(maxVal / 3), Math.round((2 * maxVal) / 3), Math.round(maxVal)];

  // line path
  const linePath = data.map((d, i) => {
    const x = pad.l + i * slot + slot / 2;
    const y = yScalePct(d.yield);
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%', height }}>
      <svg width={w} height={height} style={{ overflow: 'visible' }}>
        {/* grid lines */}
        {yTicks.map((t, i) => (
          <g key={i}>
            <line x1={pad.l} x2={w - pad.r} y1={yScale(t)} y2={yScale(t)} stroke={C.grid} strokeDasharray="2 3" />
            <text x={pad.l - 6} y={yScale(t)} textAnchor="end" fontSize="10" fill={C.text} dy="3">{t}</text>
          </g>
        ))}
        {/* right axis (yield %) */}
        {[80, 90, 100].map((p, i) => (
          <text key={i} x={w - pad.r + 6} y={yScalePct(p)} fontSize="10" fill={C.text} dy="3">{p}%</text>
        ))}

        {/* bars */}
        {data.map((d, i) => {
          const cx = pad.l + i * slot + slot / 2;
          const okH = (d.ok / maxVal) * innerH;
          const ngH = (d.ng / maxVal) * innerH;
          if (view === 'side') {
            return (
              <g key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
                <rect x={cx - barW - 1} y={pad.t + innerH - okH} width={barW} height={okH} fill={C.ok} rx={2} />
                <rect x={cx + 1} y={pad.t + innerH - ngH} width={barW} height={ngH} fill={C.ng} rx={2} />
                <rect x={cx - slot / 2} y={pad.t} width={slot} height={innerH} fill="transparent" />
              </g>
            );
          }
          if (view === 'line') {
            return <rect key={i} x={cx - slot / 2} y={pad.t} width={slot} height={innerH} fill="transparent"
              onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} />;
          }
          return (
            <g key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
              <rect x={cx - barW / 2} y={pad.t + innerH - okH} width={barW} height={okH} fill={C.ok} />
              <rect x={cx - barW / 2} y={pad.t + innerH - okH - ngH} width={barW} height={ngH} fill={C.ng} rx={3} />
              <rect x={cx - slot / 2} y={pad.t} width={slot} height={innerH} fill="transparent" />
            </g>
          );
        })}

        {/* yield line */}
        <path d={linePath} fill="none" stroke={C.warn} strokeWidth="2" strokeDasharray="4 3" />
        {data.map((d, i) => (
          <circle key={i} cx={pad.l + i * slot + slot / 2} cy={yScalePct(d.yield)} r={hover === i ? 5 : 3} fill={C.warn} />
        ))}

        {/* x labels */}
        {data.map((d, i) => (
          <text key={i} x={pad.l + i * slot + slot / 2} y={height - 6} fontSize="10.5" fill={C.text} textAnchor="middle">{d.t}</text>
        ))}

        {/* hover guide */}
        {hover != null && (
          <line x1={pad.l + hover * slot + slot / 2} x2={pad.l + hover * slot + slot / 2} y1={pad.t} y2={pad.t + innerH} stroke={C.text} strokeDasharray="2 2" opacity="0.4" />
        )}
      </svg>

      {/* Tooltip */}
      {hover != null && (
        <Tooltip
          x={pad.l + hover * slot + slot / 2}
          y={pad.t + 10}
          title={data[hover].t}
          items={[
            { label: 'OK', value: data[hover].ok, color: C.ok },
            { label: 'NG', value: data[hover].ng, color: C.ng },
            { label: 'Yield', value: data[hover].yield.toFixed(1) + '%', color: C.warn },
          ]}
        />
      )}

      {/* legend */}
      <div style={{ position: 'absolute', bottom: -2, left: pad.l, display: 'flex', gap: 12 }}>
        <span className="legend-item"><span className="legend-swatch" style={{ background: C.ok }} /> OK</span>
        <span className="legend-item"><span className="legend-swatch" style={{ background: C.ng }} /> NG</span>
        <span className="legend-item"><span className="legend-swatch" style={{ background: C.warn }} /> Yield %</span>
      </div>
    </div>
  );
}

// ---- Pareto Bar + cumulative line ----
function ParetoBarChart({ data, height = 280 }) {
  const C = useCC();
  const ref = useRef(null);
  const [w, setW] = useState(600);
  const [hover, setHover] = useHover();
  useEffect(() => { if (!ref.current) return; const obs = new ResizeObserver(es => setW(es[0].contentRect.width)); obs.observe(ref.current); return () => obs.disconnect(); }, []);

  const pad = { l: 36, r: 36, t: 14, b: 48 };
  const innerW = Math.max(0, w - pad.l - pad.r);
  const innerH = height - pad.t - pad.b;
  const total = data.reduce((s, d) => s + d.count, 0);
  let cum = 0;
  const processed = data.map(d => { cum += d.count; return { ...d, cumPct: (cum / total) * 100 }; });

  const maxCnt = Math.max(...data.map(d => d.count)) * 1.15;
  const slot = innerW / data.length;
  const barW = Math.min(36, slot * 0.66);

  const yScale = (v) => pad.t + innerH - (v / maxCnt) * innerH;
  const yScalePct = (v) => pad.t + innerH - (v / 100) * innerH;

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%', height }}>
      <svg width={w} height={height} style={{ overflow: 'visible' }}>
        {[0, 0.5, 1].map((t, i) => (
          <g key={i}>
            <line x1={pad.l} x2={w - pad.r} y1={pad.t + innerH * t} y2={pad.t + innerH * t} stroke={C.grid} strokeDasharray="2 3" />
            <text x={pad.l - 6} y={pad.t + innerH * t} textAnchor="end" fontSize="10" fill={C.text} dy="3">{Math.round(maxCnt * (1 - t))}</text>
          </g>
        ))}
        {[0, 50, 100].map((p, i) => (
          <text key={i} x={w - pad.r + 6} y={yScalePct(p)} fontSize="10" fill={C.text} dy="3">{p}%</text>
        ))}
        {/* 80% reference */}
        <line x1={pad.l} x2={w - pad.r} y1={yScalePct(80)} y2={yScalePct(80)} stroke={C.ng} strokeDasharray="4 3" opacity="0.6" />
        <text x={w - pad.r - 4} y={yScalePct(80) - 4} textAnchor="end" fontSize="10" fill={C.ng}>80% target</text>

        {processed.map((d, i) => {
          const cx = pad.l + i * slot + slot / 2;
          const h = (d.count / maxCnt) * innerH;
          return (
            <g key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
              <rect x={cx - barW / 2} y={pad.t + innerH - h} width={barW} height={h} fill={hover === i ? C.accent : `color-mix(in oklab, ${C.accent} 85%, transparent)`} rx={4} />
              <rect x={cx - slot / 2} y={pad.t} width={slot} height={innerH} fill="transparent" />
            </g>
          );
        })}
        {/* cumulative line */}
        <path
          d={processed.map((d, i) => `${i === 0 ? 'M' : 'L'} ${pad.l + i * slot + slot / 2} ${yScalePct(d.cumPct)}`).join(' ')}
          fill="none" stroke={C.warn} strokeWidth="2"
        />
        {processed.map((d, i) => (
          <circle key={i} cx={pad.l + i * slot + slot / 2} cy={yScalePct(d.cumPct)} r={hover === i ? 5 : 3} fill={C.warn} stroke="var(--surface)" strokeWidth="1.5" />
        ))}

        {processed.map((d, i) => (
          <g key={i}>
            <text x={pad.l + i * slot + slot / 2} y={height - pad.b + 14} fontSize="10.5" fill={C.text} textAnchor="end"
              transform={`rotate(-18, ${pad.l + i * slot + slot / 2}, ${height - pad.b + 14})`}>{d.name}</text>
          </g>
        ))}
      </svg>
      {hover != null && (
        <Tooltip
          x={pad.l + hover * slot + slot / 2} y={pad.t + 10}
          title={processed[hover].name}
          items={[
            { label: 'Count', value: processed[hover].count, color: C.accent },
            { label: 'Cumulative', value: processed[hover].cumPct.toFixed(1) + '%', color: C.warn },
          ]}
        />
      )}
    </div>
  );
}

// ---- Horizontal Bar (yield by line) ----
function HorizontalBarChart({ data, height = 280, valueKey = 'yield', labelKey = 'line', min = 80, max = 100, target = 98 }) {
  const C = useCC();
  const ref = useRef(null);
  const [w, setW] = useState(400);
  const [hover, setHover] = useHover();
  useEffect(() => { if (!ref.current) return; const obs = new ResizeObserver(es => setW(es[0].contentRect.width)); obs.observe(ref.current); return () => obs.disconnect(); }, []);

  const pad = { l: 72, r: 24, t: 18, b: 24 };
  const innerW = Math.max(0, w - pad.l - pad.r);
  const innerH = height - pad.t - pad.b;
  const slot = innerH / data.length;
  const barH = Math.min(24, slot * 0.62);

  const xScale = (v) => pad.l + ((v - min) / (max - min)) * innerW;
  const colorFor = (v) => v >= 98 ? C.ok : v >= 95 ? C.warn : C.ng;

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%', height }}>
      <svg width={w} height={height} style={{ overflow: 'visible' }}>
        {/* vertical grid */}
        {[80, 85, 90, 95, 100].map((t, i) => (
          <g key={i}>
            <line x1={xScale(t)} x2={xScale(t)} y1={pad.t} y2={pad.t + innerH} stroke={C.grid} strokeDasharray="2 3" />
            <text x={xScale(t)} y={height - 6} fontSize="10" fill={C.text} textAnchor="middle">{t}%</text>
          </g>
        ))}
        {/* target line */}
        <line x1={xScale(target)} x2={xScale(target)} y1={pad.t} y2={pad.t + innerH} stroke={C.accent} strokeDasharray="4 3" />
        <text x={xScale(target)} y={pad.t - 4} fill={C.accent} fontSize="10" textAnchor="middle">Target {target}%</text>

        {data.map((d, i) => {
          const y = pad.t + i * slot + slot / 2;
          const v = d[valueKey];
          return (
            <g key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
              <text x={pad.l - 8} y={y + 4} textAnchor="end" fontSize="11.5" fill={C.text}>{d[labelKey]}</text>
              <rect x={pad.l} y={y - barH / 2} width={innerW} height={barH} fill={C.grid} opacity="0.3" rx={3} />
              <rect x={pad.l} y={y - barH / 2} width={Math.max(0, xScale(v) - pad.l)} height={barH} fill={colorFor(v)} rx={3} />
              <text x={xScale(v) + 6} y={y + 4} fontSize="11" fill={colorFor(v)} fontWeight="600">{v.toFixed(1)}%</text>
              <rect x={pad.l} y={y - slot / 2} width={innerW} height={slot} fill="transparent" />
            </g>
          );
        })}
      </svg>
      {hover != null && (
        <Tooltip
          x={pad.l + 20} y={pad.t + hover * slot - 24}
          title={data[hover][labelKey]}
          items={[{ label: 'Yield', value: data[hover][valueKey].toFixed(2) + '%', color: colorFor(data[hover][valueKey]) }]}
        />
      )}
    </div>
  );
}

// ---- Donut chart ----
function DonutChart({ data, size = 180, total }) {
  const radius = size / 2;
  const inner = radius * 0.65;
  const t = total ?? data.reduce((s, d) => s + d.value, 0);
  let cumAngle = -Math.PI / 2;
  const arcs = data.map(d => {
    const angle = (d.value / t) * 2 * Math.PI;
    const start = cumAngle;
    const end = cumAngle + angle;
    cumAngle = end;
    const x1 = radius + Math.cos(start) * radius;
    const y1 = radius + Math.sin(start) * radius;
    const x2 = radius + Math.cos(end) * radius;
    const y2 = radius + Math.sin(end) * radius;
    const x3 = radius + Math.cos(end) * inner;
    const y3 = radius + Math.sin(end) * inner;
    const x4 = radius + Math.cos(start) * inner;
    const y4 = radius + Math.sin(start) * inner;
    const large = angle > Math.PI ? 1 : 0;
    const path = `M ${x1} ${y1} A ${radius} ${radius} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${inner} ${inner} 0 ${large} 0 ${x4} ${y4} Z`;
    return { ...d, path };
  });

  return (
    <svg width={size} height={size} style={{ overflow: 'visible' }}>
      {arcs.map((a, i) => (
        <path key={i} d={a.path} fill={a.color} stroke="var(--surface)" strokeWidth="2" />
      ))}
    </svg>
  );
}

// ---- Multi-line chart ----
function MultiLineChart({ data, series, height = 280, xKey = 't', target }) {
  const C = useCC();
  const ref = useRef(null);
  const [w, setW] = useState(600);
  const [hover, setHover] = useHover();
  useEffect(() => { if (!ref.current) return; const obs = new ResizeObserver(es => setW(es[0].contentRect.width)); obs.observe(ref.current); return () => obs.disconnect(); }, []);

  const pad = { l: 32, r: 16, t: 12, b: 28 };
  const innerW = Math.max(0, w - pad.l - pad.r);
  const innerH = height - pad.t - pad.b;

  const allVals = data.flatMap(d => series.map(s => d[s.key]));
  const maxV = Math.max(...allVals) * 1.1;
  const slot = innerW / (data.length - 1 || 1);

  const xScale = (i) => pad.l + i * slot;
  const yScale = (v) => pad.t + innerH - (v / maxV) * innerH;

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%', height }}>
      <svg width={w} height={height} style={{ overflow: 'visible' }}>
        {[0, 0.5, 1].map((t, i) => (
          <g key={i}>
            <line x1={pad.l} x2={w - pad.r} y1={pad.t + innerH * t} y2={pad.t + innerH * t} stroke={C.grid} strokeDasharray="2 3" />
            <text x={pad.l - 6} y={pad.t + innerH * t} textAnchor="end" fontSize="10" fill={C.text} dy="3">{Math.round(maxV * (1 - t))}</text>
          </g>
        ))}

        {target != null && (
          <>
            <line x1={pad.l} x2={w - pad.r} y1={yScale(target)} y2={yScale(target)} stroke={C.warn} strokeDasharray="4 3" />
            <text x={w - pad.r - 4} y={yScale(target) - 4} fill={C.warn} fontSize="10" textAnchor="end">Target {target}</text>
          </>
        )}

        {data.map((d, i) => (
          <text key={i} x={xScale(i)} y={height - 8} fontSize="10.5" fill={C.text} textAnchor="middle">{d[xKey]}</text>
        ))}

        {series.map((s, si) => {
          const path = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(d[s.key])}`).join(' ');
          return (
            <g key={si}>
              <path d={path} fill="none" stroke={s.color} strokeWidth="2" />
              {data.map((d, i) => (
                <circle key={i} cx={xScale(i)} cy={yScale(d[s.key])} r={hover === i ? 4 : 0} fill={s.color} />
              ))}
            </g>
          );
        })}

        {/* hover */}
        {data.map((d, i) => (
          <rect key={i} x={xScale(i) - slot / 2} y={pad.t} width={slot} height={innerH} fill="transparent"
            onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} />
        ))}
        {hover != null && (
          <line x1={xScale(hover)} x2={xScale(hover)} y1={pad.t} y2={pad.t + innerH} stroke={C.text} strokeDasharray="2 2" opacity="0.4" />
        )}
      </svg>

      {hover != null && (
        <Tooltip
          x={xScale(hover)} y={pad.t}
          title={data[hover][xKey]}
          items={series.map(s => ({ label: s.label, value: data[hover][s.key], color: s.color }))}
        />
      )}

      <div style={{ position: 'absolute', top: -4, right: 8, display: 'flex', gap: 10 }}>
        {series.map((s, i) => (
          <span key={i} className="legend-item"><span className="legend-swatch" style={{ background: s.color }} /> {s.label}</span>
        ))}
      </div>
    </div>
  );
}

window.Charts = { StackedBarLineChart, ParetoBarChart, HorizontalBarChart, DonutChart, MultiLineChart };
