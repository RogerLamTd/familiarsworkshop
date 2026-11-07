import { createContext, useContext, useState } from 'react';
import { CurrencyConverterProvider, useCurrencyLocalizer } from 'react-currency-localizer';

// Prices are authored in HKD. User picks a currency from the toggle (no auto/geo);
// react-currency-localizer converts with live rates (exchangerate-api.com).
const BASE = 'HKD';
const API_KEY = import.meta.env.VITE_EXCHANGERATE_API_KEY;
const STORE = 'fw-currency'; // persisted selection

// toggle label -> ISO 4217 code used for conversion/formatting
export const CURRENCIES = [
  { label: 'HKD', code: 'HKD' },
  { label: 'USD', code: 'USD' },
  { label: 'EUR', code: 'EUR' },
  { label: 'RMB', code: 'CNY' },
  { label: 'JPY', code: 'JPY' },
  { label: 'GBP', code: 'GBP' },
  { label: 'AUD', code: 'AUD' },
  { label: 'SGD', code: 'SGD' },
  { label: 'CAD', code: 'CAD' },
];

const Ctx = createContext(null);

// whole-number, rounded UP
const money = (amount, currency) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency', currency, maximumFractionDigits: 0, minimumFractionDigits: 0,
  }).format(Math.ceil(amount));

function Inner({ children }) {
  const [code, setCodeState] = useState(() => {
    const saved = localStorage.getItem(STORE);
    return CURRENCIES.some((c) => c.code === saved) ? saved : BASE; // else default HKD
  });
  const setCode = (c) => { localStorage.setItem(STORE, c); setCodeState(c); };

  // manualCurrency is always set, so the library never calls geolocation
  const { convert, isReady } = useCurrencyLocalizer({
    baseCurrency: BASE, apiKey: API_KEY, manualCurrency: code,
  });

  const fmt = (hkd) => {
    if (code === BASE) return money(hkd, BASE);
    const v = isReady ? convert(hkd) : null;
    return v == null ? money(hkd, BASE) : money(v, code); // default to HKD on failure
  };

  return <Ctx.Provider value={{ code, setCode, fmt }}>{children}</Ctx.Provider>;
}

export function CurrencyProvider({ children }) {
  return (
    <CurrencyConverterProvider>
      <Inner>{children}</Inner>
    </CurrencyConverterProvider>
  );
}

export const useCurrency = () => useContext(Ctx);
export const useFormatPrice = () => useContext(Ctx).fmt;
