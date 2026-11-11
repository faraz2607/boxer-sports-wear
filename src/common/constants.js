import { PRODUCT_BADGES, PRODUCT_CATEGORIES } from './storeConstants';

export { PRODUCT_BADGES, PRODUCT_CATEGORIES } from './storeConstants';

export const CSV_SOURCES = {
  catalog: {
    url: process.env.REACT_APP_CATALOG_CSV_URL || '',
  },
  carousel: {
    url: process.env.REACT_APP_CAROUSEL_CSV_URL || '',
  },
};

export const ROUTES = {
  storefront: '/',
  adminReturnHash: '#fromAdmin',
  storefrontFromAdmin: '/#fromAdmin',
  legacyLogin: '/login',
  adminLogin: '/admin/login',
  adminDashboard: '/admin/dashboard',
};

export const ADMIN_PASSWORD = process.env.REACT_APP_ADMIN_PASSWORD || '';
export const ADMIN_SECRET = process.env.REACT_APP_ADMIN_SECRET_KEY || '';
export const SESSION_KEY = 'boxer-admin-session-v1';
export const DATA_KEY = 'boxer-admin-data-v1';
export const DAY_MS = 24 * 60 * 60 * 1000;
export const SESSION_MS = DAY_MS;
export const PAGE_SIZE = 10;
export const NOTICE_DURATION_MS = 3000;
export const ID_PREFIXES = { catalog: 'BX', carousel: 'SLIDE' };
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
