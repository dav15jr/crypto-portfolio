'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Currency, Coin, Context, Ledger, PortfolioHistory } from '../types';
import { fetchCoinList } from '../utils/api';

const CryptoContext = createContext<Context | null>(null);

function getPortfolioFromLocalStorage() {
  // Checks if window is available meaning that it has loaded on client side, before returing the portfolio in local storage if it exists.
  if (typeof window !== 'undefined') {
    const storedPortfolio = localStorage.getItem('portfolio');
    const storedHistory = localStorage.getItem('portfolioHistory');
    return {
      portfolio: storedPortfolio ? JSON.parse(storedPortfolio) : [],
      history: storedHistory ? JSON.parse(storedHistory) : [],
    };
  }
  return { portfolio: [], history: [] }; //Return an empty array or default value on the server
}

export default function CryptoListProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [coinList, setCoinList] = useState<Coin[]>([]);
  const [coinTable, setCoinTable] = useState<Coin[]>([]);
  const [currency, setCurrency] = useState<Currency>({
    name: 'usd',
    symbol: '$',
  });
  const { portfolio: savedPortfolio, history: savedHistory } =
    getPortfolioFromLocalStorage();
  const [portfolio, setPortfolio] = useState<Ledger[]>(savedPortfolio);
  const [portfolioHistory, setPortfolioHistory] =
    useState<PortfolioHistory[]>(savedHistory);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  async function getCoinsList(currency: Currency) {
    setLoading(true);
    setError(false);

    try {
      const coinList = await fetchCoinList(currency.name);

      if (!coinList.data) {
        throw new Error('Failed to fetch coin list');
      }
      setCoinList(coinList.data);
      setCoinTable(coinList.data);
    } catch (error) {
      setError(true);
      console.error('Error fetching coin list:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getCoinsList(currency);
  }, [currency]);

  // Save portfolio and history to localStorage when they change
  useEffect(() => {
    localStorage.setItem('portfolio', JSON.stringify(portfolio));
    localStorage.setItem('portfolioHistory', JSON.stringify(portfolioHistory));
  }, [portfolio, portfolioHistory]);

  return (
    <CryptoContext.Provider
      value={{
        coinList,
        currency,
        setCurrency,
        coinTable,
        setCoinTable,
        portfolio,
        setPortfolio,
        portfolioHistory,
        setPortfolioHistory,
        loading,
        error,
      }}
    >
      {children}
    </CryptoContext.Provider>
  );
}

export function useCryptoContext() {
  const context = useContext(CryptoContext);

  if (!context) {
    // if context does not exist ie is null then throw an error
    throw new Error('useCryptoContext must be used within a CryptoProvider');
  }
  return context; // At this point, context is guaranteed to not be null
}
