export const ADMIN_PASSWORD = process.env.REACT_APP_ADMIN_PASSWORD || '';
export const ADMIN_SECRET = process.env.REACT_APP_ADMIN_SECRET_KEY || '';
export const SESSION_KEY = 'boxer-admin-session-v1';
export const DATA_KEY = 'boxer-admin-data-v1';
export const SESSION_MS = 24 * 60 * 60 * 1000;
export const PAGE_SIZE = 10;
export const NOTICE_DURATION_MS = 3000;
export const DAY_MS = 24 * 60 * 60 * 1000;
export const ID_PREFIXES = { catalog: 'BX', carousel: 'SLIDE' };
export const PRODUCT_CATEGORIES = [
  'Lower',
  'T-Shirt',
  'Stola',
  'Gamcha',
  'Arabic Rumal',
  'Shemagh',
];
export const PRODUCT_BADGES = ['New', 'Trending', 'Bestseller', 'Sale', 'Classic'];
export const DATE_FILTER_OPTIONS = [
  { value: 'all', label: 'Any date' },
  { value: '7', label: 'Last 7 days' },
  { value: '30', label: 'Last 30 days' },
  { value: '90', label: 'Last 90 days' },
];
export const SORT_FILTER_OPTIONS = [
  { value: 'default', label: 'Default order' },
  { value: 'newest', label: 'Newest added' },
  { value: 'oldest', label: 'Oldest added' },
  { value: 'price-low', label: 'Price: low to high' },
  { value: 'price-high', label: 'Price: high to low' },
];
export const EMPTY_DATA = { catalog: [], carousel: [] };
export const FILES = {
  catalog: {
    title: 'Product catalog',
    filename: 'catalog.csv',
    fields: [
      { name: 'id', label: 'Product ID', required: true },
      { name: 'productName', label: 'Product name', required: true },
      { name: 'category', label: 'Category', type: 'select', options: PRODUCT_CATEGORIES },
      { name: 'badge', label: 'Badge', type: 'select', options: PRODUCT_BADGES },
      { name: 'price', label: 'Price (₹)', type: 'number', required: true },
      { name: 'discount', label: 'Discount (%)', type: 'number' },
      { name: 'driveLink', label: 'Google Drive product url', required: true, wide: true },
      { name: 'meeshoProductUrl', label: 'Meesho Product URL', wide: true },
    ],
    headers: [
      'id',
      'productName',
      'price',
      'discount',
      'category',
      'badge',
      'driveLink',
      'meeshoProductUrl',
      'createdAt',
      'updatedAt',
    ],
  },
  carousel: {
    title: 'Carousel slides',
    filename: 'carousel.csv',
    fields: [
      { name: 'id', label: 'Slide ID', required: true },
      { name: 'imageName', label: 'Slide title', required: true },
      { name: 'driveUrl', label: 'Image URL or Drive link', required: true, wide: true },
    ],
    headers: ['id', 'imageName', 'driveUrl'],
  },
};

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
