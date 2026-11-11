import { useEffect, useState } from 'react';
import { csvValue, loadCsvText, parseCsvRows } from '../../common/csv';
import { CSV_SOURCES } from '../../common/constants';
import { STORE_ASSETS, STORE_CONTENT } from '../../common/storeConstants';
import { resolveProductImage } from './products';

const getLocalSlideImage = (index) =>
  STORE_ASSETS.carouselFallbackSlides[index % STORE_ASSETS.carouselFallbackSlides.length].imageUrl;

const getSlideImage = (record, index) => {
  const driveLink = csvValue(
    record,
    'drivelink',
    'driveurl',
    'googledrivelink',
    'imageurl',
    'image',
  );
  const imageUrl = resolveProductImage(driveLink);
  const localImageUrl = getLocalSlideImage(index);
  const driveId =
    driveLink.match(/\/file\/d\/([^/?]+)/)?.[1] || driveLink.match(/[?&]id=([^&]+)/)?.[1];
  return {
    name: csvValue(record, 'imagename', 'name', 'title') || STORE_CONTENT.brand.name,
    imageUrl: imageUrl || localImageUrl,
    fallbacks: [
      ...(driveId
        ? [
            `https://drive.google.com/thumbnail?id=${encodeURIComponent(driveId)}&sz=w1600`,
            `https://drive.google.com/uc?export=view&id=${encodeURIComponent(driveId)}`,
          ]
        : []),
      ...(imageUrl ? [localImageUrl] : []),
    ],
    previewUrl: driveId
      ? `https://drive.google.com/file/d/${encodeURIComponent(driveId)}/preview`
      : '',
  };
};

const createLocalSlides = () =>
  STORE_ASSETS.carouselFallbackSlides.map((slide) => ({
    ...slide,
    fallbacks: [],
    previewUrl: '',
  }));

export const loadCarouselSlides = async () => {
  try {
    const csvText = await loadCsvText({ ...CSV_SOURCES.carousel, label: 'Carousel images' });
    const loadedSlides = parseCsvRows(csvText).map(getSlideImage);
    if (loadedSlides.length) return loadedSlides;
    console.warn('Carousel sheet has no slides; showing the local carousel images.');
  } catch (error) {
    console.warn('Carousel sheet could not be loaded; showing the local carousel images.', error);
  }
  return createLocalSlides();
};

const CarouselSection = () => {
  const [slides, setSlides] = useState([]);
  const [activeSlide, setActiveSlide] = useState(1);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    loadCarouselSlides()
      .then((loadedSlides) => {
        if (active) setSlides(loadedSlides);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (slides.length < 2) return undefined;
    const intervalId = window.setInterval(() => setActiveSlide((index) => index + 1), 5000);
    return () => window.clearInterval(intervalId);
  }, [slides.length]);

  const hasLoopClones = slides.length > 1;
  const carouselSlides = hasLoopClones ? [slides[slides.length - 1], ...slides, slides[0]] : slides;
  const physicalSlide = hasLoopClones ? activeSlide : 0;
  const logicalSlide = hasLoopClones ? (activeSlide - 1 + slides.length) % slides.length : 0;
  const selectSlide = (index) => setActiveSlide(hasLoopClones ? index + 1 : index);

  const handleTrackTransitionEnd = (event) => {
    if (event.propertyName !== 'transform' || !hasLoopClones) return;
    if (activeSlide === 0 || activeSlide === slides.length + 1) {
      setTransitionEnabled(false);
      setActiveSlide(activeSlide === 0 ? slides.length : 1);
      window.requestAnimationFrame(() =>
        window.requestAnimationFrame(() => setTransitionEnabled(true)),
      );
    }
  };

  if (loading)
    return (
      <div className="carousel-state" role="status">
        {STORE_CONTENT.carousel.loading}
      </div>
    );

  const slide = slides[logicalSlide];
  return (
    <section className="store-carousel" aria-label={STORE_CONTENT.carousel.ariaLabel}>
      <div className="carousel-frame">
        <div
          className="carousel-track"
          onTransitionEnd={handleTrackTransitionEnd}
          style={{
            transform: `translate3d(-${physicalSlide * 100}%, 0, 0)`,
            transition: transitionEnabled ? undefined : 'none',
          }}
        >
          {carouselSlides.map((slideItem, index) => (
            <div className="carousel-slide" key={`${slideItem.imageUrl}-${index}`}>
              <img
                className="carousel-image"
                src={slideItem.imageUrl}
                data-fallbacks={JSON.stringify(slideItem.fallbacks)}
                alt={slideItem.name}
                onError={(event) => {
                  const image = event.currentTarget;
                  const fallbacks = JSON.parse(image.dataset.fallbacks || '[]');
                  const nextUrl = fallbacks.shift();
                  image.dataset.fallbacks = JSON.stringify(fallbacks);
                  if (nextUrl) image.src = nextUrl;
                  else {
                    image.classList.add('carousel-image-missing');
                    if (slideItem.previewUrl)
                      image.parentElement.classList.add('carousel-show-preview');
                  }
                }}
              />
              {slideItem.previewUrl && (
                <iframe
                  className="carousel-drive-preview"
                  src={slideItem.previewUrl}
                  title={`${slideItem.name} image preview`}
                  loading="lazy"
                  tabIndex="-1"
                  aria-hidden="true"
                />
              )}
            </div>
          ))}
        </div>
        <div className="carousel-shade" />
        <div className="carousel-copy">
          <p className="eyebrow">{STORE_CONTENT.carousel.eyebrow}</p>
          <h2>{slide.name}</h2>
          <a href="#catalogue" className="carousel-shop-link">
            {STORE_CONTENT.carousel.action} <span aria-hidden="true">&#8595;</span>
          </a>
        </div>
        <div className="carousel-controls">
          <button
            type="button"
            onClick={() => setActiveSlide((index) => index - 1)}
            aria-label={STORE_CONTENT.carousel.previousSlide}
          >
            &#8592;
          </button>
          <span>
            {String(logicalSlide + 1).padStart(2, '0')} <i>/</i>{' '}
            {String(slides.length).padStart(2, '0')}
          </span>
          <button
            type="button"
            onClick={() => setActiveSlide((index) => index + 1)}
            aria-label={STORE_CONTENT.carousel.nextSlide}
          >
            &#8594;
          </button>
        </div>
        <div className="carousel-dots" aria-label={STORE_CONTENT.carousel.dotsLabel}>
          {slides.map((item, index) => (
            <button
              key={`${item.name}-${index}`}
              type="button"
              className={index === logicalSlide ? 'active' : ''}
              onClick={() => selectSlide(index)}
              aria-label={`${STORE_CONTENT.carousel.showSlideLabel} ${item.name}`}
              aria-current={index === logicalSlide ? 'true' : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CarouselSection;
