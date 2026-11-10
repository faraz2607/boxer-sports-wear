import { csvValue, parseCsvRows } from '../../common/csv';
import { canonical, FILES, ID_PREFIXES, nextId, validateRow } from './config';

const normalizeHeaders = (row) =>
  Object.fromEntries(
    Object.entries(row).map(([key, value]) => [key.toLowerCase().replace(/[\s_-]/g, ''), value]),
  );
export const escapeCsv = (value) => {
  const text = String(value ?? '');
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};
export const rowsFromCsv = (type, text, existingRows) => {
  const records = parseCsvRows(text).map(normalizeHeaders);
  if (!records.length) throw new Error('The CSV contains no data rows.');
  const rows = [];
  records.forEach((record, index) => {
    const row = {};
    FILES[type].headers.forEach((header) => {
      row[header] = csvValue(record, header.toLowerCase());
    });
    if (!row.id) row.id = nextId([...existingRows, ...rows.slice(0, index)], ID_PREFIXES[type]);
    if (type === 'catalog') {
      const timestamp = new Date().toISOString();
      row.createdAt = row.createdAt || timestamp;
      row.updatedAt = row.updatedAt || row.createdAt;
      row.category = row.category || '';
      row.badge = row.badge || '';
    }
    rows.push(row);
  });
  const seen = new Set();
  rows.forEach((row) => {
    const duplicate = [...existingRows, ...rows.filter((candidate) => candidate !== row)].some(
      (item) => canonical(item.id) === canonical(row.id),
    );
    if (duplicate || seen.has(canonical(row.id))) throw new Error(`Duplicate ID found: ${row.id}.`);
    const message = validateRow(type, row, []);
    if (message) throw new Error(`${row.id}: ${message}`);
    seen.add(canonical(row.id));
  });
  return rows;
};

export const downloadRows = (type, rows) => {
  if (!rows.length) return false;
  const headers = FILES[type].headers;
  const content = [
    headers.join(','),
    ...rows.map((row) => headers.map((header) => escapeCsv(row[header])).join(',')),
  ].join('\r\n');
  const url = URL.createObjectURL(new Blob([content], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  const now = new Date();
  const pad = (value) => String(value).padStart(2, '0');
  const timestamp = `${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
  link.download = FILES[type].filename.replace(/\.csv$/i, `_${timestamp}.csv`);
  link.click();
  URL.revokeObjectURL(url);
  return true;
};
