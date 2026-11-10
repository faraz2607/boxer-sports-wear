// Published Google Sheets CSV export URLs used by the storefront.
export const CSV_SOURCES = {
  catalog: {
    url: process.env.REACT_APP_CATALOG_CSV_URL || '',
  },
  carousel: {
    url: process.env.REACT_APP_CAROUSEL_CSV_URL || '',
  },
};
export const SHOP_URL = process.env.REACT_APP_MEESHO_SHOP_URL || 'https://www.meesho.com/';
export const ROUTES = {
  storefront: '/',
  adminReturnHash: '#fromAdmin',
  storefrontFromAdmin: '/#fromAdmin',
  legacyLogin: '/login',
  adminLogin: '/admin/login',
  adminDashboard: '/admin/dashboard',
};
