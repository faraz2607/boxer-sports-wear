import { csvValue, parseCsvRows } from "../../common/csv";

const catalogCsvUrl = process.env.REACT_APP_CATALOG_CSV_URL;
const shopLinkPlaceholder = "https://www.meesho.com/";

export const resolveProductImage = (driveLink = "", imageUrl = "") => {
  const link = driveLink.trim() || imageUrl.trim();
  if (!link) return "";

  try {
    const parsed = new URL(link);
    if (["drive.google.com", "www.drive.google.com"].includes(parsed.hostname)) {
      const fileId = parsed.pathname.match(/\/file\/d\/([^/]+)/)?.[1] || parsed.searchParams.get("id");
      if (fileId) {
        const resourceKey = parsed.searchParams.get("resourcekey");
        return `https://lh3.googleusercontent.com/d/${encodeURIComponent(fileId)}${resourceKey ? `?resourcekey=${encodeURIComponent(resourceKey)}` : ""}`;
      }
    }
    return parsed.protocol === "https:" ? link : "";
  } catch {
    return "";
  }
};

const mapProduct = (record, index) => {
  const driveLink = csvValue(record, "drivelink", "driveurl", "googledrivelink", "googledriveurl", "driveimagelink", "imagelink", "googleimageurl");
  const driveFileId = csvValue(record, "drivefileid", "fileid");
  const imageUrl = resolveProductImage(
    driveLink || (driveFileId ? `https://drive.google.com/file/d/${encodeURIComponent(driveFileId)}/view` : ""),
    csvValue(record, "imageurl", "image")
  );
  const explicitMeeshoLink = csvValue(record, "meeshourl", "meesholink", "producturl");
  const shopUrl = explicitMeeshoLink || csvValue(record, "shopurl", "shoplink", "link") || shopLinkPlaceholder;
  const driveId = driveLink.match(/\/file\/d\/([^/?]+)/)?.[1] || driveFileId;

  return {
    id: csvValue(record, "id", "sku") || `product-${index + 1}`,
    name: csvValue(record, "productname", "name"),
    category: csvValue(record, "category"),
    price: Number(csvValue(record, "price", "priceinr")) || 0,
    badge: csvValue(record, "badge", "tag"),
    imageUrl,
    imageFallbackUrls: driveId ? [
      `https://drive.google.com/thumbnail?id=${encodeURIComponent(driveId)}&sz=w1200`,
      `https://drive.google.com/uc?export=view&id=${encodeURIComponent(driveId)}`,
    ] : [],
    imagePreviewUrl: driveId ? `https://drive.google.com/file/d/${encodeURIComponent(driveId)}/preview` : "",
    shopUrl,
  };
};

export const loadProducts = async () => {
  if (!catalogCsvUrl) throw new Error("Product catalog URL is missing. Add REACT_APP_CATALOG_CSV_URL to .env.local.");

  const response = await fetch(catalogCsvUrl);
  if (!response.ok) throw new Error(`Product catalog could not be loaded (HTTP ${response.status}).`);

  return parseCsvRows(await response.text())
    .map(mapProduct)
    .filter((product) => product.name && product.imageUrl && /^https:\/\//i.test(product.shopUrl));
};
