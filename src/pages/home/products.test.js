import { loadProducts } from './products';
import { PRODUCT_FALLBACK, SHOP_URL } from '../../common/storeConstants';

jest.mock('../../common/constants', () => ({
  ...jest.requireActual('../../common/constants'),
  CSV_SOURCES: { catalog: { url: 'https://example.com/catalog.csv' } },
}));

describe('loadProducts', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('uses the bundled catalogue when the spreadsheet request fails', async () => {
    jest.spyOn(global, 'fetch').mockRejectedValue(new Error('Network error'));
    jest.spyOn(console, 'warn').mockImplementation(() => {});

    const products = await loadProducts();

    expect(products).toHaveLength(29);
    expect(products[0]).toMatchObject({
      imageUrl: '/images/catalogue/1.jpeg',
      imageFallbackUrls: ['/images/catalogue/1.jpeg'],
      price: PRODUCT_FALLBACK.priceBase,
      discount: PRODUCT_FALLBACK.discountBase,
      shopUrl: SHOP_URL,
    });
    expect(products[28].imageUrl).toBe('/images/catalogue/29.jpeg');
    expect(
      products.every(
        (product) =>
          product.price >= PRODUCT_FALLBACK.priceBase &&
          product.price <=
            PRODUCT_FALLBACK.priceBase +
              (PRODUCT_FALLBACK.priceVariants - 1) * PRODUCT_FALLBACK.priceStep,
      ),
    ).toBe(true);
    expect(
      products.every(
        (product) =>
          product.discount >= PRODUCT_FALLBACK.discountBase &&
          product.discount <= PRODUCT_FALLBACK.discountBase + PRODUCT_FALLBACK.discountVariants - 1,
      ),
    ).toBe(true);
  });

  it('uses the corresponding bundled image and sample pricing when sheet values are missing', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      text: async () =>
        'id,name,category,imageUrl,price,discount\none,Test Lower,Lower,https://example.com/product.jpg,,',
    });

    const [product] = await loadProducts();

    expect(product).toMatchObject({
      imageUrl: 'https://example.com/product.jpg',
      imageFallbackUrls: ['/images/catalogue/1.jpeg'],
      price: PRODUCT_FALLBACK.priceBase,
      discount: PRODUCT_FALLBACK.discountBase,
      shopUrl: SHOP_URL,
    });
  });
});
