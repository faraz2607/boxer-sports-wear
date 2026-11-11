# Setup and deployment

## Requirements

- Node.js compatible with Create React App 5 / `react-scripts` 5. Use an active Node.js LTS release.
- npm (the repository includes `package-lock.json`).
- Google Sheets and Drive accounts only if you are preparing the live CSV data and hosted images.

## Install and run locally

For adapting this codebase to another storefront, see [Set up another store](./NEXT_STORE_SETUP.md).

From the repository root:

```bash
npm ci
```

Copy `.env.example` to `.env.local` and replace the example Sheet IDs and secrets. `.env.local` is ignored by Git. Configure the catalog and carousel export URLs as described below. Then start the development server:

```bash
npm start
```

The app runs at `http://localhost:3000` by default. CRA reads `REACT_APP_*` variables when the process starts; restart `npm start` after changing `.env.local`.

## Environment variables

| Variable                     | Required                    | Purpose                                                                                                         |
| ---------------------------- | --------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `REACT_APP_CATALOG_CSV_URL`  | For catalog data            | Public CSV export URL for the product Sheet tab.                                                                |
| `REACT_APP_CAROUSEL_CSV_URL` | For featured carousel       | Public CSV export URL for the carousel Sheet tab.                                                               |
| `REACT_APP_MEESHO_SHOP_URL`  | No                          | Default shop link; defaults to `https://www.meesho.com/`. Product rows can override it with `meeshoProductUrl`. |
| `REACT_APP_ADMIN_PASSWORD`   | To log in to admin          | Client-side login password. Set a unique value.                                                                 |
| `REACT_APP_ADMIN_SECRET_KEY` | To store admin data/session | Secret used to derive the AES-GCM browser-storage key. Set a different unique value.                            |

Published Sheet URLs use this form:

```text
https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/export?format=csv&gid=SHEET_TAB_ID
```

Make each Sheet accessible to anyone with the link (viewer access). Use the correct tab `gid`. Keep the spreadsheet and tab IDs stable: update rows in the existing tabs to publish changes without rebuilding the app. The sample CSVs in the repository are templates and are not automatically loaded by the storefront.

Drive images must be reachable by visitors, generally with link sharing enabled. Product image URLs should be HTTPS Drive file URLs; the storefront also understands direct HTTPS image URLs and common CSV header aliases (see [the specification](./SPECIFICATION.md)).

## Admin setup and use

Set both admin variables, restart the app, and open `/admin/login`. Admin is a client-side convenience tool: a session lasts 24 hours and is extended by user activity. Catalog and carousel data are encrypted in that browser's local storage. Changing the secret key makes existing encrypted data unreadable. Clearing browser storage removes it. Export rows regularly if you need a backup.

The admin tool is not connected to Google Sheets. To publish its changes, download the relevant CSV and import/replace the contents in the existing matching Sheet tab, then verify the public export. CSV imports in admin add rows to that browser's local dataset; they do not upload to Sheets. See [the admin guide](../src/pages/admin/README.md).

## Build and host

Create a production bundle with:

```bash
npm run build
```

Deploy the generated `build/` directory to a static host. Set the same `REACT_APP_*` values in the build environment before creating the bundle; changing variables after build does not change an already generated bundle. Configure the host to serve `index.html` for unknown paths so direct requests to `/admin/login` and `/admin/dashboard` reach the client-side route handler. The admin environment values are included in public JavaScript and must not be treated as secure credentials.

Useful repository scripts:

| Command                | Purpose                                            |
| ---------------------- | -------------------------------------------------- |
| `npm start`            | CRA development server.                            |
| `npm run build`        | Production static bundle.                          |
| `npm test`             | CRA/Jest test runner (interactive by default).     |
| `npm run format`       | Format source files matched by the package script. |
| `npm run format:check` | Check formatting for those source files.           |

## Troubleshooting

- **CSV is not configured:** set the relevant URL and restart/rebuild.
- **HTTP 400 or unexpected local fallback content:** verify the spreadsheet ID, tab `gid`, headers/data rows, and public viewer access.
- **Images fail to display:** check the URL is HTTPS and the Drive file is viewable without signing in. Drive may apply its own rate limits.
- **Admin reports it cannot decrypt saved data:** restore the original secret or clear the affected site's local storage. Do not rotate the secret while expecting to retain that browser's stored data.
- **Deep links return a host 404:** configure the static host's SPA fallback to `index.html`.
