import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const AdminSelect = ({
  name,
  label,
  options,
  value = '',
  onChange,
  emptyLabel = 'None',
  includeEmptyOption = true,
}) => {
  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState({});
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const normalizedOptions = options.map((option) =>
    typeof option === 'string' ? { value: option, label: option } : option,
  );
  const selectedLabel =
    normalizedOptions.find((option) => option.value === value)?.label ||
    (value ? String(value) : emptyLabel);

  const updateMenuPosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const below = Math.max(0, window.innerHeight - rect.bottom - 16);
    const above = Math.max(0, rect.top - 16);
    const desiredHeight = Math.min(
      220,
      (normalizedOptions.length + (includeEmptyOption ? 1 : 0)) * 37 + 10,
    );
    const opensAbove = below < desiredHeight && above > below;
    const availableHeight = opensAbove ? above : below;
    setMenuStyle({
      position: 'fixed',
      left: `${rect.left}px`,
      right: 'auto',
      width: `${rect.width}px`,
      top: opensAbove ? 'auto' : `${rect.bottom + 8}px`,
      bottom: opensAbove ? `${window.innerHeight - rect.top + 8}px` : 'auto',
      maxHeight: `${Math.max(80, Math.min(desiredHeight, availableHeight))}px`,
      overflowY: 'auto',
      overscrollBehavior: 'contain',
      zIndex: 1100,
    });
  }, [includeEmptyOption, normalizedOptions.length]);

  useEffect(() => {
    if (!open) return undefined;
    updateMenuPosition();
    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target) && !menuRef.current?.contains(event.target))
        setOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', updateMenuPosition);
    window.addEventListener('scroll', updateMenuPosition, true);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', updateMenuPosition);
      window.removeEventListener('scroll', updateMenuPosition, true);
    };
  }, [open, updateMenuPosition]);

  const optionMenu =
    open &&
    createPortal(
      <div
        ref={menuRef}
        className="catalogue-filter-menu admin-select-portal"
        role="listbox"
        aria-label={label}
        style={menuStyle}
      >
        {includeEmptyOption && (
          <button
            type="button"
            role="option"
            aria-selected={!value}
            className="catalogue-filter-option"
            onClick={() => {
              onChange('');
              setOpen(false);
            }}
          >
            {emptyLabel}
          </button>
        )}
        {normalizedOptions.map((option) => (
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
            {option.label}
          </button>
        ))}
      </div>,
      document.body,
    );

  return (
    <div className={`catalogue-filter admin-custom-select${open ? ' is-open' : ''}`} ref={rootRef}>
      <input type="hidden" name={name} value={value} readOnly />
      <button
        ref={triggerRef}
        type="button"
        className="catalogue-filter-trigger"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span className="catalogue-filter-value">{selectedLabel}</span>
        <svg
          className="filter-chevron"
          aria-hidden="true"
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {optionMenu}
    </div>
  );
};

export default AdminSelect;
