import { useEffect, useState } from "react";
import { csvValue, parseCsvRows } from "../../common/csv";
import { resolveProductImage } from "./products";

const carouselCsvUrl = process.env.REACT_APP_CAROUSEL_CSV_URL;

const getSlideImage = (record) => {
  const driveLink = csvValue(record, "drivelink", "driveurl", "googledrivelink", "imageurl", "image");
  const imageUrl = resolveProductImage(driveLink);
  const driveId = driveLink.match(/\/file\/d\/([^/?]+)/)?.[1] || driveLink.match(/[?&]id=([^&]+)/)?.[1];
  return {
    name: csvValue(record, "imagename", "name", "title") || "Boxer Sports Wear",
    imageUrl,
    fallbacks: driveId ? [
      `https://drive.google.com/thumbnail?id=${encodeURIComponent(driveId)}&sz=w1600`,
      `https://drive.google.com/uc?export=view&id=${encodeURIComponent(driveId)}`,
    ] : [],
    previewUrl: driveId ? `https://drive.google.com/file/d/${encodeURIComponent(driveId)}/preview` : "",
  };
};

const CarouselSection = () => {
  const [slides, setSlides] = useState([]);
  const [activeSlide, setActiveSlide] = useState(1);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const loadSlides = async () => {
      if (!carouselCsvUrl) throw new Error("Carousel sheet is not configured yet.");
      const response = await fetch(carouselCsvUrl);
      if (!response.ok) throw new Error(`Carousel images could not be loaded (HTTP ${response.status}).`);
      const loadedSlides = parseCsvRows(await response.text()).map(getSlideImage).filter((slide) => slide.imageUrl);
      if (!loadedSlides.length) throw new Error("No carousel images were found in the published sheet.");
      return loadedSlides;
    };

    loadSlides()
      .then((loadedSlides) => { if (active) setSlides(loadedSlides); })
      .catch((loadError) => { if (active) setError(loadError.message || "Carousel images could not be loaded."); })
      .finally(() => { if (active) setLoading(false); });

    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (slides.length < 2) return undefined;
    const intervalId = window.setInterval(() => setActiveSlide((index) => index + 1), 5000);
    return () => window.clearInterval(intervalId);
  }, [slides.length]);

  const hasLoopClones = slides.length > 1;
  const carouselSlides = hasLoopClones ? [slides[slides.length - 1], ...slides, slides[0]] : slides;
  const physicalSlide = hasLoopClones ? activeSlide : 0;
  const logicalSlide = hasLoopClones
    ? (activeSlide - 1 + slides.length) % slides.length
    : 0;
  const selectSlide = (index) => setActiveSlide(hasLoopClones ? index + 1 : index);

  const handleTrackTransitionEnd = (event) => {
    if (event.propertyName !== "transform" || !hasLoopClones) return;
    if (activeSlide === 0 || activeSlide === slides.length + 1) {
      setTransitionEnabled(false);
      setActiveSlide(activeSlide === 0 ? slides.length : 1);
      window.requestAnimationFrame(() => window.requestAnimationFrame(() => setTransitionEnabled(true)));
    }
  };

  if (loading) return <div className="carousel-state" role="status">Loading featured styles…</div>;
  if (error) return <div className="carousel-state carousel-error" role="status">{error} Add <code>REACT_APP_CAROUSEL_CSV_URL</code> when your carousel sheet is ready.</div>;

  const slide = slides[logicalSlide];
  return (
    <section className="store-carousel" aria-label="Featured styles">
      <div className="carousel-frame">
        <div
          className="carousel-track"
          onTransitionEnd={handleTrackTransitionEnd}
          style={{ transform: `translate3d(-${physicalSlide * 100}%, 0, 0)`, transition: transitionEnabled ? undefined : "none" }}
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
                  const fallbacks = JSON.parse(image.dataset.fallbacks || "[]");
                  const nextUrl = fallbacks.shift();
                  image.dataset.fallbacks = JSON.stringify(fallbacks);
                  if (nextUrl) image.src = nextUrl;
                  else {
                    image.classList.add("carousel-image-missing");
                    if (slideItem.previewUrl) image.parentElement.classList.add("carousel-show-preview");
                  }
                }}
              />
              {slideItem.previewUrl && <iframe className="carousel-drive-preview" src={slideItem.previewUrl} title={`${slideItem.name} image preview`} loading="lazy" tabIndex="-1" aria-hidden="true" />}
            </div>
          ))}
        </div>
        <div className="carousel-shade" />
        <div className="carousel-copy">
          <p className="eyebrow">BOXER SPORTS WEAR &middot; THE COLLECTION</p>
          <h2>{slide.name}</h2>
          <a href="#catalogue" className="carousel-shop-link">Explore the collection <span aria-hidden="true">&#8595;</span></a>
        </div>
        <div className="carousel-controls">
          <button type="button" onClick={() => setActiveSlide((index) => index - 1)} aria-label="Previous slide">&#8592;</button>
          <span>{String(logicalSlide + 1).padStart(2, "0")} <i>/</i> {String(slides.length).padStart(2, "0")}</span>
          <button type="button" onClick={() => setActiveSlide((index) => index + 1)} aria-label="Next slide">&#8594;</button>
        </div>
        <div className="carousel-dots" aria-label="Choose a featured image">
          {slides.map((item, index) => <button key={`${item.name}-${index}`} type="button" className={index === logicalSlide ? "active" : ""} onClick={() => selectSlide(index)} aria-label={`Show ${item.name}`} aria-current={index === logicalSlide ? "true" : undefined} />)}
        </div>
      </div>
    </section>
  );
};

export default CarouselSection;
