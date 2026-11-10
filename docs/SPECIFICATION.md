# Product and data specification

This document describes the behavior implemented in this repository. It can be used as a functional reference when maintaining the storefront, admin portal, and CSV integrations.

## Application routes

| Path | Behavior |
| --- | --- |
| `/` and other non-admin paths | Render the storefront. |
| `/admin` or `/admin/` | Render dashboard when a valid session exists; otherwise redirect to `/admin/login`. |
| `/admin/login` | Render login; authenticated users are routed to the dashboard. |
| `/admin/dashboard` | Render dashboard only with a valid local session. |
| `/login` | Legacy path; replace with `/admin/login`. |

The app uses pathname checks and the History API rather than a routing library. Static hosting must provide an SPA fallback for direct route requests.

## Runtime data sources

The storefront fetches CSV text at runtime with `cache: no-store` from `REACT_APP_CATALOG_CSV_URL` and `REACT_APP_CAROUSEL_CSV_URL`. The app does not call a product backend. A CSV needs a header row plus at least one non-empty data row. Header matching is lowercase and ignores spaces, hyphens, and underscores. Quoted cells, escaped quotes, commas, and line breaks are handled by the shared CSV parser.

### Catalog CSV

Canonical exported header order:

```csv
id,productName,price,discount,category,badge,driveLink,meeshoProductUrl,createdAt,updatedAt
```

| Field | Storefront | Admin/import rules |
| --- | --- | --- |
| `id` | Shown on card; fallback `product-N` if absent. | Required for form, unique case-insensitively; imports generate `BX-NNN` when missing. |
| `productName` | Required for a row to render. | Required text. |
| `price` | Parsed as number; invalid/missing display value becomes 0. | Required and greater than zero. |
| `discount` | Optional percentage, clamped to 0–100; discounted price is rounded to nearest rupee. | Optional number from 0 to 100. |
| `category` | Used in card and filter. | Optional; when set, must match the configured list: Lower, T-Shirt, Stola, Gamcha, Arabic Rumal, Shemagh. |
| `badge` | Optional card label and filter. | Optional; when set, must match New, Trending, Bestseller, Sale, Classic. |
| `driveLink` | Preferred image source. Supports Drive file links and HTTPS image URLs. | Required HTTPS URL. |
| `meeshoProductUrl` | Optional per-product destination; otherwise uses `REACT_APP_MEESHO_SHOP_URL` (defaults to Meesho home). | Optional HTTPS URL. |
| `createdAt`, `updatedAt` | Not displayed on storefront. | ISO timestamps maintained by admin; imported blank timestamps are populated. |

The storefront also accepts these aliases after header normalization:

- Product name: `name`.
- ID: `sku`.
- Price: `priceinr`.
- Discount: `discountpercent`, `discountpercentage`.
- Badge: `tag`.
- Image: `driveurl`, `googledrivelink`, `googledriveurl`, `driveimagelink`, `imagelink`, `googleimageurl`, `imageurl`, `image`; alternatively `drivefileid` or `fileid`.
- Meesho destination: `meeshourl`, `meesholink`, `producturl`.

Admin import/export uses the canonical fields and headers. Each product needs a usable image link and a resulting HTTPS shop URL to appear in the storefront.

### Carousel CSV

Canonical header:

```csv
id,imageName,driveUrl
```

`id` is required in admin forms and unique; imports without one generate `SLIDE-NNN`. `imageName` (also read as `name` or `title`) is the slide title and falls back to “Boxer Sports Wear”. `driveUrl` (also read as `driveLink`, `imageUrl`, or `image`) must be HTTPS in admin and is used as the image source. Rows without a usable HTTPS image are omitted by the storefront. Slides retain source order.

## Storefront requirements

- Show loading, request failure, and empty-data states for catalog and carousel independently.
- Match filters case-insensitively. Storefront search applies to product name, category, ID, and badge after a 500 ms debounce.
- Filter by category and exact badge; sort by source order (“Featured”), ascending price, or descending price.
- Render at most 40 products initially and request additional batches of 40 near the scroll viewport.
- For Drive links, derive a `lh3.googleusercontent.com/d/{fileId}` image URL and try thumbnail/direct-view fallbacks on image failure. Direct HTTPS image URLs are used as provided.
- Open product destinations in a new tab. The header shop link uses the configured global shop URL.
- Carousel advances every five seconds when it has more than one slide, wraps continuously, and exposes previous/next and per-slide controls.

## Admin requirements

- Keep catalog and carousel as distinct local datasets with page size 10.
- Search active-table fields; catalog filters include category, badge, created-date age (all, 7, 30, or 90 days), and sort (default, newest, oldest, low-to-high price, high-to-low price).
- Validate required fields, case-insensitive unique IDs, price greater than zero, discount range, configured category/badge, and HTTPS URLs.
- Create and edit catalog rows with ISO timestamps. Editing preserves `createdAt`; edits, bulk discount, and ID reset refresh `updatedAt`.
- Import validated CSV by appending records to local data; reject duplicate IDs. Export only the active dataset with canonical headers and CSV escaping.
- Bulk discount affects either all catalog rows or selected catalog rows. Selection is cleared when filters or active tab change.
- Reset IDs assigns `BX-001` onward in stored array order, preserving product data and creation time.
- Store browser data and session in local storage encrypted using Web Crypto AES-GCM. Session duration is 24 hours and user activity extends it, subject to refresh throttling.

## Security, availability, and operational constraints

- `REACT_APP_*` values are public client configuration in CRA bundles. The admin password check and secret key therefore do not provide server-enforced access control. The admin portal is suitable only for low-risk browser-local content management.
- Local admin storage is not synchronized across users/devices and does not publish to Sheets. Browser storage loss or secret rotation can make local edits unavailable; keep CSV exports as backups.
- Sheets and Drive availability, sharing permissions, CORS, and rate limits affect data and image loading. The site reports CSV load failures but has no offline cache or retry workflow.
- There is no checkout, cart, inventory service, order workflow, customer account, social integration, or server-side API in the current implementation.

## Source of truth for changes

Implementation and schema constants live in `src/common/csv.js`, `src/common/siteConfig.js`, `src/pages/home/products.js`, `src/pages/home/catalogue.js`, `src/pages/home/carouselSection.js`, and `src/pages/admin/config.js` / `src/pages/admin/csv.js`. Update this specification when changing their observable behavior or CSV contracts.
