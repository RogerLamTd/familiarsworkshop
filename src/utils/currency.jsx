import { createContext, useContext, useEffect, useState } from 'react';

// Prices are authored in HKD. User picks a currency from the toggle (no auto/geo);
// rates come from our Worker (/api/rates), which holds the exchangerate-api key.
const BASE = 'HKD';
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

export function CurrencyProvider({ children }) {
  const [code, setCodeState] = useState(() => {
    const saved = localStorage.getItem(STORE);
    return CURRENCIES.some((c) => c.code === saved) ? saved : BASE; // else default HKD
  });
  const setCode = (c) => { localStorage.setItem(STORE, c); setCodeState(c); };

  const [rates, setRates] = useState(null); // { USD: 0.128, ... } per 1 HKD
  useEffect(() => {
    fetch('/api/rates').then((r) => (r.ok ? r.json() : null)).then(setRates).catch(() => {});
  }, []);

  // default to HKD until rates load, or if they fail
  const fmt = (hkd) => (rates?.[code] ? money(hkd * rates[code], code) : money(hkd, BASE));

  return <Ctx.Provider value={{ code, setCode, fmt }}>{children}</Ctx.Provider>;
}

export const useCurrency = () => useContext(Ctx);
export const useFormatPrice = () => useContext(Ctx).fmt;
