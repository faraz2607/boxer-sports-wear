import { FILES, PRODUCT_BADGES, PRODUCT_CATEGORIES } from '../../common/constants';

export const canonical = (value) =>
  String(value || '')
    .trim()
    .toLowerCase();
export const nextId = (rows, prefix) => {
  const max = rows.reduce((value, row) => {
    const match = String(row.id || '').match(/(\d+)$/);
    return match ? Math.max(value, Number(match[1])) : value;
  }, 0);
  return `${prefix}-${String(max + 1).padStart(3, '0')}`;
};

export const validateRow = (type, row, rows, editingId = '') => {
  for (const field of FILES[type].fields) {
    if (field.required && !String(row[field.name] || '').trim())
      return `${field.label} is required.`;
  }
  if (
    rows.some(
      (item) =>
        canonical(item.id) === canonical(row.id) && canonical(item.id) !== canonical(editingId),
    )
  )
    return `The ID “${row.id}” is already in use.`;
  const isHttpsUrl = (value) => {
    try {
      return new URL(value).protocol === 'https:';
    } catch {
      return false;
    }
  };
  if (type === 'catalog') {
    if (!Number.isFinite(Number(row.price)) || Number(row.price) <= 0)
      return 'Price must be greater than zero.';
    if (
      row.discount &&
      (!Number.isFinite(Number(row.discount)) ||
        Number(row.discount) < 0 ||
        Number(row.discount) > 100)
    )
      return 'Discount must be between 0 and 100.';
    if (!isHttpsUrl(row.driveLink)) return 'Google Drive product URL must be a valid HTTPS URL.';
    if (row.meeshoProductUrl && !isHttpsUrl(row.meeshoProductUrl))
      return 'Meesho Product URL must be a valid HTTPS URL.';
    if (row.category && !PRODUCT_CATEGORIES.includes(row.category))
      return 'Choose a category from the available options.';
    if (row.badge && !PRODUCT_BADGES.includes(row.badge))
      return 'Choose a badge from the available options.';
  } else if (!isHttpsUrl(row.driveUrl)) return 'Slide image link must be a valid HTTPS URL.';
  return '';
};
