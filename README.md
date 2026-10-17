# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
# Boxer Sports Wear

## Product catalog setup (no backend)

The storefront reads its product and carousel lists from separate public Google Sheet CSVs directly in the browser. It shows loading and configuration or network errors instead of sample products.

1. Use `catalog-template.csv` for the product sheet. Required columns: `productName`, `price`, `driveLink` (or `imageUrl`). Optional columns: `id`, `category`, `badge`, `meeshoUrl`, and `shopLink`. `Explore Meesho Shop` uses `meeshoUrl`, then `shopLink`, then the Meesho homepage placeholder.
2. Upload each product image to Google Drive and set it to **Anyone with the link – Viewer**. Paste the complete Drive share link into `driveLink`; or use an accessible HTTPS image URL in `imageUrl`.
3. Use `carousel-template.csv` for the separate carousel sheet. Add `imageName` and the complete public Drive link in `driveUrl` for each slide.
4. Publish both sheets to the web as CSV. Set their export URLs in `.env.local` as `REACT_APP_CATALOG_CSV_URL` and `REACT_APP_CAROUSEL_CSV_URL`. `.env.example` shows the URL formats. Restart the development server after changing environment values; add both variables to your static hosting provider for deployment.

There is no cart or checkout on this site: each product card opens its Meesho listing in a new tab, where the buyer can choose variants and complete the purchase. Google Drive and the published sheet must be publicly readable; anyone can access that catalog and its image links. Do not put private customer or seller data in the sheet. Sheet changes can take a short time to appear because Google may cache published exports.

The page supports case-insensitive search and filters, price sorting, responsive product cards, a show-more control, and a sheet-powered carousel. Product rows without a name, valid image URL, or HTTPS shop destination are ignored. Catalog and carousel load errors are shown on the page.

## Local development

Run `npm start` to launch the React app. Run `npm run build` to create a production bundle.
