import { forwardRef, useEffect, useState } from 'react';

import { Input } from '@/components/ui/input.js';

interface CurrencyInputProps extends Omit<
  React.ComponentProps<typeof Input>,
  'value' | 'onChange' | 'type'
> {
  value: number | undefined;
  onValueChange: (value: number | undefined) => void;
}

const formatter = new Intl.NumberFormat('id-ID');

function formatDisplay(value: number | undefined) {
  if (value === undefined || !Number.isFinite(value)) return '';
  return formatter.format(value);
}

function parseDigits(raw: string) {
  const digits = raw.replace(/\D/g, '');
  if (digits === '') return undefined;
  return Number(digits);
}

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  function CurrencyInput({ value, onValueChange, onBlur, ...props }, ref) {
    // Keep an internal display string so the user can freely edit
    // (e.g. delete a trailing digit) without the formatter fighting them.
    const [display, setDisplay] = useState(() => formatDisplay(value));

    // Re-sync when the external value changes for reasons other than typing
    // here (e.g. form reset, switching between options).
    useEffect(() => {
      setDisplay(formatDisplay(value));
       
    }, [value]);

    return (
      <Input
        ref={ref}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        {...props}
        value={display}
        onChange={(event) => {
          const parsed = parseDigits(event.target.value);
          setDisplay(parsed === undefined ? '' : formatter.format(parsed));
          onValueChange(parsed);
        }}
        onBlur={(event) => {
          setDisplay(formatDisplay(value));
          onBlur?.(event);
        }}
      />
    );
  },
);
