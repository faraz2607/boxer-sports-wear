import { csvValue, loadCsvText, parseCsvRows } from '../../common/csv';
import { CSV_SOURCES, ID_PREFIXES } from '../../common/constants';
import {
  PRODUCT_CATEGORIES,
  PRODUCT_FALLBACK,
  SHOP_URL,
  STORE_ASSETS,
  STORE_CONTENT,
} from '../../common/storeConstants';

const localImagePath = (index) =>
  `${STORE_ASSETS.catalogueImageDirectory}/${(index % STORE_ASSETS.catalogueImageCount) + 1}.jpeg`;
const fallbackPrice = (index) =>
  PRODUCT_FALLBACK.priceBase +
  (index % PRODUCT_FALLBACK.priceVariants) * PRODUCT_FALLBACK.priceStep;
const fallbackDiscount = (index) =>
  PRODUCT_FALLBACK.discountBase + (index % PRODUCT_FALLBACK.discountVariants);

export const resolveProductImage = (driveLink = '', imageUrl = '') => {
  const link = driveLink.trim() || imageUrl.trim();
  if (!link) return '';

  try {
    const parsed = new URL(link);
    if (['drive.google.com', 'www.drive.google.com'].includes(parsed.hostname)) {
      const fileId =
        parsed.pathname.match(/\/file\/d\/([^/]+)/)?.[1] || parsed.searchParams.get('id');
      if (fileId) {
        const resourceKey = parsed.searchParams.get('resourcekey');
        return `https://lh3.googleusercontent.com/d/${encodeURIComponent(fileId)}${resourceKey ? `?resourcekey=${encodeURIComponent(resourceKey)}` : ''}`;
      }
    }
    return parsed.protocol === 'https:' ? link : '';
  } catch {
    return '';
  }
};

const mapProduct = (record, index) => {
  const driveLink = csvValue(
    record,
    'drivelink',
    'driveurl',
    'googledrivelink',
    'googledriveurl',
    'driveimagelink',
    'imagelink',
    'googleimageurl',
  );
  const driveFileId = csvValue(record, 'drivefileid', 'fileid');
  const imageUrl = resolveProductImage(
    driveLink ||
      (driveFileId
        ? `https://drive.google.com/file/d/${encodeURIComponent(driveFileId)}/view`
        : ''),
    csvValue(record, 'imageurl', 'image'),
  );
  const explicitMeeshoLink = csvValue(
    record,
    'meeshoproducturl',
    'meeshourl',
    'meesholink',
    'producturl',
  );
  const shopUrl = explicitMeeshoLink || SHOP_URL;
  const driveId = driveLink.match(/\/file\/d\/([^/?]+)/)?.[1] || driveFileId;
  const parsedPrice = Number(csvValue(record, 'price', 'priceinr'));
  const price =
    Number.isFinite(parsedPrice) && parsedPrice > 0 ? parsedPrice : fallbackPrice(index);
  const discountValue = csvValue(record, 'discount', 'discountpercent', 'discountpercentage');
  const parsedDiscount = Number(String(discountValue).replace(/%/g, ''));
  const discount = discountValue
    ? Math.min(100, Math.max(0, Number.isFinite(parsedDiscount) ? parsedDiscount : 0))
    : fallbackDiscount(index);
  const localImageUrl = localImagePath(index);
  const remoteImageFallbacks = driveId
    ? [
        `https://drive.google.com/thumbnail?id=${encodeURIComponent(driveId)}&sz=w1200`,
        `https://drive.google.com/uc?export=view&id=${encodeURIComponent(driveId)}`,
      ]
    : [];

  return {
    id: csvValue(record, 'id', 'sku') || `product-${index + 1}`,
    name:
      csvValue(record, 'productname', 'name') ||
      `${STORE_CONTENT.productFallback.namePrefix} ${index + 1}`,
    category: csvValue(record, 'category') || PRODUCT_CATEGORIES[0],
    price,
    discount,
    discountedPrice: discount ? Math.round(price * (1 - discount / 100)) : price,
    badge: csvValue(record, 'badge', 'tag'),
    imageUrl: imageUrl || localImageUrl,
    imageFallbackUrls: [...remoteImageFallbacks, localImageUrl],
    imagePreviewUrl: driveId
      ? `https://drive.google.com/file/d/${encodeURIComponent(driveId)}/preview`
      : '',
    shopUrl,
  };
};

const createLocalProducts = () =>
  Array.from({ length: STORE_ASSETS.catalogueImageCount }, (_, index) =>
    mapProduct(
      {
        id: `${ID_PREFIXES.catalog}-${index + 1}`,
        productname: `${STORE_CONTENT.productFallback.namePrefix} ${index + 1}`,
        category: PRODUCT_CATEGORIES[0],
        price: fallbackPrice(index),
        discount: fallbackDiscount(index),
      },
      index,
    ),
  );

export const loadProducts = async () => {
  try {
    const csvText = await loadCsvText({ ...CSV_SOURCES.catalog, label: 'Product catalog' });
    const products = parseCsvRows(csvText)
      .map(mapProduct)
      .filter((product) => product.name && /^https:\/\//i.test(product.shopUrl));
    if (products.length) return products;
    console.warn('Product catalog has no valid products; showing the local product catalogue.');
  } catch (error) {
    console.warn(
      'Product catalog could not be loaded; showing the local product catalogue.',
      error,
    );
  }
  return createLocalProducts();
};
