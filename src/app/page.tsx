'use client';

import { useState } from 'react';
import { useCryptoContext } from './Context/context';
import InfoSection from './Components/HomePage/InfoSection';
import HeroSection from './Components/HomePage/HeroSection';
import Link from 'next/link';
import CoinTable from './Components/HomePage/CoinTable';

export default function Home() {
  const [coinSearch, setCoinSearch] = useState<string>('');
  const { coinList, setCoinTable, loading, error } = useCryptoContext();

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    setCoinSearch(e.target.value);
    if (e.target.value === '') {
      setCoinTable(coinList);
    }
  }
  async function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const coins = await coinList.filter((coin) => {
      return coin.name.toLowerCase().includes(coinSearch.toLowerCase());
    });
    setCoinTable(coins);
  }

  return (
    <main className="font-[family-name:var(--font-geist-sans)]  dark:bg-black dark:text-white px-2">
      <div className="flex flex-col w-full min-h-screen items-center justify-center">
        <HeroSection />
        <h1 className="text-2xl sm:text-4xl" data-testid="cyp-title">
          Welcome to CRYPTO KNIGHT
        </h1>
        <p className="text-lg sm:text-xl text-center pt-5">
          {' '}
          Find your coin&#39;s the latest price
        </p>
        <form
          onSubmit={handleSearch}
          className="sm:text-lg "
          aria-label="crypto coin search form"
        >
          <input
            type="text"
            placeholder="Enter your Crypto"
            list="coinlist"
            onChange={handleInput}
            value={coinSearch}
            className="bg-purple-100 border dark:text-black border-purple-700 rounded-lg p-2 hover:border-purple-500 hover:border-2 transition duration-700 ease-in-out"
            autoFocus
            required
          />
          <datalist id="coinlist">
            {coinList.map((coin, index) => (
              <option key={index} value={coin.name} />
            ))}
          </datalist>
          <button
            className="border border-purple-900 bg-purple-600 rounded-3xl p-2 m-4 text-white transition active:scale-90 hover:bg-green-800"
            type="submit"
            aria-label="coin search button"
          >
            Search
          </button>
        </form>
        {loading ? (
          <p className="text-lg sm:text-xl">Loading...</p>
        ) : error ? (
          <p className="text-red-600 text-lg font-semibold sm:text-xl m-14">
            Error Fetching Prices
          </p>
        ) : (
          <CoinTable />
        )}
        <Link
          className="border bg-purple-500 rounded-full text-white hover:bg-purple-700 hover:border-green-500 text-sm sm:text-lg mt-6 p-1 px-3 transition active:scale-90"
          href="/portfolio"
          aria-label="Go to portfolio page"
        >
          Update your Portfolio
        </Link>
        <InfoSection />
      </div>
    </main>
  );
}
