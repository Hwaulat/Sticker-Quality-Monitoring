// Reports — Simple data table with date range filter
const { Badge: RBadge } = window.UI;

function Reports() {
  const [dateFrom, setDateFrom] = useState('2026-05-20');
  const [dateTo, setDateTo] = useState('2026-05-26');
  const [selectedLine, setSelectedLine] = useState('all');
  const [selectedShift, setSelectedShift] = useState('all');
  const [selectedDefect, setSelectedDefect] = useState('all');

  // Get unique lines, shifts and defects from mock data
  const uniqueLines = ['all', ...new Set(window.MOCK.INSPECTIONS.map(ins => ins.lineName))].sort((a, b) => (a === 'all' ? -1 : a.localeCompare(b)));
  const uniqueShifts = ['all', ...new Set(window.MOCK.INSPECTIONS.map(ins => ins.shift))].sort((a, b) => (a === 'all' ? -1 : String(a).localeCompare(b)));
  const uniqueDefects = ['all', ...new Set(window.MOCK.INSPECTIONS.flatMap(ins => ins.defects))].filter(Boolean).sort((a, b) => a.localeCompare(b));

  // Filter inspections by date range, line, shift and defect
  const filtered = window.MOCK.INSPECTIONS.filter(ins => {
    const insDate = new Date(ins.ts).toISOString().split('T')[0];
    const dateMatch = insDate >= dateFrom && insDate <= dateTo;
    const lineMatch = selectedLine === 'all' || ins.lineName === selectedLine;
    const shiftMatch = selectedShift === 'all' || ins.shift === selectedShift;
    const defectMatch = selectedDefect === 'all' || (ins.defects && ins.defects.includes(selectedDefect));
    return dateMatch && lineMatch && shiftMatch && defectMatch;
  });

  const handleDateFromChange = (e) => setDateFrom(e.target.value);
  const handleDateToChange = (e) => setDateTo(e.target.value);
  const handleLineChange = (e) => setSelectedLine(e.target.value);
  const handleShiftChange = (e) => setSelectedShift(e.target.value);
  const handleDefectChange = (e) => setSelectedDefect(e.target.value);

  const downloadExcel = () => {
    if (filtered.length === 0) {
      alert('No data to export');
      return;
    }

    // Create CSV content
    const headers = ['ID', 'Time', 'Line', 'SKU', 'Verdict', 'Confidence', 'Defects', 'Operator', 'Shift', 'Status'];
    const rows = filtered.map(ins => [
      ins.id,
      new Date(ins.ts).toLocaleString(),
      ins.lineName,
      ins.skuName,
      ins.verdict,
      (ins.confidence * 100).toFixed(1) + '%',
      ins.defects.length > 0 ? ins.defects.join(', ') : '—',
      ins.operator,
      ins.shift,
      ins.reviewed ? 'Reviewed' : 'Pending',
    ]);

    // Escape CSV values
    const escapeCSV = (val) => {
      const str = String(val);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const csvContent = [
      headers.map(escapeCSV).join(','),
      ...rows.map(row => row.map(escapeCSV).join(',')),
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    const filename = `inspection_report_${dateFrom}_to_${dateTo}.csv`;
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.click();
    
    URL.revokeObjectURL(url);
  };

  return (
    <div className="page">
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600 }}>Reports</h1>
        <p className="muted" style={{ margin: '4px 0 0', fontSize: 13 }}>Inspection data filtered by date range.</p>
      </div>

      {/* Date Range Filter */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-body">
          <div className="row gap-4" style={{ alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 6, color: 'var(--text-muted)' }}>From date</label>
              <input 
                type="date" 
                value={dateFrom} 
                onChange={handleDateFromChange}
                style={{ padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 6, fontSize: 13, width: '100%' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 6, color: 'var(--text-muted)' }}>To date</label>
              <input 
                type="date" 
                value={dateTo} 
                onChange={handleDateToChange}
                style={{ padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 6, fontSize: 13, width: '100%' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 6, color: 'var(--text-muted)' }}>Production line</label>
              <select 
                value={selectedLine} 
                onChange={handleLineChange}
                style={{ padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 6, fontSize: 13, width: '100%', background: 'white' }}
              >
                {uniqueLines.map(line => (
                  <option key={line} value={line}>
                    {line === 'all' ? 'All lines' : line}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ width: 200 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 6, color: 'var(--text-muted)' }}>Shift</label>
              <select value={selectedShift} onChange={handleShiftChange} style={{ padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 6, fontSize: 13, width: '100%', background: 'white' }}>
                {uniqueShifts.map(s => <option key={s} value={s}>{s === 'all' ? 'All shifts' : s}</option>)}
              </select>
            </div>
            <div style={{ width: 220 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 6, color: 'var(--text-muted)' }}>Defect</label>
              <select value={selectedDefect} onChange={handleDefectChange} style={{ padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 6, fontSize: 13, width: '100%', background: 'white' }}>
                <option value="all">All defects</option>
                {uniqueDefects.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <button 
              onClick={downloadExcel}
              className="btn primary"
              title="Download as Excel/CSV"
            >
              <Icon name="download" size={14} /> Download Excel
            </button>
            {/* <div style={{ color: 'var(--text-muted)', fontSize: 13, minWidth: 80, textAlign: 'right' }}>
              {filtered.length} records
            </div> */}
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="card">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)' }}>ID</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)' }}>Time</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)' }}>Line</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)' }}>SKU</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, color: 'var(--text-muted)' }}>Verdict</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, color: 'var(--text-muted)' }}>Confidence</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)' }}>Defects</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)' }}>Operator</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)' }}>Shift</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((ins, i) => (
                <tr key={ins.id} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'transparent' : 'var(--surface-2)' }}>
                  <td style={{ padding: '10px 16px', fontSize: 12 }}><code style={{ background: 'var(--surface-2)', padding: '2px 6px', borderRadius: 3 }}>{ins.id}</code></td>
                  <td style={{ padding: '10px 16px', fontSize: 12, color: 'var(--text-muted)' }}>{new Date(ins.ts).toLocaleString()}</td>
                  <td style={{ padding: '10px 16px', fontWeight: 500 }}>{ins.lineName}</td>
                  <td style={{ padding: '10px 16px' }}>{ins.skuName}</td>
                  <td style={{ padding: '10px 16px', textAlign: 'center' }}>
                    <RBadge kind={ins.verdict === 'OK' ? 'ok' : 'ng'}>{ins.verdict}</RBadge>
                  </td>
                  <td style={{ padding: '10px 16px', textAlign: 'center', fontSize: 12, color: 'var(--text-muted)' }}>
                    {(ins.confidence * 100).toFixed(1)}%
                  </td>
                  <td style={{ padding: '10px 16px', fontSize: 12 }}>
                    {ins.defects.length > 0 ? ins.defects.join(', ') : '—'}
                  </td>
                  <td style={{ padding: '10px 16px', fontSize: 12 }}>{ins.operator}</td>
                  <td style={{ padding: '10px 16px', fontSize: 12 }}>{ins.shift}</td>
                  <td style={{ padding: '10px 16px' }}>
                    <RBadge kind={ins.reviewed ? 'ok' : 'warn'}>{ins.reviewed ? 'Reviewed' : 'Pending'}</RBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

window.Reports = Reports;

