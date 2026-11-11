# Boxer Sports Wear

Boxer Sports Wear is a React storefront backed by published Google Sheets CSV exports. It includes a product catalogue, featured image carousel, Meesho links, and a browser-local admin portal for preparing catalog and carousel CSV files.

## Documentation

- [Setup and deployment](./docs/SETUP.md): requirements, environment variables, local development, builds, and hosting notes.
- [Set up another store](./docs/NEXT_STORE_SETUP.md): update store copy, images, data sources, metadata, and styling when reusing this codebase.
- [Feature guide](./docs/FEATURES.md): customer storefront and admin workflows.
- [Product specification](./docs/SPECIFICATION.md): routes, data contracts, validation, behavior, and known boundaries.
- [Project guide](./PROJECT_GUIDE.md): source tree and data flow.
- [Admin module guide](./src/pages/admin/README.md): admin module responsibilities, persistence, and publishing.

## Quick start

1. Install Node.js and npm, then run `npm ci`.
2. Copy `.env.example` to `.env.local` and fill in the published catalog and carousel CSV URLs. Set unique admin values if you plan to use `/admin/login`.
3. Run `npm start` and open `http://localhost:3000`.

See [SETUP.md](./docs/SETUP.md) for the full checklist and [the CSV templates](./catalog-template.csv) / [carousel template](./carousel-template.csv) for the expected columns.

## Important data and security model

The storefront fetches public CSV data at runtime. The admin portal only edits encrypted data in that browser's local storage; it does not update Google Sheets or upload data to a server. Export from admin and import the file into the same published Sheet tab to publish changes. `REACT_APP_*` values are embedded in the client bundle, so the password and encryption key are not server-side secrets and this admin UI is not suitable for protecting sensitive data.
