// App entry — routing, theme, layout
const { Sidebar, Topbar } = window.Shell;

function App() {
  const [active, setActive] = useState(() => {
    const saved = localStorage.getItem('stikqc.page');
    return saved === 'settings' ? 'dashboard' : saved || 'dashboard';
  });
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

// Mount
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
