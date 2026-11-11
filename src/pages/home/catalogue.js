import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { STORE_CONTENT } from '../../common/storeConstants';
import { loadProducts } from './products';

const filterKey = (value) =>
  String(value || '')
    .trim()
    .toLowerCase();
const sentenceCase = (value) => {
  const text = String(value || '')
    .trim()
    .toLowerCase();
  return text ? `${text.charAt(0).toUpperCase()}${text.slice(1)}` : '';
};
const badgeTone = (badge) => {
  const value = filterKey(badge);
  if (/\b(new|latest|just in|new arrival|fresh)\b/.test(value)) return 'latest';
  if (/\b(trending|popular|hot|viral|must have)\b/.test(value)) return 'trending';
  if (
    /\b(best|bestseller|best seller|top seller|top pick|staff pick|favourite|favorite|best rated)\b/.test(
      value,
    )
  )
    return 'best';
  if (/\b(sale|offer|discount|deal|limited)\b/.test(value)) return 'offer';
  return 'classic';
};

const Icon = ({ name, size = 17, ...props }) => {
  const paths = {
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    chevron: <path d="m6 9 6 6 6-6" />,
    check: <path d="m5 12 4 4L19 6" />,
    close: (
      <>
        <path d="m18 6-12 12" />
        <path d="m6 6 12 12" />
      </>
    ),
    loader: (
      <>
        <path d="M12 2v4" />
        <path d="m16.2 7.8 2.9-2.9" />
        <path d="M18 12h4" />
        <path d="m16.2 16.2 2.9 2.9" />
        <path d="M12 18v4" />
        <path d="m4.9 19.1 2.9-2.9" />
        <path d="M2 12h4" />
        <path d="m4.9 4.9 2.9 2.9" />
      </>
    ),
  };
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {paths[name]}
    </svg>
  );
};

const FilterMenu = ({ label, value, options, onChange }) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const selected = options.find((option) => option.value === value) || options[0];
  useEffect(() => {
    const close = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    const keydown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', keydown);
    return () => {
      document.removeEventListener('pointerdown', close);
      document.removeEventListener('keydown', keydown);
    };
  }, []);
  return (
    <div className={`catalogue-filter${open ? ' is-open' : ''}`} ref={rootRef}>
      <button
        type="button"
        className="catalogue-filter-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((state) => !state)}
      >
        <span className="catalogue-filter-copy">
          <span className="catalogue-filter-value">{selected?.label}</span>
        </span>
        <Icon name="chevron" className="filter-chevron" />
      </button>
      {open && (
        <div className="catalogue-filter-menu" role="listbox" aria-label={label}>
          {options.map((option) => (
            <button
              type="button"
              role="option"
              aria-selected={value === option.value}
              className="catalogue-filter-option"
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
            >
              <span>{option.label}</span>
              {value === option.value && <Icon name="check" size={16} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const Catalogue = () => {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [badge, setBadge] = useState('all');
  const [sort, setSort] = useState('featured');
  const [visibleItems, setVisibleItems] = useState(40);
  const [appliedFilters, setAppliedFilters] = useState({
    query: '',
    category: 'all',
    badge: 'all',
    sort: 'featured',
  });
  const [filtersPending, setFiltersPending] = useState(true);
  const scrollSentinel = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    loadProducts()
      .then((items) => {
        if (active) {
          setProducts(items);
          if (!items.length) setError(STORE_CONTENT.catalogue.noProductsError);
        }
      })
      .catch((loadError) => {
        if (active) setError(loadError.message || STORE_CONTENT.catalogue.loadError);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    setFiltersPending(true);
    const timer = window.setTimeout(() => {
      setAppliedFilters({ query, category, badge, sort });
      setFiltersPending(false);
    }, 500);
    return () => window.clearTimeout(timer);
  }, [query, category, badge, sort]);

  const categories = useMemo(
    () => [
      { value: 'all', label: STORE_CONTENT.catalogue.allCategories },
      ...Array.from(
        new Set(products.map((product) => filterKey(product.category)).filter(Boolean)),
      ).map((value) => ({
        value,
        label: sentenceCase(
          products.find((product) => filterKey(product.category) === value)?.category,
        ),
      })),
    ],
    [products],
  );
  const badges = useMemo(
    () =>
      Array.from(new Set(products.map((product) => filterKey(product.badge)).filter(Boolean))).map(
        (value) => ({
          value,
          label: sentenceCase(
            products.find((product) => filterKey(product.badge) === value)?.badge,
          ),
        }),
      ),
    [products],
  );
  const filteredProducts = useMemo(() => {
    const normalizedQuery = filterKey(appliedFilters.query);
    const items = products.filter(
      (product) =>
        (appliedFilters.category === 'all' ||
          filterKey(product.category) === appliedFilters.category) &&
        (appliedFilters.badge === 'all' || filterKey(product.badge) === appliedFilters.badge) &&
        (!normalizedQuery ||
          filterKey(`${product.name} ${product.category} ${product.id} ${product.badge}`).includes(
            normalizedQuery,
          )),
    );
    if (appliedFilters.sort === 'price-low') items.sort((a, b) => a.price - b.price);
    if (appliedFilters.sort === 'price-high') items.sort((a, b) => b.price - a.price);
    return items;
  }, [products, appliedFilters]);
  const hasActiveFilters = Boolean(
    query.trim() || category !== 'all' || badge !== 'all' || sort !== 'featured',
  );
  const clearFilters = () => {
    setQuery('');
    setCategory('all');
    setBadge('all');
    setSort('featured');
  };

  useEffect(() => {
    setVisibleItems(40);
  }, [appliedFilters]);
  const loadNextPage = useCallback(() => {
    setVisibleItems((count) => Math.min(count + 40, filteredProducts.length));
  }, [filteredProducts.length]);
  useEffect(() => {
    const node = scrollSentinel.current;
    if (!node || visibleItems >= filteredProducts.length) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadNextPage();
      },
      { rootMargin: '500px 0px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [visibleItems, filteredProducts.length, loadNextPage]);

  return (
    <section id="catalogue" className="catalogue-section py-12 md:py-20">
      <div className="catalogue-heading">
        <div>
          <p className="eyebrow">{STORE_CONTENT.catalogue.eyebrow}</p>
          <h2>
            {STORE_CONTENT.catalogue.titleLead}
            <br />
            <span>{STORE_CONTENT.catalogue.titleEmphasis}</span>
          </h2>
          <p className="section-copy">{STORE_CONTENT.catalogue.description}</p>
        </div>
        <div className="catalogue-note">
          <span className="note-dot" /> {STORE_CONTENT.catalogue.note}
        </div>
      </div>

      <div className="catalogue-toolbar">
        <label className="search-box">
          <Icon name="search" size={16} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={STORE_CONTENT.catalogue.searchLabel}
            aria-label={STORE_CONTENT.catalogue.searchLabel}
          />
        </label>
        <FilterMenu
          label={STORE_CONTENT.catalogue.categoryLabel}
          value={category}
          onChange={setCategory}
          options={categories}
        />
        <FilterMenu
          label={STORE_CONTENT.catalogue.badgeLabel}
          value={badge}
          onChange={setBadge}
          options={[{ value: 'all', label: STORE_CONTENT.catalogue.allBadges }, ...badges]}
        />
        <FilterMenu
          label={STORE_CONTENT.catalogue.sortLabel}
          value={sort}
          onChange={setSort}
          options={STORE_CONTENT.catalogue.sortOptions}
        />
        <button
          type="button"
          className="clear-filters-button"
          onClick={clearFilters}
          disabled={!hasActiveFilters}
        >
          <Icon name="close" size={15} />
          <span>{STORE_CONTENT.catalogue.clearFilters}</span>
        </button>
        <div className="catalogue-results" aria-live="polite">
          <span>
            <strong>{filteredProducts.length}</strong>{' '}
            {filteredProducts.length === 1
              ? STORE_CONTENT.catalogue.productLabel
              : STORE_CONTENT.catalogue.productsLabel}
          </span>
        </div>
      </div>

      {(loading || filtersPending) && (
        <div className="catalogue-loading-indicator" role="status">
          <Icon name="loader" className="results-spinner" />
          <span>
            {loading
              ? STORE_CONTENT.catalogue.loadingProducts
              : STORE_CONTENT.catalogue.updatingCount}
          </span>
        </div>
      )}
      {!loading && error && (
        <div className="catalogue-state catalogue-error" role="alert">
          {error}
        </div>
      )}
      <div className="product-grid">
        {!loading &&
          !error &&
          filteredProducts.slice(0, visibleItems).map((product) => (
            <article className="product-card" key={product.id}>
              <a
                className="product-image-link"
                href={product.shopUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={STORE_CONTENT.catalogue.exploreProductLabel.replace(
                  '{product}',
                  product.name,
                )}
              >
                <img
                  src={product.imageUrl}
                  data-fallbacks={JSON.stringify(product.imageFallbackUrls || [])}
                  alt={product.name}
                  loading="lazy"
                  onError={(event) => {
                    const image = event.currentTarget;
                    const fallbacks = JSON.parse(image.dataset.fallbacks || '[]');
                    const next = fallbacks.shift();
                    image.dataset.fallbacks = JSON.stringify(fallbacks);
                    if (next) {
                      image.src = next;
                      return;
                    }
                    image.hidden = true;
                    image.parentElement.classList.add('image-missing');
                  }}
                />
                {product.imagePreviewUrl && (
                  <iframe
                    className="drive-image-preview"
                    src={product.imagePreviewUrl}
                    title={`${product.name} image preview`}
                    loading="lazy"
                    tabIndex="-1"
                    aria-hidden="true"
                  />
                )}
                {product.badge && (
                  <span className={`product-badge badge-${badgeTone(product.badge)}`}>
                    {sentenceCase(product.badge)}
                  </span>
                )}
                {product.id && <span className="product-id card-product-id">{product.id}</span>}
              </a>
              <div className="product-card-content">
                <div className="product-detail-row">
                  <div className="product-card-heading">
                    <h3>{product.name}</h3>
                    <span className="product-category">{sentenceCase(product.category)}</span>
                  </div>
                  <p className="product-price">
                    {product.discount > 0 ? (
                      <>
                        <strong>
                          {'\u20B9'}
                          {Number(product.discountedPrice).toLocaleString('en-IN')}
                        </strong>
                        <del>
                          {'\u20B9'}
                          {Number(product.price).toLocaleString('en-IN')}
                        </del>
                        <span className="product-discount">{product.discount}% off</span>
                      </>
                    ) : (
                      <strong>
                        {'\u20B9'}
                        {Number(product.price).toLocaleString('en-IN')}
                      </strong>
                    )}
                  </p>
                </div>
                <a
                  className="meesho-button"
                  href={product.shopUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {STORE_CONTENT.catalogue.buyNow}
                </a>
              </div>
            </article>
          ))}
      </div>

      {!loading && !error && !filteredProducts.length && !filtersPending && (
        <div className="empty-state">
          <h3>{STORE_CONTENT.catalogue.emptyTitle}</h3>
          <p>{STORE_CONTENT.catalogue.emptyDescription}</p>
          <button onClick={clearFilters}>{STORE_CONTENT.catalogue.clearFilters}</button>
        </div>
      )}
      {!loading && !error && filteredProducts.length > visibleItems && (
        <div
          className="catalogue-scroll-sentinel"
          ref={scrollSentinel}
          aria-label={STORE_CONTENT.catalogue.moreProductsLabel}
        />
      )}

      <aside className="fabric-guide">
        <div className="fabric-mark" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>
        <div className="fabric-guide-copy">
          <p className="eyebrow">{STORE_CONTENT.catalogue.fabricGuide.eyebrow}</p>
          <h3>{STORE_CONTENT.catalogue.fabricGuide.title}</h3>
          <p>{STORE_CONTENT.catalogue.fabricGuide.description}</p>
        </div>
        <div className="fabric-guide-points">
          {STORE_CONTENT.catalogue.fabricGuide.points.map((point) => (
            <span key={point}>{point}</span>
          ))}
        </div>
      </aside>
    </section>
  );
};

export default Catalogue;
