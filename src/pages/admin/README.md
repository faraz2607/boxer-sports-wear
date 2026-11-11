# Admin portal modules

For operator instructions, see the [setup guide](../../../docs/SETUP.md#admin-setup-and-use), [feature guide](../../../docs/FEATURES.md#browser-local-admin), and [functional specification](../../../docs/SPECIFICATION.md#admin-requirements).

The portal is mounted for `/admin/*`; `/login` redirects to `/admin/login`. It is a static, browser-only tool. It does not modify the live site files or publish to a Google Sheet.

## File responsibilities

- `index.js`: admin route handling, login session initialization, sliding 24-hour expiry, and shared encrypted data state.
- `AdminLogin.js`: password form and login validation feedback.
- `AdminDashboard.js`: tab state, custom filters, pagination, imports/exports, CRUD orchestration, product selection, bulk discounts, ID resets, timed notifications, and product copy/paste state.
- `DataTable.js`: responsive CSV row table, date display, paging controls, catalog selection, select all filtered products, and selection-gated edit/delete/copy actions.
- `ItemModal.js`: add/edit/delete/reset-ID confirmation modals, generated ID display, inline Meesho URL validation, and paste-copied-product action.
- `BulkDiscountModal.js`: choose all or selected products and set one discount percentage for them.
- `AdminSelect.js`: shared custom dropdown used in the product modal and catalog filters.
- `../../common/constants.js`: application routes, admin credentials/storage settings, CSV schemas, filter options, and ID prefixes.
- `../../common/storeConstants.js`: store categories/badges and store-specific copy, links, fallback prices, and image paths.
- `config.js`: shared row normalization, ID generation, and validation helpers.
- `csv.js`: CSV row normalization, upload validation, escaping, and downloads.
- `storage.js`: AES-GCM encryption and decryption for local data and the sliding session.

## Product fields and dates

Catalog records use `id`, `productName`, `price`, `discount`, `category`, `badge`, `driveLink`, `meeshoProductUrl`, `createdAt`, and `updatedAt`. New records get a generated ID and current timestamps; editing preserves `createdAt` and refreshes `updatedAt`. Copy/paste duplicates only editable product content; the new product gets its own ID and dates.

`driveLink` is the Google Drive product image link. `meeshoProductUrl` is the optional item listing. When the listing is blank, the storefront uses `REACT_APP_MEESHO_SHOP_URL` as its general shop destination.

## Filters, navigation, and notices

Catalog filters include text search, category, badge, added-date range, and sort by date or price, all using the shared custom dropdown. Carousel filters use text search. Errors/success notices appear at the top center and auto-close after three seconds. A malformed Meesho Product URL is shown inline below its field. **Back to Shop** uses `/#fromAdmin`; the storefront then displays **Go to Admin**.

Catalog row actions appear after selecting a product. The table checkbox selects individual products; its header checkbox selects or clears every product matching the current filters across pages. Bulk discount sets a percentage for all catalog products or the selected products; 0% clears existing discounts. **Reset product IDs** asks for confirmation, then assigns sequential unique IDs and refreshes `updatedAt` while preserving product data and `createdAt`.

## Persistence and publishing

Records and session expiry are encrypted in local storage with `REACT_APP_ADMIN_SECRET_KEY`; credentials are configured by `REACT_APP_ADMIN_PASSWORD`. A local browser login lasts 24 hours and refreshes while active. Export the catalog or carousel from the dashboard, then import the CSV into the matching existing Google Sheet tab to publish it. The admin does not upload files to Sheets; CSV upload inside the portal imports a local CSV into browser storage and is offered only when that tab's dataset is empty. The storefront reads the published CSV exports configured by `REACT_APP_CATALOG_CSV_URL` and `REACT_APP_CAROUSEL_CSV_URL`.

Because this is Create React App, `REACT_APP_*` values are exposed in the browser bundle. Use a server-side auth service for a protected production admin.
