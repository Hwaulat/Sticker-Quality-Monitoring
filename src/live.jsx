// Live Monitoring — fullscreen view designed for factory floor displays
const { Badge: LB, StatusBadge: LSB } = window.UI;

function LivePanel({ line }) {
  // Generate a stable recent-verdicts strip from the line stats
  const dots = useMemo(() => {
    const len = 30;
    const arr = [];
    const ngIdx = line.alarm ? [4, 7, 11, 14, 18, 22] : (line.total ? [12, 25] : []);
    for (let i = 0; i < len; i++) arr.push(ngIdx.includes(i) ? 'ng' : 'ok');
    return arr;
  }, [line]);

  return (
    <div className={`live-panel ${line.alarm ? 'alarm' : ''}`}>
      <div className="title">
        <strong>{line.name}</strong>
        <Badge kind={line.stickerType === 'small' ? 'info' : 'accent'}>{line.stickerType === 'small' ? 'STICKER SMALL' : 'STICKER MEDIUM'}</Badge>
        <span style={{ flex: 1 }} />
        <LSB status={line.status} />
      </div>

      <div className="verdicts-row">
        <div className="v-block ok">
          <div className="label"><Icon name="check-check" size={15} /> OK</div>
          <div className="big">{line.ok.toLocaleString()}</div>
        </div>
        <div className="v-block ng">
          <div className="label"><Icon name="x" size={15} /> NG</div>
          <div className="big">{line.ng.toLocaleString()}</div>
        </div>
      </div>

      <div className="yield-block">
        <div>
          <div className="l">Yield</div>
          <div className="big" style={{ color: line.yield >= 98 ? 'var(--ok)' : line.yield >= 95 ? 'var(--warn)' : 'var(--ng)' }}>
            {line.total ? line.yield.toFixed(1) + '%' : '— '}
          </div>
        </div>
        <div className="delta" style={{ display: 'flex', flexDirection: 'column', textAlign: 'right' }}>
          <span className="faint text-xs">vs target 98%</span>
          <span style={{ color: line.yield >= 98 ? 'var(--ok)' : 'var(--ng)', fontWeight: 600 }}>
            {line.total ? (line.yield - 98).toFixed(2) : '—'}%
          </span>
        </div>
      </div>

      <div className="strip">
        <div className="label">Recent 30 verdicts</div>
        <div className="recent-dots">
          {dots.map((s, i) => <span key={i} className={`v ${s === 'ng' ? 'ng' : ''}`} title={`#${i + 1}`} />)}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 6 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
          <Icon name="user-round" size={14} className="faint" /> {line.operator}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
          <Icon name="clock" size={14} className="faint" /> {line.lastInspectionSec != null ? `last ${line.lastInspectionSec}s ago` : 'idle'}
        </span>
        <span style={{ flex: 1 }} />
        <button className="btn sm ghost"><Icon name="video" size={13} /> Camera</button>
      </div>
    </div>
  );
}

function Live({ onExit }) {
  const [audio, setAudio] = useState(true);
  const alarms = window.MOCK.LINES.filter(l => l.alarm);
  return (
    <div className="live-shell" tabIndex={-1}>
      <div className="live-header">
        <div className="brand-mark" style={{ width: 34, height: 34, borderRadius: 9 }}></div>
        <div>
          <div style={{ fontWeight: 600 }}>Live Production Wall</div>
          <div className="faint text-xs">Real-time inspection — 6 lines · Plant A</div>
        </div>
        <div style={{ flex: 1 }} />

        <span className="health-pill"><span className="dot" /> Streaming · 0.4s lag</span>

        <div className="row gap-2 text-sm muted">
          <Icon name="clipboard-check" size={14} /> <span className="num">{window.MOCK.KPI_TOTALS.total.toLocaleString()}</span>
          <span className="faint">·</span>
          <Icon name="trending-up" size={14} /> <span className="num">{window.MOCK.KPI_TOTALS.yld.toFixed(2)}%</span>
        </div>

        <div style={{ width: 1, height: 24, background: 'var(--border)' }} />

        <button className="btn sm ghost" onClick={() => setAudio(a => !a)} title="Toggle audible alarms">
          <Icon name={audio ? 'volume-2' : 'volume-x'} size={14} /> Audio
        </button>
        <button className="btn sm ghost" onClick={onExit}>
          <Icon name="minimize-2" size={14} /> Exit Fullscreen
        </button>
      </div>

      {alarms.length > 0 && (
        <div className="live-banner">
          <Icon name="siren" size={16} />
          <strong>ALERT:</strong>
          {alarms.map(a => <span key={a.id}>{a.name} — {a.alarmMsg}</span>)}
          <span style={{ flex: 1 }} />
          <button className="btn xs" style={{ background: 'rgba(255,255,255,.18)', color: 'white', borderColor: 'transparent' }}>
            <Icon name="check" size={12} /> Acknowledge
          </button>
        </div>
      )}

      <div className="live-grid">
        {window.MOCK.LINES.map(l => <LivePanel key={l.id} line={l} />)}
      </div>
    </div>
  );
}

window.Live = Live;
