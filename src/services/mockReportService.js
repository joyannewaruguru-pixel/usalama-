import { buildSeedReports, STATUSES } from '../data/mockReports.js';

const DAY = 24 * 60 * 60 * 1000;
let reports = buildSeedReports();

const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));
const clone = (value) => JSON.parse(JSON.stringify(value));

function inRange(report, range) {
  if (!range || range === 'all') return true;
  return Date.now() - new Date(report.submittedAt).getTime() <= Number(range) * DAY;
}

export async function listReports() {
  await delay();
  return clone(reports);
}

export async function getReportById(id) {
  await delay(250);
  const found = reports.find((r) => r.id === id);
  return found ? clone(found) : null;
}

export async function queryReports({
  search = '',
  category = '',
  status = '',
  range = 'all',
  sort = 'newest',
  page = 1,
  pageSize = 10,
} = {}) {
  await delay();
  const term = search.trim().toLowerCase();
  let items = reports.filter((r) => {
    if (category && r.category !== category) return false;
    if (status && r.status !== status) return false;
    if (!inRange(r, range)) return false;
    if (term && !`${r.reference} ${r.description} ${r.category}`.toLowerCase().includes(term)) return false;
    return true;
  });
  items = items.sort((a, b) => {
    const diff = new Date(a.submittedAt) - new Date(b.submittedAt);
    return sort === 'oldest' ? diff : -diff;
  });
  const total = items.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), pageCount);
  const start = (safePage - 1) * pageSize;
  return {
    items: clone(items.slice(start, start + pageSize)),
    total,
    page: safePage,
    pageCount,
    hasAny: reports.length > 0,
  };
}

export async function updateReport(id, { status, priority, note }) {
  await delay(500);
  const index = reports.findIndex((r) => r.id === id);
  if (index === -1) throw new Error('Report not found.');
  const current = reports[index];
  const now = new Date().toISOString();
  const internalNotes = note && note.trim()
    ? [
        ...current.internalNotes,
        { id: `note-${Date.now()}`, author: 'Demo Administrator', createdAt: now, text: note.trim() },
      ]
    : current.internalNotes;
  reports[index] = { ...current, status, priority, internalNotes, updatedAt: now };
  return clone(reports[index]);
}

export async function getDashboardStats() {
  await delay();
  const count = (s) => reports.filter((r) => r.status === s).length;
  const weeks = 8;
  const now = Date.now();
  const trend = Array.from({ length: weeks }, (_, i) => {
    const end = now - (weeks - 1 - i) * 7 * DAY;
    const start = end - 7 * DAY;
    const label = new Date(end).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    const value = reports.filter((r) => {
      const t = new Date(r.submittedAt).getTime();
      return t > start && t <= end;
    }).length;
    return { label, reports: value };
  });
  const recent = [...reports]
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
    .slice(0, 6);
  return clone({
    totals: {
      total: reports.length,
      awaitingReview: count('Received'),
      underInvestigation: count('Under Investigation'),
      closed: count('Closed'),
    },
    trend,
    recent,
  });
}

export async function getStatistics(range = '30') {
  await delay();
  const scoped = reports.filter((r) => inRange(r, range));
  const tally = (key) => {
    const map = new Map();
    scoped.forEach((r) => map.set(r[key], (map.get(r[key]) || 0) + 1));
    return map;
  };
  const byCategory = [...tally('category').entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
  const statusMap = tally('status');
  const byStatus = STATUSES.map((name) => ({ name, value: statusMap.get(name) || 0 })).filter((d) => d.value > 0);
  const priorityMap = tally('priority');
  const byPriority = ['Low', 'Medium', 'High', 'Urgent'].map((name) => ({ name, value: priorityMap.get(name) || 0 }));

  const days = range === 'all' ? 90 : Number(range);
  const bucket = days > 30 ? 7 : 1;
  const points = Math.ceil(days / bucket);
  const now = Date.now();
  const overTime = Array.from({ length: points }, (_, i) => {
    const end = now - (points - 1 - i) * bucket * DAY;
    const start = end - bucket * DAY;
    return {
      label: new Date(end).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
      reports: scoped.filter((r) => {
        const t = new Date(r.submittedAt).getTime();
        return t > start && t <= end;
      }).length,
    };
  });
  return clone({ total: scoped.length, byCategory, byStatus, byPriority, overTime });
}

export async function lookupCitizenReport(reference) {
  await delay();
  const found = reports.find((r) => r.reference.toLowerCase() === reference.trim().toLowerCase());
  if (!found) return null;
  return {
    reference: found.reference,
    category: found.category,
    submittedAt: found.submittedAt,
    status: found.status,
    updatedAt: found.updatedAt,
  };
}