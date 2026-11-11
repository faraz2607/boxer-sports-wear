import { loadCarouselSlides } from './carouselSection';

jest.mock('../../common/constants', () => ({
  ...jest.requireActual('../../common/constants'),
  CSV_SOURCES: { carousel: { url: 'https://example.com/carousel.csv' } },
}));

describe('loadCarouselSlides', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('uses the bundled images when the spreadsheet request fails', async () => {
    jest.spyOn(global, 'fetch').mockRejectedValue(new Error('Network error'));
    jest.spyOn(console, 'warn').mockImplementation(() => {});

    const slides = await loadCarouselSlides();

    expect(slides).toHaveLength(3);
    expect(slides.map((slide) => slide.imageUrl)).toEqual([
      '/images/carousel/black-lower-slide-3.jpeg',
      '/images/carousel/white-lower-slide-2.jpeg',
      '/images/carousel/boxer-tag-slide-1.jpeg',
    ]);
  });

  it('uses a bundled image if a spreadsheet image URL fails', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      text: async () => 'id,name,imageUrl\none,Test style,https://example.com/style.jpg',
    });

    const [slide] = await loadCarouselSlides();

    expect(slide).toMatchObject({
      name: 'Test style',
      imageUrl: 'https://example.com/style.jpg',
      fallbacks: ['/images/carousel/black-lower-slide-3.jpeg'],
    });
  });
});
