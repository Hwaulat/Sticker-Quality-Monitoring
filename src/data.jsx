// Mock data for the Sticker Quality Monitoring app

const DEFECT_CATEGORIES = [
  { code: 'MISALIGN', name: 'Misalignment', severity: 'Major', color: '#dc2626' },
  { code: 'BUBBLE', name: 'Bubble', severity: 'Major', color: '#f59e0b' },
  { code: 'SCRATCH', name: 'Scratch', severity: 'Minor', color: '#6366f1' },
  { code: 'TEAR', name: 'Tear / Cut', severity: 'Critical', color: '#be123c' },
  { code: 'COLOR_OFF', name: 'Color Deviation', severity: 'Major', color: '#0891b2' },
  { code: 'BLUR', name: 'Blurry Print', severity: 'Major', color: '#7c3aed' },
  { code: 'INK_SPOT', name: 'Ink Spot / Smear', severity: 'Minor', color: '#0f766e' },
  { code: 'MISSING_INK', name: 'Missing Ink', severity: 'Major', color: '#ea580c' },
  { code: 'WRONG_TEXT', name: 'Wrong Text/Logo', severity: 'Critical', color: '#b91c1c' },
  { code: 'DIM_OUT_TOL', name: 'Dimension Out of Tol', severity: 'Major', color: '#a16207' },
  { code: 'WRINKLE', name: 'Wrinkle / Crease', severity: 'Minor', color: '#65a30d' },
  { code: 'CONTAMINATION', name: 'Contamination', severity: 'Minor', color: '#9333ea' },
  { code: 'EDGE_DEFECT', name: 'Edge Defect', severity: 'Minor', color: '#0369a1' },
  { code: 'ADHESIVE_ISSUE', name: 'Adhesive Issue', severity: 'Major', color: '#525252' },
];

const LINES = [
  { id: 'L01', code: 'L01', name: 'Line 01', stickerType: 'small', target: 1200, yield: 98.4, ok: 1227, ng: 20, total: 1247, status: 'running', operator: 'Andi P.', shift: 'Shift 2', lastInspectionSec: 2 },
  { id: 'L02', code: 'L02', name: 'Line 02', stickerType: 'medium', target: 900, yield: 96.1, ok: 884, ng: 36, total: 920, status: 'running', operator: 'Budi S.', shift: 'Shift 2', lastInspectionSec: 1, alarm: true, alarmMsg: 'NG spike — 6 NG in last 60s' },
  { id: 'L03', code: 'L03', name: 'Line 03', stickerType: 'small', target: 1200, yield: 99.1, ok: 1145, ng: 10, total: 1155, status: 'running', operator: 'Citra L.', shift: 'Shift 2', lastInspectionSec: 4 },
  { id: 'L04', code: 'L04', name: 'Line 04', stickerType: 'medium', target: 900, yield: 97.8, ok: 730, ng: 16, total: 746, status: 'running', operator: 'Dewi R.', shift: 'Shift 2', lastInspectionSec: 3 },
  { id: 'L05', code: 'L05', name: 'Line 05', stickerType: 'small', target: 1200, yield: 0, ok: 0, ng: 0, total: 0, status: 'maint', operator: '—', shift: 'Shift 2', lastInspectionSec: null },
  { id: 'L06', code: 'L06', name: 'Line 06', stickerType: 'medium', target: 900, yield: 94.2, ok: 432, ng: 26, total: 458, status: 'calib', operator: 'Eko W.', shift: 'Shift 2', lastInspectionSec: 22 },
];

const SKUS = [
  { sku: 'STK-HND-S-001', name: 'Honda Wing Logo S', type: 'small', customer: 'PT Astra Honda' },
  { sku: 'STK-HND-S-002', name: 'Honda Tank Warning S', type: 'small', customer: 'PT Astra Honda' },
  { sku: 'STK-YMH-M-014', name: 'Yamaha NMAX Body M', type: 'medium', customer: 'PT Yamaha Indonesia' },
  { sku: 'STK-YMH-M-022', name: 'Yamaha Aerox Strip M', type: 'medium', customer: 'PT Yamaha Indonesia' },
  { sku: 'STK-SUZ-S-007', name: 'Suzuki Address S', type: 'small', customer: 'PT Suzuki Indomobil' },
];

// Trend buckets — last 12 hours (today)
const HOURLY_TREND = [
  { t: '08:00', ok: 421, ng: 5, total: 426, yield: 98.8 },
  { t: '09:00', ok: 462, ng: 7, total: 469, yield: 98.5 },
  { t: '10:00', ok: 487, ng: 9, total: 496, yield: 98.2 },
  { t: '11:00', ok: 451, ng: 14, total: 465, yield: 97.0 },
  { t: '12:00', ok: 310, ng: 6, total: 316, yield: 98.1 },
  { t: '13:00', ok: 415, ng: 8, total: 423, yield: 98.1 },
  { t: '14:00', ok: 478, ng: 11, total: 489, yield: 97.8 },
  { t: '15:00', ok: 492, ng: 18, total: 510, yield: 96.5 },
  { t: '16:00', ok: 466, ng: 22, total: 488, yield: 95.5 },
  { t: '17:00', ok: 488, ng: 12, total: 500, yield: 97.6 },
  { t: '18:00', ok: 423, ng: 9, total: 432, yield: 97.9 },
  { t: '19:00', ok: 125, ng: 3, total: 128, yield: 97.7 },
];

// Defect Pareto (today)
const PARETO = [
  { name: 'Misalign', count: 38, code: 'MISALIGN' },
  { name: 'Color Dev.', count: 29, code: 'COLOR_OFF' },
  { name: 'Bubble', count: 18, code: 'BUBBLE' },
  { name: 'Ink Spot', count: 14, code: 'INK_SPOT' },
  { name: 'Scratch', count: 9, code: 'SCRATCH' },
  { name: 'Edge', count: 6, code: 'EDGE_DEFECT' },
  { name: 'Blur', count: 4, code: 'BLUR' },
  { name: 'Contam.', count: 3, code: 'CONTAMINATION' },
];

const YIELD_BY_LINE = LINES.filter(l => l.total > 0).map(l => ({ line: l.name, yield: l.yield }));

const DEFECT_DIST = [
  { name: 'Misalign', value: 38, color: '#dc2626' },
  { name: 'Color', value: 29, color: '#0891b2' },
  { name: 'Bubble', value: 18, color: '#f59e0b' },
  { name: 'Ink Spot', value: 14, color: '#0f766e' },
  { name: 'Scratch', value: 9, color: '#6366f1' },
  { name: 'Edge', value: 6, color: '#0369a1' },
  { name: 'Other', value: 7, color: '#94a3b8' },
];

const THROUGHPUT = HOURLY_TREND.map((p, i) => ({
  t: p.t,
  L01: 200 + Math.round(Math.sin(i / 2) * 30) + 220,
  L02: 180 + Math.round(Math.cos(i / 2) * 25) + 180,
  L03: 210 + Math.round(Math.sin(i / 3) * 20) + 200,
  L04: 140 + Math.round(Math.cos(i / 4) * 18) + 160,
  target: 400,
}));

// Recent inspections (mix of OK and NG)
function pad(n, w = 3) { return String(n).padStart(w, '0'); }
const NOW = new Date('2026-05-26T19:14:00');
function ago(seconds) { const d = new Date(NOW.getTime() - seconds * 1000); return d; }
function fmtTime(d) {
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}
function fmtAgo(d) {
  const s = Math.floor((NOW - d) / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  return `${Math.floor(m / 60)}h ago`;
}

const INSPECTIONS = (() => {
  const list = [];
  const totals = 60;
  let ngSeq = [3, 12, 18, 25, 41, 58, 67, 84, 91, 102, 117, 128, 144, 158, 173, 190, 206, 219]; // seconds ago
  for (let i = 0; i < totals; i++) {
    const sec = i * 7 + Math.floor(Math.random() * 5);
    const verdict = ngSeq.includes(sec) || (i % 9 === 5 && i > 1) ? 'NG' : 'OK';
    const line = LINES[i % 4];
    const sku = SKUS[i % SKUS.length];
    const confidence = verdict === 'OK' ? 0.92 + Math.random() * 0.07 : 0.78 + Math.random() * 0.18;
    const defects = verdict === 'NG'
      ? [DEFECT_CATEGORIES[i % DEFECT_CATEGORIES.length].code].concat(i % 5 === 0 ? [DEFECT_CATEGORIES[(i + 3) % DEFECT_CATEGORIES.length].code] : [])
      : [];
    const w = sku.type === 'small' ? 50 : 120;
    const h = sku.type === 'small' ? 30 : 80;
    list.push({
      id: `INS-202605-${pad(2200 + totals - i, 6)}`,
      ts: ago(sec),
      lineId: line.id,
      lineName: line.name,
      sku: sku.sku,
      skuName: sku.name,
      type: sku.type,
      verdict,
      confidence,
      defects,
      width: w + (Math.random() - 0.5) * 1.4,
      height: h + (Math.random() - 0.5) * 1.4,
      widthTol: true,
      heightTol: true,
      colorDeviation: verdict === 'NG' ? 18 + Math.random() * 25 : Math.random() * 8,
      printQuality: verdict === 'NG' ? 60 + Math.random() * 20 : 88 + Math.random() * 10,
      operator: line.operator,
      shift: line.shift,
      reviewed: verdict === 'OK' || i % 4 === 0,
      design: 'v2.3',
    });
  }
  return list;
})();

const RECENT_NG = INSPECTIONS.filter(i => i.verdict === 'NG').slice(0, 8);

// Notifications
const NOTIFICATIONS = [
  { id: 1, type: 'critical', icon: 'siren', title: 'NG Spike on Line 02', sub: '6 NG events in last 60s — threshold breached', time: '2m', color: 'ng' },
  { id: 2, type: 'warning', icon: 'trending-down', title: 'Yield dropping on Line 06', sub: 'Yield 94.2% below target 96%', time: '14m', color: 'warn' },
  { id: 3, type: 'info', icon: 'wrench', title: 'Calibration due — Camera CAM-04', sub: 'Last calibrated 28 days ago', time: '1h', color: 'info' },
  { id: 4, type: 'info', icon: 'file-text', title: 'Shift 1 report generated', sub: 'Ready for review and distribution', time: '6h', color: 'accent' },
];

// Users for management page
const USERS = [
  { id: 'u01', name: 'Rina Kusuma', email: 'rina.k@pabrik.id', role: 'Quality Manager', lines: ['L01', 'L02', 'L03', 'L04', 'L05', 'L06'], shift: '—', status: 'active', last: '2 min ago', initials: 'RK' },
  { id: 'u02', name: 'Hendra Wijaya', email: 'hendra.w@pabrik.id', role: 'Plant Manager', lines: ['All'], shift: '—', status: 'active', last: '18 min ago', initials: 'HW' },
  { id: 'u03', name: 'Andi Pratama', email: 'andi.p@pabrik.id', role: 'Operator', lines: ['L01'], shift: 'Shift 2', status: 'active', last: 'now', initials: 'AP' },
  { id: 'u04', name: 'Budi Santoso', email: 'budi.s@pabrik.id', role: 'Operator', lines: ['L02'], shift: 'Shift 2', status: 'active', last: 'now', initials: 'BS' },
  { id: 'u05', name: 'Citra Lestari', email: 'citra.l@pabrik.id', role: 'Line Supervisor', lines: ['L01', 'L02', 'L03'], shift: 'Shift 2', status: 'active', last: '5 min ago', initials: 'CL' },
  { id: 'u06', name: 'Made Sukma', email: 'made.s@pabrik.id', role: 'Quality Engineer', lines: ['L01', 'L02'], shift: '—', status: 'active', last: '32 min ago', initials: 'MS' },
  { id: 'u07', name: 'Tono Hartono', email: 'tono.h@pabrik.id', role: 'Super Admin', lines: ['All'], shift: '—', status: 'active', last: '2 days ago', initials: 'TH' },
  { id: 'u08', name: 'Sari Wulan', email: 'sari.w@pabrik.id', role: 'Viewer', lines: ['L01'], shift: '—', status: 'inactive', last: '14 days ago', initials: 'SW' },
];

const ROLES = [
  { name: 'Super Admin', color: '#7c3aed', count: 1 },
  { name: 'Plant Manager', color: '#0f766e', count: 1 },
  { name: 'Quality Manager', color: '#4f46e5', count: 1 },
  { name: 'Quality Engineer', color: '#0891b2', count: 1 },
  { name: 'Line Supervisor', color: '#2563eb', count: 1 },
  { name: 'Operator', color: '#16a34a', count: 2 },
  { name: 'Viewer', color: '#64748b', count: 1 },
];

// Aggregate dashboard KPIs
const KPI_TOTALS = (() => {
  const total = LINES.reduce((s, l) => s + l.total, 0);
  const ok = LINES.reduce((s, l) => s + l.ok, 0);
  const ng = LINES.reduce((s, l) => s + l.ng, 0);
  const yld = (ok / Math.max(1, total)) * 100;
  return { total, ok, ng, yld };
})();

window.MOCK = {
  DEFECT_CATEGORIES, LINES, SKUS, HOURLY_TREND, PARETO, YIELD_BY_LINE, DEFECT_DIST, THROUGHPUT,
  INSPECTIONS, RECENT_NG, NOTIFICATIONS, USERS, ROLES, KPI_TOTALS, NOW,
};
window.fmtTime = fmtTime;
window.fmtAgo = fmtAgo;
