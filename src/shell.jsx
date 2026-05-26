// Shell — Sidebar + Topbar
const { Badge: SBadge } = window.UI;

function Sidebar({ active, setActive, collapsed, setCollapsed }) {
  const nav = [
    { section: 'Main' },
    { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
    { id: 'live', label: 'Live Monitoring', icon: 'monitor-play' },
    { id: 'inspections', label: 'Inspections', icon: 'clipboard-list' },
    { section: 'Quality' },
    { id: 'defects', label: 'Defect Review', icon: 'alert-circle', badge: 7 },
    { id: 'reports', label: 'Reports', icon: 'file-bar-chart-2' },
    { section: 'Admin' },
    { id: 'master', label: 'Master Data', icon: 'database' },
    { id: 'users', label: 'User Management', icon: 'users-round' },
  ];
  return (
    <aside className="sidebar" aria-label="Sidebar">
      <div className="brand">
        <div className="brand-mark"></div>
        <div className="brand-text">
          <span>StikQC</span>
          <small>Quality Monitoring</small>
        </div>
      </div>
      <nav className="nav">
        {nav.map((n, i) => n.section
          ? <div key={'sec' + i} className="nav-section">{n.section}</div>
          : (
            <div key={n.id} className={`nav-item ${active === n.id ? 'active' : ''}`} onClick={() => setActive(n.id)} tabIndex={0}>
              <Icon name={n.icon} size={17} />
              <span className="label">{n.label}</span>
              {n.badge && <span className="badge-mini">{n.badge}</span>}
            </div>
          )
        )}
      </nav>
      <div className="nav-collapse-toggle" onClick={() => setCollapsed(c => !c)} title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
        <Icon name={collapsed ? 'panel-left-open' : 'panel-left-close'} size={16} />
      </div>
    </aside>
  );
}

function Topbar({ crumbs, theme, setTheme, onLive, notifOpen, setNotifOpen }) {
  const userMenuRef = useRef(null);
  const [userOpen, setUserOpen] = useState(false);

  useEffect(() => {
    const onClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserOpen(false);
    };
    window.addEventListener('click', onClick);
    return () => window.removeEventListener('click', onClick);
  }, []);

  return (
    <header className="topbar" role="banner">
      <div className="crumbs">
        {crumbs.map((c, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="sep"><Icon name="chevron-right" size={13} /></span>}
            <span className={i === crumbs.length - 1 ? 'current' : ''}>{c}</span>
          </React.Fragment>
        ))}
      </div>

      <div className="spacer" />

      <div className="search" tabIndex={0} role="searchbox" aria-label="Global search">
        <Icon name="search" size={14} />
        <span>Cari inspection number, SKU, line…</span>
        <kbd>⌘K</kbd>
      </div>

      <span className="health-pill" title="All MQTT brokers + cameras online">
        <span className="dot" /> System Healthy
      </span>

      <button className="btn ghost sm" onClick={onLive} title="Open fullscreen live view">
        <Icon name="maximize" size={14} /> Live Wall
      </button>

      <div style={{ width: 1, height: 24, background: 'var(--border)' }} />

      {/* Order from RIGHT to LEFT: theme → notif → user (per requirements) */}
      <button
        className="icon-btn"
        onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
        title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        aria-label="Toggle theme"
      >
        <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={17} />
      </button>

      <div style={{ position: 'relative' }}>
        <button
          className="icon-btn has-notif"
          onClick={() => setNotifOpen(o => !o)}
          aria-label="Notifications"
        >
          <Icon name="bell" size={17} />
        </button>
        {notifOpen && <NotifDropdown onClose={() => setNotifOpen(false)} />}
      </div>

      <div style={{ position: 'relative' }} ref={userMenuRef}>
        <button className="avatar-btn" onClick={() => setUserOpen(o => !o)} aria-label="User menu">
          <span className="avatar">RK</span>
          <span className="avatar-meta">
            <span>Rina K.</span>
            <small>Quality Manager</small>
          </span>
          <Icon name="chevron-down" size={14} />
        </button>
        {userOpen && (
          <div className="dropmenu" style={{ minWidth: 220 }}>
            <header style={{ display: 'block', padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="avatar lg">RK</span>
                <div>
                  <div style={{ fontWeight: 600 }}>Rina Kusuma</div>
                  <div className="faint text-xs">rina.k@pabrik.id</div>
                </div>
              </div>
            </header>
            <div className="item"><div className="ico" style={{ background: 'var(--surface-2)' }}><Icon name="user" size={15} /></div><div><div className="title">My Profile</div></div></div>
            <div className="item"><div className="ico" style={{ background: 'var(--surface-2)' }}><Icon name="shield-check" size={15} /></div><div><div className="title">Permissions</div></div></div>
            <div className="item"><div className="ico" style={{ background: 'var(--surface-2)' }}><Icon name="settings" size={15} /></div><div><div className="title">Preferences</div></div></div>
            <div className="item"><div className="ico" style={{ background: 'var(--ng-soft)', color: 'var(--ng)' }}><Icon name="log-out" size={15} /></div><div><div className="title">Sign Out</div></div></div>
          </div>
        )}
      </div>
    </header>
  );
}

function NotifDropdown({ onClose }) {
  const items = window.MOCK.NOTIFICATIONS;
  return (
    <div className="dropmenu" style={{ minWidth: 360 }} onClick={(e) => e.stopPropagation()}>
      <header>
        <strong>Notifications</strong>
        <span className="faint text-xs">{items.length} new</span>
      </header>
      <div>
        {items.map(n => (
          <div key={n.id} className="item">
            <div className="ico" style={{ background: `var(--${n.color === 'accent' ? 'accent-soft' : n.color + '-soft'})`, color: `var(--${n.color === 'accent' ? 'accent-ink' : n.color})` }}>
              <Icon name={n.icon} size={14} />
            </div>
            <div>
              <div className="title">{n.title}</div>
              <div className="sub">{n.sub}</div>
            </div>
            <div className="time">{n.time}</div>
          </div>
        ))}
      </div>
      <div style={{ padding: '10px 14px', display: 'flex', justifyContent: 'space-between' }}>
        <button className="btn ghost xs">Mark all as read</button>
        <button className="btn ghost xs">View all</button>
      </div>
    </div>
  );
}

window.Shell = { Sidebar, Topbar };
