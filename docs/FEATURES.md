# Feature guide

## Storefront

- **Brand header and navigation:** links to the collection, contact section, and configured Meesho shop. After returning from admin via **Back to Shop**, `/#fromAdmin` enables a **Go to Admin** link.
- **Hero section:** introduction and link to the product collection.
- **Featured carousel:** loads slide titles and images from the configured carousel CSV. With multiple slides it advances every five seconds; previous/next controls and numbered dots allow manual navigation. It attempts Drive thumbnail/direct-view image fallbacks if the first image URL fails.
- **Product catalogue:** loads the configured catalog CSV, normalizes supported header aliases, and omits rows without a name, usable image URL, or HTTPS shop URL. Product cards show image, name, category, ID, optional badge, price, and discount price. Clicking either the image or **Buy Now** opens the product-specific Meesho URL or the configured shop default in a new tab.
- **Search and filtering:** debounced search matches product name, category, ID, and badge. Category and badge filters are built from loaded product data. Sort supports featured/source order and price ascending/descending. Clear filters resets all controls. Results are progressively rendered in batches of 40 as the user scrolls.
- **Loading and empty states:** catalog/carousel loading and fetch errors are shown in the page. No catalog results, including an empty/invalid catalog, produce an explanatory state.
- **Footer:** contact email opens the visitor's email app; social links are explicitly marked as coming soon.

The storefront is a product discovery and outbound shopping experience. It has no cart, checkout, account, order management, or server-side product API.

## Browser-local admin

Routes: `/admin` redirects to login or dashboard based on session, `/admin/login` is the sign-in page, `/admin/dashboard` is the manager, and legacy `/login` redirects to `/admin/login`.

- **Authentication/session:** password is compared in the client. A valid session is encrypted in local storage for 24 hours and refreshed while the admin interacts. Sign out removes the session.
- **Catalog and carousel tabs:** separate datasets are managed in a dashboard table. The table paginates in groups of 10, supports text search, and provides tab-specific filters. Catalog filters include category, badge, age since `createdAt`, and sort by date or price.
- **Create/edit/delete:** add or edit catalog products and carousel slides; required fields, unique IDs, numeric ranges, category/badge choices, and HTTPS links are validated. Catalog create/edit maintains ISO `createdAt` and `updatedAt` timestamps.
- **CSV import/export:** import a CSV into the selected local dataset; imports are validated and appended, with generated IDs when missing. Export the active dataset as a timestamped CSV. Import is only offered when that dataset is empty. Exported files can be imported into the corresponding published Sheet tab outside the app.
- **Catalog selection and actions:** select rows individually or select/clear all currently filtered catalog rows across pages. Selected rows expose actions to edit, delete, or copy product details. Paste copied details when adding another product; the new record receives its own ID and dates.
- **Bulk discount:** apply one discount from 0 through 100 to all products or selected products. Zero clears a discount. Updated product timestamps are refreshed.
- **Reset IDs:** after confirmation, assign sequential `BX-001`-style IDs in current stored row order; preserve product content and `createdAt`, and refresh `updatedAt`.
- **Feedback:** validation errors and success notices are displayed in the dashboard; transient notices close after three seconds.
- **Persistence:** catalog, carousel, and session are encrypted with AES-GCM before browser local-storage writes. Data is scoped to the browser profile and origin, not shared between devices.

## Publishing workflow

1. Prepare/edit rows in the admin dashboard or a spreadsheet.
2. Export CSV from admin when applicable.
3. Import the CSV rows into the existing catalog or carousel Sheet tab, keeping the published spreadsheet and tab IDs.
4. Confirm the Sheet remains publicly viewable and inspect its CSV export URL.
5. Reload the storefront to fetch current published CSV data.

Admin changes are not live until the spreadsheet is updated. For exact field names and validation, see [the specification](./SPECIFICATION.md).
