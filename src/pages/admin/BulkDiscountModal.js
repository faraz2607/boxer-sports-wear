import { useState } from 'react';

const BulkDiscountModal = ({ productCount, selectedCount, onClose, onApply }) => {
  const [discount, setDiscount] = useState('');
  const [scope, setScope] = useState(selectedCount ? 'selected' : 'all');
  const targetCount = scope === 'selected' ? selectedCount : productCount;

  const submit = (event) => {
    event.preventDefault();
    const numericDiscount = Number(discount);
    if (
      !Number.isFinite(numericDiscount) ||
      numericDiscount < 0 ||
      numericDiscount > 100 ||
      !targetCount
    )
      return;
    onApply(numericDiscount, scope);
  };

  return (
    <div
      className="admin-modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="admin-modal admin-bulk-discount-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="bulk-discount-title"
      >
        <p className="admin-eyebrow">BULK PRODUCT UPDATE</p>
        <h2 id="bulk-discount-title">Set product discount</h2>
        <form onSubmit={submit}>
          <fieldset className="admin-bulk-scope">
            <legend>Apply discount to</legend>
            <label>
              <input
                type="radio"
                name="discount-scope"
                value="all"
                checked={scope === 'all'}
                onChange={() => setScope('all')}
              />{' '}
              All products <span>({productCount})</span>
            </label>
            <label>
              <input
                type="radio"
                name="discount-scope"
                value="selected"
                checked={scope === 'selected'}
                disabled={!selectedCount}
                onChange={() => setScope('selected')}
              />{' '}
              Selected products <span>({selectedCount})</span>
            </label>
          </fieldset>
          <label className="admin-field admin-bulk-discount-field">
            <span>Discount percentage (0–100)</span>
            <input
              type="number"
              min="0"
              max="100"
              step="any"
              required
              value={discount}
              onChange={(event) => setDiscount(event.target.value)}
            />
          </label>
          <p className="admin-muted">
            Setting 0% clears the discount for {targetCount}{' '}
            {targetCount === 1 ? 'product' : 'products'}.
          </p>
          <div className="admin-modal-actions">
            <button className="admin-secondary" type="button" onClick={onClose}>
              Cancel
            </button>
            <button className="admin-primary" type="submit" disabled={!targetCount}>
              Apply discount
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default BulkDiscountModal;
