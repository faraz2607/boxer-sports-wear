# Set up another store with this codebase

This guide covers the changes needed to reuse the storefront for another retailer or product
brand. The app is a React static site: it loads public Google Sheets CSV exports, uses local
images as fallbacks, and provides a browser-local admin tool. It does not publish to Sheets or
provide checkout.

## 1. Update store content and defaults

Start with [`src/common/storeConstants.js`](../src/common/storeConstants.js). Keep the app's
mechanics in `src/common/constants.js`; edit the store-specific values in `storeConstants.js`:

| Export                                 | What to update                                                                                                                               |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `STORE_CONTENT.brand`                  | Brand name, logo alt text, home-link label, descriptor, and tagline.                                                                         |
| `STORE_CONTENT.header`                 | Navigation and shop button text.                                                                                                             |
| `STORE_CONTENT.hero`                   | Hero headline, summary, button, and supporting labels.                                                                                       |
| `STORE_CONTENT.carousel`               | Carousel headings, button, accessible labels, and loading text.                                                                              |
| `STORE_CONTENT.catalogue`              | Catalogue heading/description, filters, product actions, empty/loading states, and fabric section.                                           |
| `STORE_CONTENT.footer`                 | Store description, contact details, follow-us text, and copyright suffix.                                                                    |
| `PRODUCT_CATEGORIES`, `PRODUCT_BADGES` | Product categories and optional labels. The admin form and validation use these lists.                                                       |
| `SHOP_URL`                             | Default outbound shop URL. Set the corresponding environment variable described below.                                                       |
| `PRODUCT_FALLBACK`                     | Sample price and discount sequence shown when sheet values are missing.                                                                      |
| `src/common/constants.js`              | App routes, admin IDs, CSV column schema, and browser-admin defaults. Update these only when the store requires different app/data behavior. |

Storefront components read their copy from `STORE_CONTENT`; avoid adding duplicate brand copy in
components. For a new store with different fields or a different shopping platform, also review
the admin schema in `src/common/constants.js`, row validation in `src/pages/admin/config.js`,
product mapping in `src/pages/home/products.js`, and the CSV templates.

## 2. Replace images

Replace the files in `public/images` with assets for the new store, keeping these paths or updating
their references in `STORE_ASSETS` in `src/common/storeConstants.js`:

- `STORE_ASSETS.logo` is used by the header and footer.
- `STORE_ASSETS.catalogueImageDirectory` and `catalogueImageCount` define local product fallbacks.
  The current loader expects sequential files named `1.jpeg`, `2.jpeg`, and so on. If the new
  store uses different names or formats, update `localImagePath` in `src/pages/home/products.js`.
- `STORE_ASSETS.carouselFallbackSlides` lists the local carousel fallback slides. Add or remove
  entries here when changing the fallback carousel.
- `public/images/title-logo.svg`, `title-logo.png`, and `title-logo.ico` are browser/app icons.
  Update their references in `public/index.html` and `public/manifest.json` as needed.

Product and carousel sheets may still use remotely hosted HTTPS images. Make sure those files are
publicly viewable. If a sheet or image URL fails, the storefront uses the configured local image
fallbacks.

## 3. Configure data sources and shop links

Copy `.env.example` to `.env.local` for local work. Set:

| Variable                     | Purpose                                                                         |
| ---------------------------- | ------------------------------------------------------------------------------- |
| `REACT_APP_CATALOG_CSV_URL`  | Public CSV export URL for the product catalogue tab.                            |
| `REACT_APP_CAROUSEL_CSV_URL` | Public CSV export URL for the carousel tab.                                     |
| `REACT_APP_MEESHO_SHOP_URL`  | Default shop destination; product rows can override it with `meeshoProductUrl`. |
| `REACT_APP_ADMIN_PASSWORD`   | Browser-local admin sign-in password.                                           |
| `REACT_APP_ADMIN_SECRET_KEY` | Key used to encrypt browser-local admin data and sessions.                      |

Use the CSV templates at the repository root for the expected catalog and carousel columns.
Publish the Sheets as viewer-accessible CSV exports and use the correct spreadsheet ID and tab
`gid`. Restart the dev server after changing `.env.local`; set the same values in the production
build environment before building.

The admin portal does not write to Google Sheets. Export the CSV from `/admin/dashboard` and
import it into the matching published Sheet tab to publish changes. CRA embeds `REACT_APP_*`
values into client code, so admin variables are not server-side secrets.

If the next store does not use Meesho, update the shop URL variable/name and all platform-specific
field names, validation, labels, and copy together. The current product CSV supports an optional
per-item `meeshoProductUrl`.

## 4. Update metadata and styling

- Change the document title, description, and icon links in `public/index.html`.
- Change the app name and icons in `public/manifest.json`.
- Rebrand the color palette, typography, and layout in `src/index.css`.
- Review `src/pages/admin/README.md` and the public documentation if the store's data fields,
  publishing workflow, or admin behavior changes.

## 5. Verify the new store

1. Start locally with `npm start` and review the storefront at `/`.
2. Check the header, hero, carousel, catalogue, footer, logos, and responsive layout.
3. Temporarily use an unavailable CSV URL to confirm the local product and carousel fallbacks.
4. Check each shop link, contact link, and product destination.
5. If the admin is used, verify `/admin/login`, product categories, CSV imports/exports, and
   publishing to the new Sheets.
6. Run `npm test -- --watchAll=false` and `npm run build` before deployment.

For general environment, hosting, and security details, see [Setup and deployment](./SETUP.md).
