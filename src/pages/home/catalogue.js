import { useEffect, useMemo, useState } from "react";
import { loadProducts } from "./products";

const filterKey = (value) => String(value || "").trim().toLowerCase();
const sentenceCase = (value) => {
  const text = String(value || "").trim().toLowerCase();
  return text ? `${text.charAt(0).toUpperCase()}${text.slice(1)}` : "";
};
const badgeTone = (badge) => {
  const value = filterKey(badge);
  if (/\b(new|latest|just in|new arrival|fresh)\b/.test(value)) return "latest";
  if (/\b(trending|popular|hot|viral|must have)\b/.test(value)) return "trending";
  if (/\b(best|bestseller|best seller|top seller|top pick|staff pick|favourite|favorite|best rated)\b/.test(value)) return "best";
  if (/\b(sale|offer|discount|deal|limited)\b/.test(value)) return "offer";
  return "classic";
};

const Catalogue = () => {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [badge, setBadge] = useState("all");
  const [sort, setSort] = useState("featured");
  const [visibleItems, setVisibleItems] = useState(8);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    loadProducts()
      .then((items) => {
        if (active) {
          setProducts(items);
          if (!items.length) setError("No products were found in the published catalog.");
        }
      })
      .catch((loadError) => {
        if (active) setError(loadError.message || "The product catalog could not be loaded.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const categories = useMemo(() => [
    { value: "all", label: "All" },
    ...Array.from(new Set(products.map((product) => filterKey(product.category)).filter(Boolean)))
      .map((value) => ({ value, label: sentenceCase(products.find((product) => filterKey(product.category) === value)?.category) })),
  ], [products]);
  const badges = useMemo(() => Array.from(new Set(products.map((product) => filterKey(product.badge)).filter(Boolean)))
    .map((value) => ({ value, label: sentenceCase(products.find((product) => filterKey(product.badge) === value)?.badge) })), [products]);
  const filteredProducts = useMemo(() => {
    const normalizedQuery = filterKey(query);
    const items = products.filter((product) =>
      (category === "all" || filterKey(product.category) === category) &&
      (badge === "all" || filterKey(product.badge) === badge) &&
      (!normalizedQuery || filterKey(`${product.name} ${product.category} ${product.id} ${product.badge}`).includes(normalizedQuery))
    );
    if (sort === "price-low") items.sort((a, b) => a.price - b.price);
    if (sort === "price-high") items.sort((a, b) => b.price - a.price);
    return items;
  }, [products, query, category, badge, sort]);

  return (
    <section id="catalogue" className="catalogue-section py-12 md:py-20">
      <div className="catalogue-heading">
        <div>
          <p className="eyebrow">THE BOXER SPORTS WEAR COLLECTION</p>
          <h2>Comfort, culture,<br /><span>and everyday style.</span></h2>
          <p className="section-copy">Shop lowers, T-shirts, and the finishing touch: stolas, gamchas, Arabic rumals, and shemaghs. Explore each item on Meesho.</p>
        </div>
        <div className="catalogue-note"><span className="note-dot" /> Curated for comfort, priced for everyday</div>
      </div>

      <div className="catalogue-toolbar">
        <label className="search-box"><span aria-hidden="true">?</span><input value={query} onChange={(event) => { setQuery(event.target.value); setVisibleItems(8); }} placeholder="Search products" aria-label="Search products" /></label>
        <label className="catalogue-select">Category<select value={category} onChange={(event) => { setCategory(event.target.value); setVisibleItems(8); }} aria-label="Filter by category">
          <option value="all">All categories</option>
          {categories.slice(1).map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
        </select></label>
        <label className="catalogue-select">Badge<select value={badge} onChange={(event) => { setBadge(event.target.value); setVisibleItems(8); }} aria-label="Filter by badge">
          <option value="all">All badges</option>
          {badges.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
        </select></label>
        <label className="catalogue-select">Sort by<select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort products">
          <option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option>
        </select></label>
      </div>

      <aside className="fabric-guide">
        <div className="fabric-mark" aria-hidden="true"><span /><span /><span /><span /></div>
        <div className="fabric-guide-copy">
          <p className="eyebrow">A CLOSER LOOK AT FABRIC &amp; TEXTILE</p>
          <h3>Made for comfort. Styled your way.</h3>
          <p>From easy everyday lowers and tees to expressive traditional wraps, the right textile makes every piece feel personal. Open the Meesho listing for each item's exact fabric composition, fit, and care instructions.</p>
        </div>
        <div className="fabric-guide-points"><span>Fabric composition</span><span>Fit &amp; feel</span><span>Care instructions</span></div>
      </aside>

      {loading && <div className="catalogue-state" role="status">Loading Boxer Sports Wear products...</div>}
      {!loading && error && <div className="catalogue-state catalogue-error" role="alert">{error}</div>}
      <div className="product-grid">
        {!loading && !error && filteredProducts.slice(0, visibleItems).map((product) => (
          <article className="product-card" key={product.id}>
            <a className="product-image-link" href={product.shopUrl} target="_blank" rel="noreferrer" aria-label={`Explore ${product.name} on Meesho`}>
              <img src={product.imageUrl} data-fallbacks={JSON.stringify(product.imageFallbackUrls || [])} alt={product.name} loading="lazy" onError={(event) => { const image = event.currentTarget; const fallbacks = JSON.parse(image.dataset.fallbacks || "[]"); const next = fallbacks.shift(); image.dataset.fallbacks = JSON.stringify(fallbacks); if (next) { image.src = next; return; } image.hidden = true; image.parentElement.classList.add("image-missing"); }} />
              {product.imagePreviewUrl && <iframe className="drive-image-preview" src={product.imagePreviewUrl} title={`${product.name} image preview`} loading="lazy" tabIndex="-1" aria-hidden="true" />}
              {product.badge && <span className={`product-badge badge-${badgeTone(product.badge)}`}>{sentenceCase(product.badge)}</span>}
              {product.id && <span className="product-id card-product-id">{product.id}</span>}
              <span className="image-cta">View product</span>
            </a>
            <div className="product-card-content">
              <div className="product-detail-row">
                <div className="product-card-heading">
                  <h3>{product.name}</h3>
                  <span className="product-category">{sentenceCase(product.category)}</span>
                </div>
                <p className="product-price"><small>PRICE</small><strong>{"\u20B9"}{Number(product.price).toLocaleString("en-IN")}</strong></p>
              </div>
            </div>
          </article>
        ))}
      </div>

      {!loading && !error && !filteredProducts.length && <div className="empty-state"><span>?</span><h3>No pieces found</h3><p>Try another search or adjust your filters.</p><button onClick={() => { setQuery(""); setCategory("all"); setBadge("all"); }}>Clear filters</button></div>}
      {!loading && filteredProducts.length > visibleItems && <button className="load-more" onClick={() => setVisibleItems((count) => count + 8)}>Show more pieces <span aria-hidden="true">&#8595;</span></button>}
    </section>
  );
};

export default Catalogue;
