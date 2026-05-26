// App entry — routing, theme, layout
const { Sidebar, Topbar } = window.Shell;

function App() {
  const [active, setActive] = useState(localStorage.getItem('stikqc.page') || 'dashboard');
  const [collapsed, setCollapsed] = useState(JSON.parse(localStorage.getItem('stikqc.collapsed') || 'false'));
  const [theme, setTheme] = useState(localStorage.getItem('stikqc.theme') || 'light');
  const [liveMode, setLiveMode] = useState(false);
  const [openInspectionId, setOpenInspectionId] = useState(null);
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('stikqc.theme', theme);
  }, [theme]);
  useEffect(() => localStorage.setItem('stikqc.page', active), [active]);
  useEffect(() => localStorage.setItem('stikqc.collapsed', JSON.stringify(collapsed)), [collapsed]);

  useEffect(() => {
    const onClick = () => setNotifOpen(false);
    if (notifOpen) {
      const t = setTimeout(() => window.addEventListener('click', onClick), 0);
      return () => { clearTimeout(t); window.removeEventListener('click', onClick); };
    }
  }, [notifOpen]);

  const crumbs = useMemo(() => {
    const map = {
      dashboard: ['Production', 'Dashboard'],
      live: ['Production', 'Live Monitoring'],
      inspections: ['Production', 'Inspections'],
      defects: ['Quality', 'Defect Review'],
      reports: ['Quality', 'Reports'],
      master: ['Admin', 'Master Data'],
      users: ['Admin', 'User Management'],
      settings: ['Admin', 'System Settings'],
    };
    return map[active] || ['Home'];
  }, [active]);

  let content;
  if (active === 'dashboard') content = <window.Dashboard openInspection={(r) => { setOpenInspectionId(r.id); setActive('inspections'); }} />;
  else if (active === 'live') content = null;
  else if (active === 'inspections') content = <window.Inspections openId={openInspectionId} setOpenId={setOpenInspectionId} />;
  else if (active === 'defects') content = <window.Defects />;
  else if (active === 'reports') content = <window.Reports />;
  else if (active === 'master') content = <window.Master />;
  else if (active === 'users') content = <window.Users />;
  else if (active === 'settings') content = <SystemSettings />;

  // Live mode = fullscreen takeover
  if (liveMode || active === 'live') {
    return (
      <div className="app live-mode">
        <main className="main" style={{ overflow: 'hidden' }}>
          <window.Live onExit={() => { setLiveMode(false); if (active === 'live') setActive('dashboard'); }} />
        </main>
      </div>
    );
  }

  return (
    <div className={`app ${collapsed ? 'collapsed' : ''}`}>
      <Sidebar active={active} setActive={(id) => { setActive(id); if (id === 'live') setLiveMode(true); }} collapsed={collapsed} setCollapsed={setCollapsed} />
      <Topbar
        crumbs={crumbs}
        theme={theme} setTheme={setTheme}
        onLive={() => setLiveMode(true)}
        notifOpen={notifOpen}
        setNotifOpen={setNotifOpen}
      />
      <main className="main">{content}</main>
    </div>
  );
}

function SystemSettings() {
  const cards = [
    { icon: 'siren', title: 'Alarm thresholds', sub: 'NG spike & yield drop rules' },
    { icon: 'wifi', title: 'MQTT broker', sub: 'Mosquitto · production.broker.local:1883' },
    { icon: 'database', title: 'Data retention', sub: 'Raw 90d · aggregates 5y' },
    { icon: 'image', title: 'Image storage', sub: 'MinIO · bucket sticker-images' },
    { icon: 'mail', title: 'Email delivery', sub: 'Resend · smtp.pabrik.id' },
    { icon: 'shield-check', title: 'Audit log', sub: '20.4M events retained' },
  ];
  return (
    <div className="page">
      <div style={{ marginBottom: 14 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600 }}>System Settings</h1>
        <p className="muted" style={{ margin: '4px 0 0', fontSize: 13 }}>Administer integrations, thresholds, and platform-level config.</p>
      </div>
      <div className="grid-3">
        {cards.map((c, i) => (
          <div key={i} className="card" style={{ padding: 16, cursor: 'pointer' }}>
            <div className="row gap-2">
              <span style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--accent-soft)', color: 'var(--accent-ink)', display: 'grid', placeItems: 'center' }}>
                <Icon name={c.icon} size={17} />
              </span>
              <div>
                <div style={{ fontWeight: 600 }}>{c.title}</div>
                <div className="text-xs faint">{c.sub}</div>
              </div>
              <span style={{ flex: 1 }} />
              <Icon name="chevron-right" size={14} className="faint" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Mount
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
