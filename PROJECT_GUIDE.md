# Project guide

## Documentation map

- [README](./README.md): project overview and quick start.
- [Setup](./docs/SETUP.md): install, environment, local run, build, hosting, and troubleshooting.
- [Feature guide](./docs/FEATURES.md): user-facing storefront and admin capabilities.
- [Specification](./docs/SPECIFICATION.md): routes, CSV contracts, requirements, and operational boundaries.
- [Admin module guide](./src/pages/admin/README.md): admin files and data lifecycle.

## Source tree

```text
src/
  index.js                   App entry and pathname-based storefront/admin selection
  index.css                  Shared storefront and admin styles
  common/
    csv.js                   Shared CSV parser, value lookup, and remote CSV fetch
    siteConfig.js            Runtime data URLs, shop destination, and route constants
    utility.js               Shared utilities
    layout.js                Legacy/common layout component
    components/
      header.js              Storefront brand/nav and return-to-admin link
      footer.js              Contact and footer content
  pages/
    home/
      index.js               Storefront composition
      heroSection.js         Hero introduction
      carouselSection.js     Published-CSV featured image slider
      catalogue.js           Product loading, filters, cards, and progressive rendering
      products.js            Product CSV mapping and image URL resolution
    admin/
      index.js               Route/session gate and encrypted data lifecycle
      AdminLogin.js          Login form
      AdminDashboard.js      Admin workflows and orchestration
      DataTable.js           Data display, selection, and pagination
      ItemModal.js           Add/edit/confirm forms
      BulkDiscountModal.js   Bulk discount dialog
      AdminSelect.js         Shared custom select
      config.js              Schemas, options, IDs, validation, session constants
      csv.js                 Admin CSV import/export
      storage.js             AES-GCM browser storage
public/                      CRA HTML, manifest, logos, and local images
catalog-template.csv         Product CSV example/template
carousel-template.csv        Carousel CSV example/template
```

## Data flow

```text
Published Google Sheets CSV exports
        ├── catalog URL ──> products.js ──> catalogue.js ──> product cards/Meesho
        └── carousel URL ─────────────────> carouselSection.js ──> featured slides

Admin forms / CSV import ──> AdminDashboard ──> storage.js ──> encrypted browser localStorage
                                                   └── CSV export ──> operator imports into Sheets
```

The two data paths are deliberately separate: admin local data does not replace the storefront's fetched Sheet data. A CSV export must be imported into the existing published Sheet tab to appear to visitors. See [the setup and publishing steps](./docs/SETUP.md#admin-setup-and-use).

## Shared implementation choices

- CSV URLs and route/shop constants are centralized in `src/common/siteConfig.js`.
- Storefront parsing and remote fetching are shared through `src/common/csv.js`; mapping and image fallbacks are in `src/pages/home/products.js`.
- Admin fields, validations, ID prefixes, filter options, page size, and session duration are centralized in `src/pages/admin/config.js`.
- CSV import/export is implemented in `src/pages/admin/csv.js`; storage encryption/session logic is implemented in `src/pages/admin/storage.js`.
- The app has no runtime router dependency or server API. Admin paths are handled by pathname checks and history state in `src/index.js` and `src/pages/admin/index.js`.

For exact behavior, refer to [the specification](./docs/SPECIFICATION.md), and update it when changing externally visible features or data contracts.
