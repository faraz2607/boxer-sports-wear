import { useState } from 'react';
import { FILES } from '../../common/constants';
import AdminSelect from './AdminSelect';

const ItemModal = ({
  modal,
  onClose,
  onSave,
  onDelete,
  onResetIds,
  fieldErrors,
  onFieldChange,
  copiedRow,
  onPaste,
}) => {
  const fields = FILES[modal.type].fields;
  const [values, setValues] = useState(() =>
    Object.fromEntries(
      fields.map((field) => [
        field.name,
        modal.row?.[field.name] ??
          modal.initialValues?.[field.name] ??
          (field.name === 'id' ? modal.nextId : ''),
      ]),
    ),
  );
  const updateField = (name, value) => {
    setValues((current) => ({ ...current, [name]: value }));
    onFieldChange?.(name, value);
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
        className="admin-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-modal-title"
      >
        {modal.confirmDelete ? (
          <>
            <p className="admin-eyebrow">CONFIRM DELETE</p>
            <h2 id="admin-modal-title">Delete {modal.row.id}?</h2>
            <p className="admin-muted">This item will be removed from this browser's saved file.</p>
            <div className="admin-modal-actions">
              <button className="admin-secondary" type="button" onClick={onClose}>
                Cancel
              </button>
              <button className="admin-danger-button" type="button" onClick={onDelete}>
                Delete item
              </button>
            </div>
          </>
        ) : modal.confirmResetIds ? (
          <>
            <p className="admin-eyebrow">CONFIRM ID RESET</p>
            <h2 id="admin-modal-title">Reset product IDs?</h2>
            <p className="admin-muted">
              All {modal.productCount} product IDs will be reassigned sequentially (BX-001, BX-002,
              and so on). Product details and addition dates will be preserved. Existing links that
              use product IDs may need updating.
            </p>
            <div className="admin-modal-actions">
              <button className="admin-secondary" type="button" onClick={onClose}>
                Cancel
              </button>
              <button className="admin-danger-button" type="button" onClick={onResetIds}>
                Reset product IDs
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={onSave}>
            <div className="admin-modal-heading">
              <div>
                <p className="admin-eyebrow">{modal.row ? 'EDIT ITEM' : 'NEW ITEM'}</p>
                <h2 id="admin-modal-title">
                  {modal.row ? 'Edit' : 'Add'}{' '}
                  {modal.type === 'catalog' ? 'product' : 'carousel slide'}
                </h2>
              </div>
              {modal.type === 'catalog' && !modal.row && copiedRow && (
                <button type="button" className="admin-paste-row" onClick={onPaste}>
                  Paste copied details
                </button>
              )}
            </div>
            <div className="admin-form-grid">
              {fields.map((field) => {
                const value = values[field.name] ?? '';
                const error = fieldErrors?.[field.name];
                return field.type === 'select' ? (
                  <div className={`admin-field${field.wide ? ' wide' : ''}`} key={field.name}>
                    <span>
                      {field.label}
                      {field.required ? ' *' : ''}
                    </span>
                    <AdminSelect
                      name={field.name}
                      label={field.label}
                      options={field.options}
                      value={value}
                      onChange={(nextValue) => updateField(field.name, nextValue)}
                    />
                  </div>
                ) : (
                  <label
                    className={`admin-field${field.wide ? ' wide' : ''}${error ? ' has-error' : ''}`}
                    key={field.name}
                  >
                    <span>
                      {field.label}
                      {field.required ? ' *' : ''}
                    </span>
                    <input
                      name={field.name}
                      type={field.type || 'text'}
                      min={field.type === 'number' ? '0' : undefined}
                      max={field.name === 'discount' ? '100' : undefined}
                      step={field.type === 'number' ? 'any' : undefined}
                      required={field.required}
                      value={value}
                      readOnly={field.name === 'id' && Boolean(modal.row)}
                      aria-invalid={Boolean(error)}
                      aria-describedby={error ? `${field.name}-error` : undefined}
                      onChange={(event) => updateField(field.name, event.target.value)}
                    />
                    {error && (
                      <small className="admin-field-error" id={`${field.name}-error`} role="alert">
                        {error}
                      </small>
                    )}
                  </label>
                );
              })}
            </div>
            <div className="admin-modal-actions">
              <button className="admin-secondary" type="button" onClick={onClose}>
                Cancel
              </button>
              <button className="admin-primary" type="submit">
                Save {modal.type === 'catalog' ? 'product' : 'slide'}
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
};

export default ItemModal;
