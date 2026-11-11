import { FILES } from '../../common/constants';

const displayDate = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const DataTable = ({
  type,
  rows,
  page,
  pageCount,
  onPageChange,
  onEdit,
  onDelete,
  onCopy,
  selectedIds = [],
  selectableRows = [],
  onToggleRow,
  onToggleAll,
}) => {
  const headers = FILES[type].headers;
  const selectable = type === 'catalog';
  const allSelected =
    selectableRows.length > 0 && selectableRows.every((row) => selectedIds.includes(row.id));
  const someSelected = selectableRows.some((row) => selectedIds.includes(row.id));
  const labelFor = (header) =>
    ({
      createdAt: 'Date added',
      updatedAt: 'Last modified',
      meeshoProductUrl: 'Meesho Product URL',
      driveLink: 'Google Drive product url',
    })[header] ||
    FILES[type].fields.find((field) => field.name === header)?.label ||
    header;

  return (
    <>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              {selectable && (
                <th className="admin-select-column">
                  <input
                    type="checkbox"
                    aria-label="Select all filtered products"
                    checked={allSelected}
                    ref={(element) => {
                      if (element) element.indeterminate = someSelected && !allSelected;
                    }}
                    disabled={!selectableRows.length}
                    onChange={() => onToggleAll(selectableRows.map((row) => row.id))}
                  />
                </th>
              )}
              {headers.map((header) => (
                <th key={header}>{labelFor(header)}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const selected = selectedIds.includes(row.id);
              return (
                <tr key={row.id} className={selected ? 'admin-row-selected' : ''}>
                  {selectable && (
                    <td className="admin-select-column">
                      <input
                        type="checkbox"
                        aria-label={`Select product ${row.productName || row.id}`}
                        checked={selected}
                        onChange={() => onToggleRow(row.id)}
                      />
                    </td>
                  )}
                  {headers.map((header) => {
                    const value = row[header] || '—';
                    const isUrl = ['driveLink', 'meeshoProductUrl', 'driveUrl'].includes(header);
                    return (
                      <td
                        key={header}
                        className={isUrl ? 'admin-url-cell' : undefined}
                        title={isUrl && row[header] ? row[header] : undefined}
                      >
                        {header === 'createdAt' || header === 'updatedAt'
                          ? displayDate(row[header])
                          : value}
                      </td>
                    );
                  })}
                  <td className="admin-row-actions">
                    {(!selectable || selected) && (
                      <>
                        <button type="button" onClick={() => onEdit(row)}>
                          Edit
                        </button>
                        <button type="button" className="danger" onClick={() => onDelete(row)}>
                          Delete
                        </button>
                      </>
                    )}
                    {selectable && (
                      <button type="button" onClick={() => onCopy(row)}>
                        Copy
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
            {!rows.length && (
              <tr>
                <td className="admin-empty" colSpan={headers.length + (selectable ? 2 : 1)}>
                  No items match. Add a row or upload a CSV to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <footer className="admin-pagination">
        <span>
          Page {page} of {pageCount}
        </span>
        <div>
          <button type="button" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
            Previous
          </button>
          <button type="button" disabled={page >= pageCount} onClick={() => onPageChange(page + 1)}>
            Next
          </button>
        </div>
      </footer>
    </>
  );
};

export default DataTable;
