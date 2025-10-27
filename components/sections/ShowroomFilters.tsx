'use client';

import { Listbox, Portal, Transition } from '@headlessui/react';
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { Fragment, ReactNode, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';

export type FilterState = {
  brand: string | null;
  fuel: string | null;
  transmission: string | null;
  priceMin: number | null;
  priceMax: number | null;
  yearMin: number | null;
  yearMax: number | null;
};

type Props = {
  value: FilterState;
  onChange: (value: FilterState) => void;
  brandOptions: string[];
  fuelOptions: string[];
  transmissionOptions: string[];
};

type RangeValue = {
  min: number | null;
  max: number | null;
};

function useFloatingPanel(buttonRef: React.RefObject<HTMLElement>) {
  const [style, setStyle] = useState<{ top: number; left: number; width: number }>({ top: 0, left: 0, width: 0 });
  const openRef = useRef(false);

  const updatePosition = useCallback(() => {
    if (typeof window === 'undefined' || !buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setStyle({ top: rect.bottom + window.scrollY + 4, left: rect.left + window.scrollX, width: rect.width });
  }, [buttonRef]);

  useEffect(() => {
    function handle() {
      if (!openRef.current) return;
      updatePosition();
    }

    window.addEventListener('resize', handle);
    window.addEventListener('scroll', handle, true);
    return () => {
      window.removeEventListener('resize', handle);
      window.removeEventListener('scroll', handle, true);
    };
  }, [updatePosition]);

  const register = useCallback(
    (isOpen: boolean) => {
      openRef.current = isOpen;
      if (isOpen) {
        updatePosition();
      }
    },
    [updatePosition]
  );

  return { style, register };
}

function FloatingPanel({
  open,
  buttonRef,
  panelId,
  children
}: {
  open: boolean;
  buttonRef: React.RefObject<HTMLButtonElement>;
  panelId: string;
  children: ReactNode;
}) {
  const { style, register } = useFloatingPanel(buttonRef);

  useEffect(() => {
    register(open);
  }, [open, register]);

  return (
    <Portal>
      <Transition
        show={open}
        as={Fragment}
        enter="transition ease-out duration-150"
        enterFrom="opacity-0 -translate-y-2"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div
          id={panelId}
          style={style}
          className="fixed z-[90] mt-1 max-w-md rounded-2xl border border-white/20 bg-black/80 p-3 text-xs uppercase tracking-[0.35em] text-silver/80 shadow-2xl backdrop-blur-xl"
        >
          {children}
        </div>
      </Transition>
    </Portal>
  );
}

function FilterListbox({
  label,
  value,
  options,
  onChange
}: {
  label: string;
  value: string | null;
  options: (string | null)[];
  onChange: (value: string | null) => void;
}) {
  const formatted = useMemo(
    () =>
      options.map((option) => ({
        label: option ?? 'All',
        value: option
      })),
    [options]
  );

  const current = formatted.find((option) => option.value === value) ?? formatted[0];
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  return (
    <Listbox value={value} onChange={onChange}>
      {({ open }) => (
        <div className="relative">
          <Listbox.Button
            ref={buttonRef}
            aria-label={`${label} filter`}
            aria-expanded={open}
            aria-controls={panelId}
            className="flex min-h-12 w-full items-center justify-between rounded-full border border-white/25 bg-black/60 px-4 py-3 text-xs uppercase tracking-[0.35em] text-silver/80 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 sm:px-5"
          >
            <span className="flex-1 text-left font-medium text-silver/80">
              {label}: <span className="text-white/90">{current.label}</span>
            </span>
            <ChevronUpDownIcon aria-hidden className="ml-3 h-4 w-4 flex-shrink-0" />
          </Listbox.Button>
          <FloatingPanel open={open} buttonRef={buttonRef} panelId={panelId}>
            <Listbox.Options static className="max-h-64 w-full overflow-auto">
              {formatted.map((option) => (
                <Listbox.Option key={option.label} value={option.value}>
                  {({ active, selected }) => (
                    <div
                      className={clsx(
                        'flex cursor-pointer items-center justify-between rounded-2xl px-4 py-3 transition',
                        active && 'bg-white/10 text-white'
                      )}
                    >
                      <span>{option.label}</span>
                      {selected && <CheckIcon aria-hidden className="h-4 w-4" />}
                    </div>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </FloatingPanel>
        </div>
      )}
    </Listbox>
  );
}

function formatRangeLabel(value: RangeValue, prefix = '', suffix = '') {
  const { min, max } = value;
  if (min === null && max === null) return 'Any';
  if (min !== null && max !== null) return `${prefix}${min.toLocaleString()}${suffix} – ${prefix}${max.toLocaleString()}${suffix}`;
  if (min !== null) return `From ${prefix}${min.toLocaleString()}${suffix}`;
  return `Up to ${prefix}${max?.toLocaleString() ?? ''}${suffix}`;
}

function RangeDropdown({
  label,
  value,
  onChange,
  min,
  max,
  step,
  prefix,
  suffix
}: {
  label: string;
  value: RangeValue;
  onChange: (value: RangeValue) => void;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
}) {
  const [draft, setDraft] = useState<RangeValue>(value);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    setDraft(value);
  }, [value]);

  function parse(value: string): number | null {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  const selection = value.min !== null || value.max !== null ? 'custom' : 'none';

  return (
    <Listbox value={selection} onChange={(action: string) => {
      if (action === 'apply') {
        onChange(draft);
      }
      if (action === 'clear') {
        const cleared = { min: null, max: null };
        setDraft(cleared);
        onChange(cleared);
      }
    }}>
      {({ open }) => (
        <div className="relative">
          <Listbox.Button
            ref={buttonRef}
            aria-label={`${label} filter`}
            aria-expanded={open}
            aria-controls={panelId}
            className="flex min-h-12 w-full items-center justify-between rounded-full border border-white/25 bg-black/60 px-4 py-3 text-xs uppercase tracking-[0.35em] text-silver/80 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 sm:px-5"
          >
            <span className="flex-1 text-left font-medium text-silver/80">
              {label}: <span className="text-white/90">{formatRangeLabel(value, prefix, suffix)}</span>
            </span>
            <ChevronUpDownIcon aria-hidden className="ml-3 h-4 w-4 flex-shrink-0" />
          </Listbox.Button>
          <FloatingPanel open={open} buttonRef={buttonRef} panelId={panelId}>
            <Listbox.Options static className="space-y-4">
              <Listbox.Option value="custom" className="hidden">
                Custom
              </Listbox.Option>
              <Listbox.Option value="none" className="hidden">
                None
              </Listbox.Option>
              <div className="grid gap-3 text-left text-[0.65rem] normal-case tracking-[0.25em]">
                <label className="flex flex-col gap-2">
                  <span className="text-silver/60">Minimum</span>
                  <input
                    type="number"
                    min={min}
                    max={max}
                    step={step}
                    value={draft.min ?? ''}
                    onChange={(event) => setDraft((prev) => ({ ...prev, min: parse(event.target.value) }))}
                    className="rounded-full border border-white/25 bg-black/60 px-4 py-2 text-sm text-white placeholder:text-silver/40 focus:border-white/60 focus:outline-none"
                    placeholder={min ? `${prefix ?? ''}${min.toLocaleString()}${suffix ?? ''}` : 'Any'}
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-silver/60">Maximum</span>
                  <input
                    type="number"
                    min={min}
                    max={max}
                    step={step}
                    value={draft.max ?? ''}
                    onChange={(event) => setDraft((prev) => ({ ...prev, max: parse(event.target.value) }))}
                    className="rounded-full border border-white/25 bg-black/60 px-4 py-2 text-sm text-white placeholder:text-silver/40 focus:border-white/60 focus:outline-none"
                    placeholder={max ? `${prefix ?? ''}${max.toLocaleString()}${suffix ?? ''}` : 'Any'}
                  />
                </label>
              </div>
              <div className="flex items-center justify-between gap-3">
                <Listbox.Option
                  as="button"
                  type="button"
                  value="clear"
                  className="cursor-pointer rounded-full border border-white/15 px-4 py-2 text-[0.65rem] uppercase tracking-[0.3em] text-silver/70 transition hover:border-white/40 hover:text-white"
                >
                  Clear
                </Listbox.Option>
                <Listbox.Option
                  as="button"
                  type="button"
                  value="apply"
                  className="cursor-pointer rounded-full border border-white/30 bg-white/10 px-5 py-2 text-[0.65rem] uppercase tracking-[0.3em] text-white transition hover:bg-white/20"
                >
                  Apply
                </Listbox.Option>
              </div>
            </Listbox.Options>
          </FloatingPanel>
        </div>
      )}
    </Listbox>
  );
}

export default function ShowroomFilters({ value, onChange, brandOptions, fuelOptions, transmissionOptions }: Props) {
  return (
    <div className="relative z-10 mb-6">
      <div className="surface-panel isolate grid gap-3 rounded-3xl p-4 md:grid-cols-4">
        <FilterListbox label="Brand" value={value.brand} options={[null, ...brandOptions]} onChange={(brand) => onChange({ ...value, brand })} />
        <FilterListbox label="Fuel" value={value.fuel} options={[null, ...fuelOptions]} onChange={(fuel) => onChange({ ...value, fuel })} />
        <FilterListbox
          label="Transmission"
          value={value.transmission}
          options={[null, ...transmissionOptions]}
          onChange={(transmission) => onChange({ ...value, transmission })}
        />
        <RangeDropdown
          label="Price"
          value={{ min: value.priceMin, max: value.priceMax }}
          onChange={(range) => onChange({ ...value, priceMin: range.min, priceMax: range.max })}
          min={50000}
          max={1000000}
          step={5000}
          prefix="€"
        />
        <RangeDropdown
          label="Year"
          value={{ min: value.yearMin, max: value.yearMax }}
          onChange={(range) => onChange({ ...value, yearMin: range.min, yearMax: range.max })}
          min={1990}
          max={new Date().getFullYear() + 1}
          step={1}
        />
      </div>
    </div>
  );
}

// REQUIRED ASSETS (not included):
// none
