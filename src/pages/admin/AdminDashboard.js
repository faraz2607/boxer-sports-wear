import { useEffect, useMemo, useState } from 'react';
import DataTable from './DataTable';
import ItemModal from './ItemModal';
import BulkDiscountModal from './BulkDiscountModal';
import {
  DATE_FILTER_OPTIONS,
  DAY_MS,
  FILES,
  ID_PREFIXES,
  NOTICE_DURATION_MS,
  PAGE_SIZE,
  PRODUCT_BADGES,
  PRODUCT_CATEGORIES,
  ROUTES,
  SORT_FILTER_OPTIONS,
} from '../../common/constants';
import { canonical, nextId, validateRow } from './config';
import { downloadRows, rowsFromCsv } from './csv';
import AdminSelect from './AdminSelect';

const AdminDashboard = ({ data, onDataChange, onLogout }) => {
  const [activeTab, setActiveTab] = useState('catalog');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [badgeFilter, setBadgeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortFilter, setSortFilter] = useState('default');
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null);
  const [notice, setNotice] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [copiedRow, setCopiedRow] = useState(null);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [bulkDiscountOpen, setBulkDiscountOpen] = useState(false);
  const showNotice = (message, type = 'error') => setNotice({ message, type });
  const rows = data[activeTab];
  const categories = useMemo(
    () =>
      [
        ...new Set([
          ...PRODUCT_CATEGORIES,
          ...data.catalog.map((row) => row.category).filter(Boolean),
        ]),
      ].sort(),
    [data.catalog],
  );
  const badges = useMemo(
    () =>
      [
        ...new Set([...PRODUCT_BADGES, ...data.catalog.map((row) => row.badge).filter(Boolean)]),
      ].sort(),
    [data.catalog],
  );
  const filteredRows = useMemo(
    () =>
      rows
        .filter((row) => {
          const matchesSearch = FILES[activeTab].headers.some((field) =>
            canonical(row[field]).includes(canonical(search)),
          );
          const matchesCategory =
            activeTab !== 'catalog' || categoryFilter === 'all' || row.category === categoryFilter;
          const matchesBadge =
            activeTab !== 'catalog' || badgeFilter === 'all' || row.badge === badgeFilter;
          const ageInDays = (Date.now() - Date.parse(row.createdAt || '')) / DAY_MS;
          const matchesDate =
            activeTab !== 'catalog' ||
            dateFilter === 'all' ||
            (Number.isFinite(ageInDays) && ageInDays >= 0 && ageInDays <= Number(dateFilter));
          return matchesSearch && matchesCategory && matchesBadge && matchesDate;
        })
        .sort((first, second) => {
          if (activeTab !== 'catalog') return 0;
          if (sortFilter === 'newest')
            return Date.parse(second.createdAt || 0) - Date.parse(first.createdAt || 0);
          if (sortFilter === 'oldest')
            return Date.parse(first.createdAt || 0) - Date.parse(second.createdAt || 0);
          if (sortFilter === 'price-low')
            return Number(first.price || 0) - Number(second.price || 0);
          if (sortFilter === 'price-high')
            return Number(second.price || 0) - Number(first.price || 0);
          return 0;
        }),
    [rows, activeTab, search, categoryFilter, badgeFilter, dateFilter, sortFilter],
  );
  const pageCount = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const pageRows = filteredRows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
    setSelectedProductIds([]);
  }, [activeTab, search, categoryFilter, badgeFilter, dateFilter, sortFilter]);
  useEffect(() => {
    if (!notice) return undefined;
    const timer = window.setTimeout(() => setNotice(null), NOTICE_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const uploadCsv = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
      const uploaded = rowsFromCsv(activeTab, await file.text(), data[activeTab]);
      await onDataChange({ ...data, [activeTab]: [...data[activeTab], ...uploaded] });
      showNotice(`${uploaded.length} row${uploaded.length === 1 ? '' : 's'} imported.`, 'success');
    } catch (error) {
      showNotice(error.message);
    }
  };
  const saveItem = async (event) => {
    event.preventDefault();
    setFieldErrors({});
    const submitted = Object.fromEntries(new FormData(event.currentTarget).entries());
    const current = data[modal.type];
    const error = validateRow(modal.type, submitted, current, modal.row?.id || '');
    if (error) {
      if (error.startsWith('Meesho Product URL')) setFieldErrors({ meeshoProductUrl: error });
      else showNotice(error);
      return;
    }
    const timestamp = new Date().toISOString();
    const values =
      modal.type === 'catalog'
        ? { ...submitted, createdAt: modal.row?.createdAt || timestamp, updatedAt: timestamp }
        : submitted;
    const updatedRows = modal.row
      ? current.map((row) => (canonical(row.id) === canonical(modal.row.id) ? values : row))
      : [...current, values];
    try {
      await onDataChange({ ...data, [modal.type]: updatedRows });
      setModal(null);
      showNotice(modal.row ? 'Changes saved.' : 'Item added.', 'success');
    } catch (error) {
      showNotice(error.message);
    }
  };
  const deleteItem = async () => {
    const { type, row } = modal;
    try {
      await onDataChange({
        ...data,
        [type]: data[type].filter((item) => canonical(item.id) !== canonical(row.id)),
      });
      setSelectedProductIds((current) =>
        current.filter((id) => canonical(id) !== canonical(row.id)),
      );
      setModal(null);
      showNotice(`${row.id} deleted.`, 'success');
    } catch (error) {
      showNotice(error.message);
    }
  };

  const toggleProductSelection = (id) =>
    setSelectedProductIds((current) =>
      current.includes(id) ? current.filter((selectedId) => selectedId !== id) : [...current, id],
    );
  const toggleAllFilteredProducts = (ids) =>
    setSelectedProductIds((current) => {
      const selected = new Set(current);
      const allAlreadySelected = ids.length > 0 && ids.every((id) => selected.has(id));
      ids.forEach((id) => (allAlreadySelected ? selected.delete(id) : selected.add(id)));
      return [...selected];
    });

  const applyBulkDiscount = async (discount, scope) => {
    const targetIds = new Set(
      scope === 'selected' ? selectedProductIds : data.catalog.map((row) => row.id),
    );
    const timestamp = new Date().toISOString();
    const updatedCatalog = data.catalog.map((row) =>
      targetIds.has(row.id) ? { ...row, discount: String(discount), updatedAt: timestamp } : row,
    );
    try {
      await onDataChange({ ...data, catalog: updatedCatalog });
      setBulkDiscountOpen(false);
      showNotice(
        `Discount updated for ${targetIds.size} product${targetIds.size === 1 ? '' : 's'}.`,
        'success',
      );
    } catch (error) {
      showNotice(error.message);
    }
  };

  const resetProductIds = async () => {
    const timestamp = new Date().toISOString();
    const updatedCatalog = data.catalog.map((row, index) => ({
      ...row,
      id: `${ID_PREFIXES.catalog}-${String(index + 1).padStart(3, '0')}`,
      updatedAt: timestamp,
    }));
    try {
      await onDataChange({ ...data, catalog: updatedCatalog });
      setSelectedProductIds([]);
      setModal(null);
      showNotice(`Reset ${updatedCatalog.length} product IDs.`, 'success');
    } catch (error) {
      showNotice(error.message);
    }
  };

  const copyRow = (row) => {
    const content = Object.fromEntries(
      FILES.catalog.fields
        .filter((field) => field.name !== 'id')
        .map((field) => [field.name, row[field.name] || '']),
    );
    setCopiedRow(content);
    showNotice(`Product ${row.id} copied. Add a product and paste its details.`, 'success');
  };
  const pasteRow = () =>
    setModal((current) => ({ ...current, initialValues: copiedRow, pasteKey: Date.now() }));
  const openAddModal = () => {
    setFieldErrors({});
    setModal({
      type: activeTab,
      row: null,
      nextId: nextId(data[activeTab], ID_PREFIXES[activeTab]),
    });
  };

  return (
    <main className="admin-page">
      <div className="admin-shell">
        <header className="admin-topbar">
          <div>
            <p className="admin-eyebrow">BOXER SPORTS WEAR</p>
            <h1>Catalog manager</h1>
          </div>
          <div className="admin-topbar-actions">
            <a className="admin-secondary" href={ROUTES.storefrontFromAdmin}>
              Back to Shop
            </a>
            <button className="admin-secondary" type="button" onClick={onLogout}>
              Sign out
            </button>
          </div>
        </header>
        <section className="admin-panel">
          <div className="admin-toolbar">
            <div className="admin-tabs" role="tablist" aria-label="Manage files">
              {Object.keys(FILES).map((type) => (
                <button
                  key={type}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === type}
                  className={activeTab === type ? 'active' : ''}
                  onClick={() => {
                    setActiveTab(type);
                    setSearch('');
                    setCategoryFilter('all');
                    setBadgeFilter('all');
                    setDateFilter('all');
                    setSortFilter('default');
                  }}
                >
                  {FILES[type].title}
                  <span>{data[type].length}</span>
                </button>
              ))}
            </div>
            <div className="admin-actions">
              <button
                type="button"
                className="admin-secondary"
                onClick={() => {
                  if (!downloadRows(activeTab, data[activeTab])) {
                    showNotice('There is no data to download.');
                  }
                }}
              >
                Download CSV
              </button>
              {activeTab === 'catalog' && (
                <>
                  <button
                    type="button"
                    className="admin-secondary"
                    disabled={!data.catalog.length}
                    onClick={() => setBulkDiscountOpen(true)}
                  >
                    Bulk discount
                  </button>
                  <button
                    type="button"
                    className="admin-secondary"
                    disabled={!data.catalog.length}
                    onClick={() =>
                      setModal({
                        type: 'catalog',
                        confirmResetIds: true,
                        productCount: data.catalog.length,
                      })
                    }
                  >
                    Reset product IDs
                  </button>
                </>
              )}
              {!data[activeTab].length && (
                <label className="admin-secondary admin-upload">
                  Upload CSV
                  <input type="file" accept=".csv,text/csv" onChange={uploadCsv} />
                </label>
              )}
              <button type="button" className="admin-primary" onClick={openAddModal}>
                + Add {activeTab === 'catalog' ? 'product' : 'slide'}
              </button>
            </div>
          </div>
          <div
            className={`admin-filters${activeTab === 'carousel' ? ' admin-filters-carousel' : ''}`}
          >
            <label>
              <input
                type="search"
                aria-label={`Search ${activeTab === 'catalog' ? 'products' : 'carousel slides'}`}
                placeholder={
                  activeTab === 'catalog'
                    ? 'Search products by name, ID, or details'
                    : 'Search carousel slides by title, ID, or image URL'
                }
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>
            {activeTab === 'catalog' && (
              <>
                <div className="admin-filter-control">
                  <AdminSelect
                    name="category-filter"
                    label="Category filter"
                    selectedLabelPrefix="Category"
                    value={categoryFilter}
                    options={[
                      { value: 'all', label: 'All categories' },
                      ...categories.map((category) => ({ value: category, label: category })),
                    ]}
                    includeEmptyOption={false}
                    onChange={setCategoryFilter}
                  />
                </div>
                <div className="admin-filter-control">
                  <AdminSelect
                    name="badge-filter"
                    label="Badge filter"
                    selectedLabelPrefix="Badge"
                    value={badgeFilter}
                    options={[
                      { value: 'all', label: 'All badges' },
                      ...badges.map((badge) => ({ value: badge, label: badge })),
                    ]}
                    includeEmptyOption={false}
                    onChange={setBadgeFilter}
                  />
                </div>
                <div className="admin-filter-control">
                  <AdminSelect
                    name="date-filter"
                    label="Date added filter"
                    selectedLabelPrefix="Date added"
                    value={dateFilter}
                    options={DATE_FILTER_OPTIONS}
                    includeEmptyOption={false}
                    onChange={setDateFilter}
                  />
                </div>
                <div className="admin-filter-control">
                  <AdminSelect
                    name="sort-filter"
                    label="Sort products"
                    selectedLabelPrefix="Sort"
                    value={sortFilter}
                    options={SORT_FILTER_OPTIONS}
                    includeEmptyOption={false}
                    onChange={setSortFilter}
                  />
                </div>
                <button
                  className="admin-clear-filters"
                  type="button"
                  onClick={() => {
                    setCategoryFilter('all');
                    setBadgeFilter('all');
                    setDateFilter('all');
                    setSortFilter('default');
                    setSearch('');
                  }}
                >
                  Clear filters
                </button>
              </>
            )}
            <p>
              {filteredRows.length} {filteredRows.length === 1 ? 'item' : 'items'}
            </p>
          </div>
          {activeTab === 'catalog' && (
            <p className="admin-selection-count" aria-live="polite">
              {selectedProductIds.length} products selected. Select all applies to every filtered
              product across pages.
            </p>
          )}
          <DataTable
            type={activeTab}
            rows={pageRows}
            page={page}
            pageCount={pageCount}
            onPageChange={setPage}
            onEdit={(row) => {
              setFieldErrors({});
              setModal({ type: activeTab, row });
            }}
            onDelete={(row) => setModal({ type: activeTab, row, confirmDelete: true })}
            onCopy={copyRow}
            selectedIds={selectedProductIds}
            selectableRows={activeTab === 'catalog' ? filteredRows : []}
            onToggleRow={toggleProductSelection}
            onToggleAll={toggleAllFilteredProducts}
          />
          <p className="admin-local-note">
            Changes are saved in encrypted local storage in this browser. Download the CSV to
            publish updates to your live sheet.
          </p>
        </section>
        {notice && (
          <div
            className={`admin-toast ${notice.type}`}
            role={notice.type === 'error' ? 'alert' : 'status'}
          >
            <span>{notice.message}</span>
            <button type="button" aria-label="Dismiss" onClick={() => setNotice(null)}>
              ×
            </button>
          </div>
        )}
        {modal && (
          <ItemModal
            key={
              modal.pasteKey ||
              modal.row?.id ||
              (modal.confirmResetIds ? 'reset-product-ids' : modal.type)
            }
            modal={modal}
            onClose={() => setModal(null)}
            onSave={saveItem}
            onDelete={deleteItem}
            onResetIds={resetProductIds}
            fieldErrors={fieldErrors}
            onFieldChange={(name) => setFieldErrors((current) => ({ ...current, [name]: '' }))}
            copiedRow={copiedRow}
            onPaste={pasteRow}
          />
        )}
        {bulkDiscountOpen && (
          <BulkDiscountModal
            productCount={data.catalog.length}
            selectedCount={selectedProductIds.length}
            onClose={() => setBulkDiscountOpen(false)}
            onApply={applyBulkDiscount}
          />
        )}
      </div>
    </main>
  );
};

export default AdminDashboard;
