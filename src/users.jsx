// User Management — 2 tabs: Accounts + Role Permissions
const { Badge: UB, Drawer: UDr } = window.UI;

function Users() {
  const [tab, setTab] = useState('accounts');
  const [editing, setEditing] = useState(null);

  return (
    <div className="page">
      <div style={{ display: 'flex', alignItems: 'end', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em' }}>User Management</h1>
          <p className="muted" style={{ margin: '4px 0 0', fontSize: 13 }}>Manage user accounts and granular role permissions.</p>
        </div>
        {tab === 'accounts' && (
          <button className="btn primary" onClick={() => setEditing({ isNew: true })}>
            <Icon name="user-plus" size={14} /> Invite user
          </button>
        )}
      </div>

      <div className="tabs">
        <button className={tab === 'accounts' ? 'active' : ''} onClick={() => setTab('accounts')}>
          <Icon name="users" size={14} style={{ marginRight: 6 }} /> User Accounts <span className="badge" style={{ marginLeft: 6 }}>{window.MOCK.USERS.length}</span>
        </button>
        <button className={tab === 'roles' ? 'active' : ''} onClick={() => setTab('roles')}>
          <Icon name="shield-check" size={14} style={{ marginRight: 6 }} /> Roles & Permissions
        </button>
      </div>

      {tab === 'accounts' && <UsersAccounts onEdit={setEditing} />}
      {tab === 'roles' && <RolesPermissions />}

      <UDr open={!!editing} onClose={() => setEditing(null)} width={520}>
        {editing && <UserEditor user={editing.isNew ? null : editing} onClose={() => setEditing(null)} />}
      </UDr>
    </div>
  );
}

function roleColor(r) {
  return {
    'Super Admin': '#7c3aed', 'Plant Manager': '#0f766e', 'Quality Manager': '#4f46e5',
    'Quality Engineer': '#0891b2', 'Line Supervisor': '#2563eb', 'Operator': '#16a34a', 'Viewer': '#64748b',
  }[r] || '#64748b';
}

function UsersAccounts({ onEdit }) {
  return (
    <>
      <div className="card" style={{ padding: 10, marginBottom: 12 }}>
        <div className="row gap-2" style={{ flexWrap: 'wrap' }}>
          <div className="field" style={{ minWidth: 240 }}>
            <Icon name="search" size={14} />
            <input placeholder="Search by name or email…" />
          </div>
          <div className="field"><Icon name="shield" size={14} /> <span>All roles</span> <Icon name="chevron-down" size={13} /></div>
          <div className="field"><Icon name="factory" size={14} /> <span>All lines</span> <Icon name="chevron-down" size={13} /></div>
          <div className="field"><Icon name="circle" size={14} /> <span>All statuses</span> <Icon name="chevron-down" size={13} /></div>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="table">
          <thead><tr><th>User</th><th>Role</th><th>Assigned lines</th><th>Shift</th><th>Status</th><th>Last login</th><th></th></tr></thead>
          <tbody>
            {window.MOCK.USERS.map(u => (
              <tr key={u.id} onClick={() => onEdit?.(u)}>
                <td>
                  <div className="row gap-2">
                    <span className="avatar" style={{ background: `linear-gradient(135deg, ${roleColor(u.role)}, color-mix(in oklab, ${roleColor(u.role)} 60%, black))` }}>{u.initials}</span>
                    <div>
                      <div style={{ fontWeight: 500 }}>{u.name}</div>
                      <div className="text-xs faint">{u.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="badge" style={{
                    background: `color-mix(in oklab, ${roleColor(u.role)} 14%, var(--surface))`,
                    color: roleColor(u.role),
                    borderColor: 'transparent',
                    fontWeight: 500,
                  }}>{u.role}</span>
                </td>
                <td className="text-sm">{u.lines.includes('All') ? <UB kind="accent">All lines</UB> : u.lines.map(l => <span key={l} className="badge mono" style={{ marginRight: 3 }}>{l}</span>)}</td>
                <td className="text-sm">{u.shift}</td>
                <td><UB kind={u.status === 'active' ? 'ok' : 'warn'} dot>{u.status}</UB></td>
                <td className="text-sm faint">{u.last}</td>
                <td><button className="btn ghost xs icon-only" onClick={(e) => { e.stopPropagation(); }}><Icon name="more-horizontal" size={14} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function UserEditor({ user, onClose }) {
  const isNew = !user;
  return (
    <>
      <header>
        <h2>{isNew ? 'Invite new user' : 'Edit user'}</h2>
        <div style={{ flex: 1 }} />
        <button className="btn ghost sm icon-only" onClick={onClose}><Icon name="x" size={15} /></button>
      </header>
      <div className="body">
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <span className="avatar lg" style={{ width: 64, height: 64, fontSize: 20, background: `linear-gradient(135deg, ${roleColor(user?.role || 'Operator')}, color-mix(in oklab, ${roleColor(user?.role || 'Operator')} 60%, black))` }}>{user?.initials || 'NU'}</span>
          <div style={{ flex: 1 }}>
            <button className="btn sm ghost"><Icon name="upload" size={13} /> Upload photo</button>
            <p className="text-xs faint" style={{ margin: '6px 0 0' }}>JPG or PNG · 256×256 recommended</p>
          </div>
        </div>
        <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <FormFieldU label="Full name"><InputU defaultValue={user?.name || ''} /></FormFieldU>
          <FormFieldU label="Email"><InputU defaultValue={user?.email || ''} type="email" /></FormFieldU>
          <FormFieldU label="Role">
            <SelectU defaultValue={user?.role || 'Operator'}>
              {window.MOCK.ROLES.map(r => <option key={r.name}>{r.name}</option>)}
            </SelectU>
          </FormFieldU>
          <FormFieldU label="Shift">
            <SelectU defaultValue={user?.shift || '—'}><option>—</option><option>Shift 1</option><option>Shift 2</option><option>Shift 3</option></SelectU>
          </FormFieldU>
          <FormFieldU label="Line access" full>
            <div className="row gap-2" style={{ flexWrap: 'wrap' }}>
              {window.MOCK.LINES.map(l => {
                const on = user?.lines?.includes(l.id) || user?.lines?.includes('All');
                return (
                  <label key={l.id} className="badge" style={{ cursor: 'pointer', padding: '4px 10px', background: on ? 'var(--accent-soft)' : 'var(--surface-2)', color: on ? 'var(--accent-ink)' : 'var(--text-muted)', borderColor: 'transparent' }}>
                    <input type="checkbox" defaultChecked={on} style={{ marginRight: 4, accentColor: 'var(--accent)' }} /> {l.name}
                  </label>
                );
              })}
            </div>
          </FormFieldU>
          <FormFieldU label="Active" full>
            <label className="row gap-2"><input type="checkbox" defaultChecked={user?.status !== 'inactive'} /> <span className="text-sm">User is active</span></label>
          </FormFieldU>
          <FormFieldU label="Notifications" full>
            <div className="col gap-2">
              <label className="row gap-2"><input type="checkbox" defaultChecked /> <span className="text-sm">NG spike alerts</span></label>
              <label className="row gap-2"><input type="checkbox" defaultChecked /> <span className="text-sm">Shift report email</span></label>
              <label className="row gap-2"><input type="checkbox" /> <span className="text-sm">Daily summary digest</span></label>
            </div>
          </FormFieldU>
        </div>

        {isNew && (
          <div style={{ marginTop: 14, padding: 12, background: 'var(--accent-soft)', borderRadius: 10, border: '1px solid var(--border)' }}>
            <div className="row gap-2 text-sm" style={{ color: 'var(--accent-ink)' }}>
              <Icon name="mail" size={14} /> An invitation email with first-login password will be sent automatically.
            </div>
          </div>
        )}
      </div>
      <div className="foot">
        <button className="btn ghost" onClick={onClose}>Cancel</button>
        {!isNew && <button className="btn"><Icon name="key" size={14} /> Reset password</button>}
        <button className="btn primary"><Icon name="check" size={14} /> {isNew ? 'Send invitation' : 'Save changes'}</button>
      </div>
    </>
  );
}

function FormFieldU({ label, children, full }) {
  return (
    <div style={{ gridColumn: full ? '1 / -1' : 'auto' }}>
      <div className="text-xs faint" style={{ marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.04em' }}>{label}</div>
      {children}
    </div>
  );
}
const InputU = (p) => <input {...p} style={{ width: '100%', padding: '7px 10px', border: '1px solid var(--border-strong)', borderRadius: 7, background: 'var(--surface)', color: 'var(--text)', font: 'inherit', fontSize: 13 }} />;
const SelectU = (p) => <select {...p} style={{ width: '100%', padding: '7px 10px', border: '1px solid var(--border-strong)', borderRadius: 7, background: 'var(--surface)', color: 'var(--text)', font: 'inherit', fontSize: 13 }}>{p.children}</select>;

function RolesPermissions() {
  const cats = [
    { name: 'Dashboard', perms: ['View All', 'View Own Line'] },
    { name: 'Inspections', perms: ['View', 'Override Verdict', 'Bulk Override', 'Export'] },
    { name: 'Defect Review', perms: ['Review', 'Assign Root Cause', 'Close'] },
    { name: 'Reports', perms: ['Generate', 'Schedule', 'Distribute'] },
    { name: 'Master Data', perms: ['View', 'Edit'] },
    { name: 'User Management', perms: ['View', 'Edit Users', 'Manage Roles'] },
    { name: 'System', perms: ['Vision Config', 'Line Config', 'Alarms'] },
  ];
  const roles = window.MOCK.ROLES;
  const accessMap = {
    'Super Admin': () => true,
    'Plant Manager': (cat, p) => !['Manage Roles', 'Edit Users'].includes(p),
    'Quality Manager': (cat, p) => !['User Management', 'System'].includes(cat) || (cat === 'System' && p === 'Alarms'),
    'Quality Engineer': (cat) => ['Dashboard', 'Inspections', 'Defect Review', 'Reports'].includes(cat),
    'Line Supervisor': (cat, p) => (cat === 'Dashboard' && p === 'View Own Line') || (cat === 'Inspections' && ['View', 'Export'].includes(p)),
    'Operator': (cat, p) => (cat === 'Dashboard' && p === 'View Own Line') || (cat === 'Inspections' && p === 'View'),
    'Viewer': (cat, p) => p.startsWith('View') || p === 'View',
  };

  return (
    <div className="grid-2" style={{ gridTemplateColumns: '260px 1fr' }}>
      <div className="card" style={{ padding: 10 }}>
        <div className="text-xs faint" style={{ padding: '6px 10px', textTransform: 'uppercase', letterSpacing: '.04em' }}>Roles</div>
        {roles.map(r => (
          <div key={r.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 10px', borderRadius: 8, cursor: 'pointer' }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: r.color }} />
            <span style={{ flex: 1, fontWeight: 500, fontSize: 13 }}>{r.name}</span>
            <span className="text-xs faint num">{r.count}</span>
          </div>
        ))}
        <div className="divider" />
        <button className="btn ghost sm" style={{ width: '100%', justifyContent: 'center' }}><Icon name="plus" size={13} /> Add custom role</button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="matrix">
            <thead>
              <tr>
                <th>Capability</th>
                {roles.map(r => <th key={r.name} style={{ minWidth: 96 }}>{r.name.split(' ').map(w => w[0]).join('')}</th>)}
              </tr>
            </thead>
            <tbody>
              {cats.map(cat => (
                <React.Fragment key={cat.name}>
                  <tr><td colSpan={roles.length + 1} style={{ background: 'var(--surface-2)', fontWeight: 600, fontSize: 11.5, textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--text-muted)', textAlign: 'left' }}>{cat.name}</td></tr>
                  {cat.perms.map(p => (
                    <tr key={cat.name + p}>
                      <td>{p}</td>
                      {roles.map(r => {
                        const on = accessMap[r.name]?.(cat.name, p);
                        return <td key={r.name}>
                          <span className={`perm-pill ${on ? 'on' : 'off'}`}>
                            {on ? <Icon name="check" size={12} strokeWidth={3} /> : <Icon name="minus" size={12} />}
                          </span>
                        </td>;
                      })}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        <div className="row gap-2" style={{ padding: '10px 14px', borderTop: '1px solid var(--border)' }}>
          <span className="text-xs faint">Click any cell to toggle permission. Changes require Super Admin approval.</span>
          <span style={{ flex: 1 }} />
          <button className="btn ghost sm"><Icon name="rotate-ccw" size={13} /> Reset to default</button>
          <button className="btn primary sm"><Icon name="save" size={13} /> Save matrix</button>
        </div>
      </div>
    </div>
  );
}

window.Users = Users;
