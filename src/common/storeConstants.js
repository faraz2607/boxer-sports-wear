export const SHOP_URL = process.env.REACT_APP_MEESHO_SHOP_URL || 'https://www.meesho.com/';

export const PRODUCT_CATEGORIES = [
  'Lower',
  'T-Shirt',
  'Stola',
  'Gamcha',
  'Arabic Rumal',
  'Shemagh',
];
export const PRODUCT_BADGES = ['New', 'Trending', 'Bestseller', 'Sale', 'Classic'];

export const PRODUCT_FALLBACK = {
  priceBase: 350,
  priceStep: 10,
  priceVariants: 6,
  discountBase: 5,
  discountVariants: 6,
};

export const STORE_ASSETS = {
  logo: '/images/boxer-logo.jpeg',
  catalogueImageDirectory: '/images/catalogue',
  catalogueImageCount: 29,
  carouselFallbackSlides: [
    { name: 'Black Lower', imageUrl: '/images/carousel/black-lower-slide-3.jpeg' },
    { name: 'White Lower', imageUrl: '/images/carousel/white-lower-slide-2.jpeg' },
    { name: 'Boxer Sports Wear', imageUrl: '/images/carousel/boxer-tag-slide-1.jpeg' },
  ],
};

export const STORE_CONTENT = {
  brand: {
    name: 'Boxer Sports Wear',
    logoAlt: 'Boxer',
    homeLinkLabel: 'Boxer Sports Wear home',
    descriptor: 'SPORTS WEAR',
    tagline: 'MADE FOR EVERYDAY',
  },
  header: {
    navigationLabel: 'Main navigation',
    collectionLink: 'Our collection',
    contactLink: 'Contact',
    shopLink: 'Shop Meesho',
    adminLink: 'Go to Admin',
  },
  hero: {
    eyebrow: 'BOXER SPORTS WEAR · EVERYDAY, YOUR WAY',
    titleLead: 'Made for your',
    titleEmphasis: 'everyday rhythm.',
    description:
      'Lowers and T-shirts for daily comfort. Stolas, gamchas, Arabic rumals, and shemaghs to finish your look.',
    action: 'Discover the collection',
    bottomPoints: ['COMFORT FOR EVERY DAY', 'LOWERS · TEES · WRAPS'],
  },
  carousel: {
    ariaLabel: 'Featured styles',
    eyebrow: 'BOXER SPORTS WEAR · THE COLLECTION',
    action: 'Explore the collection',
    loading: 'Loading featured styles…',
    previousSlide: 'Previous slide',
    nextSlide: 'Next slide',
    dotsLabel: 'Choose a featured image',
    showSlideLabel: 'Show',
  },
  catalogue: {
    eyebrow: 'THE BOXER SPORTS WEAR COLLECTION',
    titleLead: 'Comfort, culture,',
    titleEmphasis: 'and everyday style.',
    description:
      'Shop lowers, T-shirts, and the finishing touch: stolas, gamchas, Arabic rumals, and shemaghs. Explore each item on Meesho.',
    note: 'Curated for comfort, priced for everyday',
    searchLabel: 'Search products',
    categoryLabel: 'Category',
    allCategories: 'All categories',
    badgeLabel: 'Badge',
    allBadges: 'All badges',
    sortLabel: 'Sort by',
    sortOptions: [
      { value: 'featured', label: 'Featured' },
      { value: 'price-low', label: 'Price: low to high' },
      { value: 'price-high', label: 'Price: high to low' },
    ],
    clearFilters: 'Clear filters',
    updatingCount: 'Updating product count…',
    loadingProducts: 'Loading products…',
    moreProductsLabel: 'More products load as you scroll',
    productLabel: 'Product',
    productsLabel: 'Products',
    exploreProductLabel: 'Explore {product} on Meesho',
    buyNow: 'Buy Now',
    emptyTitle: 'No products found',
    emptyDescription: 'Try another search or adjust your filters.',
    loadError: 'The product catalog could not be loaded.',
    noProductsError: 'No products were found in the published catalog.',
    fabricGuide: {
      eyebrow: 'A CLOSER LOOK AT FABRIC & TEXTILE',
      title: 'Made for comfort. Styled your way.',
      description:
        "From easy everyday lowers and tees to expressive traditional wraps, the right textile makes every piece feel personal. Open the Meesho listing for each item's exact fabric composition, fit, and care instructions.",
      points: ['Fabric composition', 'Fit & feel', 'Care instructions'],
    },
  },
  footer: {
    description:
      'Everyday essentials, from lowers and T-shirts to stolas, gamchas, Arabic rumals, and shemaghs.',
    contactHeading: 'Contact Us',
    emailLabel: 'Email:',
    contactEmail: 'sportswear.boxer@gmail.com',
    followHeading: 'Follow Us',
    followMessage: 'Coming soon...',
    copyrightSuffix: 'All rights reserved.',
  },
  productFallback: {
    namePrefix: 'Boxer Sports Wear Lower - Style',
  },
};
